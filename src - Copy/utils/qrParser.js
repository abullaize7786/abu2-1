import jsQR from 'jsqr';

/**
 * Scans an HTMLVideoElement or HTMLCanvasElement or ImageData for QR codes.
 * Uses native BarcodeDetector if available, otherwise jsQR.
 */
export async function detectCodeFromMedia(videoOrCanvas) {
  if (!videoOrCanvas) return null;

  // 1. Try native BarcodeDetector API (modern Android/Chrome/Edge/Safari)
  if (typeof window !== 'undefined' && 'BarcodeDetector' in window) {
    try {
      const formats = ['qr_code', 'ean_13', 'ean_8', 'code_128', 'code_39', 'upc_a', 'upc_e'];
      const detector = new window.BarcodeDetector({ formats });
      const barcodes = await detector.detect(videoOrCanvas);
      if (barcodes && barcodes.length > 0) {
        return {
          rawValue: barcodes[0].rawValue,
          format: barcodes[0].format || 'qr_code'
        };
      }
    } catch (e) {
      // Fall through to jsQR
    }
  }

  // 2. Fallback to jsQR using 2D Canvas
  try {
    const width = videoOrCanvas.videoWidth || videoOrCanvas.width || 480;
    const height = videoOrCanvas.videoHeight || videoOrCanvas.height || 480;
    if (width <= 0 || height <= 0) return null;

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(videoOrCanvas, 0, 0, width, height);

    const imageData = ctx.getImageData(0, 0, width, height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert'
    });

    if (code && code.data) {
      return {
        rawValue: code.data,
        format: 'qr_code',
        location: code.location
      };
    }
  } catch (err) {
    // ignore scanning tick errors
  }

  return null;
}

/**
 * Parses decoded QR/Barcode text into structured product details.
 */
export function parseScannedCode(codeResult) {
  if (!codeResult || !codeResult.rawValue) return null;
  const text = codeResult.rawValue.trim();
  const format = codeResult.format || 'qr_code';

  let parsed = {
    name: '',
    variant: '',
    netQuantity: '',
    mrp: '',
    unitSalePrice: '',
    mfgDate: '',
    bestBefore: '',
    manufacturer: '',
    countryOfOrigin: 'India',
    barcode: text,
    scanFormat: format,
    rawText: text
  };

  // Try 1: JSON payload
  if ((text.startsWith('{') && text.endsWith('}')) || (text.startsWith('[') && text.endsWith(']'))) {
    try {
      const json = JSON.parse(text);
      parsed.name = json.name || json.title || json.product || '';
      parsed.variant = json.variant || json.size || '';
      parsed.netQuantity = json.netQuantity || json.net_weight || json.quantity || '';
      parsed.mrp = json.mrp || json.price ? `? ${json.mrp || json.price}` : '';
      parsed.unitSalePrice = json.unitSalePrice || json.usp || '';
      parsed.mfgDate = json.mfgDate || json.mfg || '';
      parsed.bestBefore = json.bestBefore || json.exp || '';
      parsed.manufacturer = json.manufacturer || json.mfdBy || '';
      parsed.countryOfOrigin = json.countryOfOrigin || json.origin || 'India';
      return parsed;
    } catch (e) {
      // not valid json, continue
    }
  }

  // Try 2: URL with query parameters (e.g. GS1 or product landing page)
  if (text.startsWith('http://') || text.startsWith('https://')) {
    try {
      const url = new URL(text);
      const params = url.searchParams;
      
      const paramName = params.get('name') || params.get('product') || params.get('item');
      const paramMrp = params.get('mrp') || params.get('price');
      const paramNet = params.get('net') || params.get('qty') || params.get('weight');
      const paramMfg = params.get('mfg');
      const paramExp = params.get('exp');
      const paramMfr = params.get('mfr') || params.get('brand');

      if (paramName || paramMrp) {
        parsed.name = paramName || url.hostname;
        parsed.mrp = paramMrp ? `? ${paramMrp}` : '';
        parsed.netQuantity = paramNet || '';
        parsed.mfgDate = paramMfg || '';
        parsed.bestBefore = paramExp || '';
        parsed.manufacturer = paramMfr || url.hostname;
        return parsed;
      }

      // If URL without query params
      parsed.name = `Product at ${url.hostname}`;
      parsed.variant = url.pathname.slice(0, 30);
      return parsed;
    } catch (e) {
      // not url
    }
  }

  // Try 3: Key-value line pairs (e.g., "MRP: 20 \n Net: 50g")
  const lines = text.split(/[\r\n,;|]+/);
  let foundAny = false;

  for (const line of lines) {
    const parts = line.split(/[:=-]/);
    if (parts.length >= 2) {
      const k = parts[0].trim().toLowerCase();
      const v = parts.slice(1).join(':').trim();

      if (k.includes('product') || k.includes('name') || k.includes('item')) {
        parsed.name = v;
        foundAny = true;
      } else if (k.includes('mrp') || k.includes('price')) {
        parsed.mrp = v.startsWith('?') ? v : `? ${v}`;
        foundAny = true;
      } else if (k.includes('net') || k.includes('weight') || k.includes('qty')) {
        parsed.netQuantity = v;
        foundAny = true;
      } else if (k.includes('mfg') || k.includes('date')) {
        parsed.mfgDate = v;
        foundAny = true;
      } else if (k.includes('exp') || k.includes('before')) {
        parsed.bestBefore = v;
        foundAny = true;
      } else if (k.includes('usp') || k.includes('unit')) {
        parsed.unitSalePrice = v;
        foundAny = true;
      } else if (k.includes('mfr') || k.includes('mfd') || k.includes('maker')) {
        parsed.manufacturer = v;
        foundAny = true;
      }
    }
  }

  if (foundAny) {
    if (!parsed.name) parsed.name = 'Scanned Product';
    return parsed;
  }

  // Fallback: Raw Barcode or Simple Text
  parsed.name = `Scanned ${format === 'qr_code' ? 'QR Code' : 'Barcode'}`;
  parsed.variant = text.length > 25 ? text.slice(0, 25) + '...' : text;
  return parsed;
}
