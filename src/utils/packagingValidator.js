/**
 * Utility to validate whether a scanned frame is a valid packaged commodity
 * and rejects human faces/bodies or non-packaging subjects.
 */

// Native FaceDetector check if supported in Chromium
export async function detectHumanFace(canvasOrVideo) {
  if (typeof window !== 'undefined' && 'FaceDetector' in window) {
    try {
      const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 3 });
      const faces = await detector.detect(canvasOrVideo);
      if (faces && faces.length > 0) {
        return { isHuman: true, faceCount: faces.length };
      }
    } catch (e) {
      // Fall through to pixel heuristics
    }
  }
  return { isHuman: false };
}

/**
 * Analyses image pixel data to detect human skin tones vs packaging surfaces.
 * Evaluates skin tone percentage, color uniformity, and text/edge complexity.
 */
export function analyzeImageContent(canvas) {
  if (!canvas) return { isHuman: false, hasPackagingFeatures: true };

  try {
    const width = canvas.width;
    const height = canvas.height;
    if (width <= 0 || height <= 0) return { isHuman: false, hasPackagingFeatures: true };

    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    // Sample a centered region (where face or subject is focused)
    const sampleW = Math.floor(width * 0.6);
    const sampleH = Math.floor(height * 0.6);
    const startX = Math.floor(width * 0.2);
    const startY = Math.floor(height * 0.2);

    const imgData = ctx.getImageData(startX, startY, sampleW, sampleH);
    const data = imgData.data;
    const totalPixels = sampleW * sampleH;

    let skinPixels = 0;
    let edgeContrastCount = 0;

    for (let i = 0; i < data.length; i += 16) { // step by 4 pixels (16 bytes)
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Standard RGB Skin Color rule (Kovac et al. / Peer et al.)
      const isSkin =
        r > 95 &&
        g > 40 &&
        b > 20 &&
        r - g > 15 &&
        r > b &&
        Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
        Math.abs(r - g) > 15;

      if (isSkin) {
        skinPixels++;
      }

      // Check contrast / edges (packaging has sharp borders, text, contrast)
      if (i + 16 < data.length) {
        const nextR = data[i + 16];
        if (Math.abs(r - nextR) > 60) {
          edgeContrastCount++;
        }
      }
    }

    const sampledCount = totalPixels / 4;
    const skinRatio = skinPixels / sampledCount;
    const edgeRatio = edgeContrastCount / sampledCount;

    // High skin ratio (> 38%) + low high-contrast text edges indicates a human subject/face
    const isLikelyHuman = skinRatio > 0.38 && edgeRatio < 0.25;

    return {
      isHuman: isLikelyHuman,
      skinRatio,
      edgeRatio,
      hasPackagingFeatures: edgeRatio > 0.08 || skinRatio < 0.35
    };
  } catch (err) {
    return { isHuman: false, hasPackagingFeatures: true };
  }
}

/**
 * Validates whether the frame/snapshot is acceptable for Legal Metrology inspection.
 */
export async function validatePackagingSubject(canvasOrVideo) {
  // 1. Native face detection
  const faceCheck = await detectHumanFace(canvasOrVideo);
  if (faceCheck.isHuman) {
    return {
      isValid: false,
      errorType: 'HUMAN_DETECTED',
      message: 'Human detected! Proper-ah scan pannunga. Please scan only packaged commodities (biscuits, food packets, etc.).'
    };
  }

  // 2. Pixel skin tone & packaging texture analysis
  if (canvasOrVideo instanceof HTMLCanvasElement) {
    const analysis = analyzeImageContent(canvasOrVideo);
    if (analysis.isHuman) {
      return {
        isValid: false,
        errorType: 'HUMAN_DETECTED',
        message: 'Human face/person detected. Proper-ah scan pannunga! Scan only packaged products.'
      };
    }
  }

  return { isValid: true };
}

/**
 * Parses OCR extracted text specifically looking for Biscuit and FMCG declarations.
 */
export function parseBiscuitAndPackageText(ocrText, originalData = {}) {
  const text = (ocrText || '').trim();
  const lower = text.toLowerCase();

  const result = {
    name: originalData.name || '',
    variant: originalData.variant || '',
    netQuantity: originalData.netQuantity || '',
    mrp: originalData.mrp || '',
    unitSalePrice: originalData.unitSalePrice || '',
    mfgDate: originalData.mfgDate || '',
    bestBefore: originalData.bestBefore || '',
    manufacturer: originalData.manufacturer || '',
    countryOfOrigin: originalData.countryOfOrigin || 'India',
    frontImage: originalData.frontImage || '/package_box.jpg',
    rawText: text
  };

  // 1. Detect Biscuit Brand Names
  if (lower.includes('parle-g') || lower.includes('parle g') || lower.includes('glucose biscuit')) {
    result.name = 'Parle-G Glucose Biscuits';
    result.variant = 'Regular Pack';
    result.manufacturer = 'Parle Products Pvt. Ltd., Mumbai';
  } else if (lower.includes('good day') || lower.includes('britannia good day')) {
    result.name = 'Britannia Good Day';
    result.variant = 'Cashew Cookies';
    result.manufacturer = 'Britannia Industries Ltd., Kolkata';
  } else if (lower.includes('marie gold') || lower.includes('marie')) {
    result.name = 'Britannia Marie Gold';
    result.variant = 'Tea Time Biscuits';
    result.manufacturer = 'Britannia Industries Ltd.';
  } else if (lower.includes('oreo')) {
    result.name = 'Cadbury Oreo Sandwich Biscuits';
    result.variant = 'Vanilla Cream';
    result.manufacturer = 'Mondelez India Foods Pvt. Ltd.';
  } else if (lower.includes('sunfeast') || lower.includes('dark fantasy') || lower.includes('bounce')) {
    result.name = 'Sunfeast Biscuits';
    result.variant = 'Dark Fantasy / Choco Fill';
    result.manufacturer = 'ITC Limited, Kolkata';
  } else if (lower.includes('monaco')) {
    result.name = 'Parle Monaco Salted Biscuits';
    result.variant = 'Salted Crackers';
    result.manufacturer = 'Parle Products Pvt. Ltd.';
  } else if (lower.includes('hide & seek') || lower.includes('hide and seek')) {
    result.name = 'Parle Hide & Seek Chocolate Chip';
    result.variant = 'Choco Chip Cookies';
    result.manufacturer = 'Parle Products Pvt. Ltd.';
  } else if (lower.includes('biscuit') || lower.includes('cookies') || lower.includes('rusk')) {
    const firstLine = text.split(/[\r\n]+/)[0];
    result.name = firstLine && firstLine.length < 40 ? firstLine : 'Packaged Biscuits';
    result.variant = 'Standard Pack';
  }

  // 2. Extract MRP
  const mrpMatch = text.match(/(?:mrp|rs\.?|price|₹)[\s:]*([₹\d.,]+)/i);
  if (mrpMatch && mrpMatch[1]) {
    const val = mrpMatch[1].replace(/[^0-9.]/g, '');
    if (val) result.mrp = `? ${parseFloat(val).toFixed(2)}`;
  }

  // 3. Extract Net Quantity
  const netMatch = text.match(/(?:net\s*(?:wt\.?|weight|quantity|qty)?|weight)[\s:]*([0-9]+\s*(?:g|kg|gm|grams|ml|l))/i);
  if (netMatch && netMatch[1]) {
    result.netQuantity = netMatch[1].trim();
  } else {
    // Look for standalone 100g / 250g
    const standMatch = text.match(/\b([0-9]{2,4}\s*(?:g|gm|kg))\b/i);
    if (standMatch && standMatch[1]) {
      result.netQuantity = standMatch[1].trim();
    }
  }

  // 4. Extract Unit Sale Price
  const uspMatch = text.match(/(?:unit\s*sale\s*price|usp)[\s:]*([?\d.,\s\w/]+)/i);
  if (uspMatch && uspMatch[1]) {
    result.unitSalePrice = uspMatch[1].slice(0, 20).trim();
  } else if (result.mrp && result.netQuantity && result.netQuantity.includes('g')) {
    const priceNum = parseFloat(result.mrp.replace(/[^0-9.]/g, ''));
    const gramsNum = parseFloat(result.netQuantity.replace(/[^0-9.]/g, ''));
    if (priceNum && gramsNum && gramsNum > 0) {
      result.unitSalePrice = `? ${(priceNum / gramsNum).toFixed(2)} / g`;
    }
  }

  // 5. Extract Mfg Date
  const mfgMatch = text.match(/(?:mfg|mfd|pkd|packed)[\s.:]*([0-9]{1,2}[\/\-.][0-9]{2,4}|[A-Za-z]{3}[\/\-\s][0-9]{4})/i);
  if (mfgMatch && mfgMatch[1]) {
    result.mfgDate = mfgMatch[1].trim();
  }

  // 6. Extract Best Before / Expiry
  const expMatch = text.match(/(?:best\s*before|use\s*by|exp(?:iry)?)[\s.:]*([^\r\n]{4,35})/i);
  if (expMatch && expMatch[1]) {
    result.bestBefore = expMatch[1].trim();
  }

  // 7. Extract Manufacturer if not set
  if (!result.manufacturer) {
    const mfrMatch = text.match(/(?:mfd\s*by|manufactured\s*by|packed\s*by|marketed\s*by)[\s.:]*([^\r\n]{5,50})/i);
    if (mfrMatch && mfrMatch[1]) {
      result.manufacturer = mfrMatch[1].trim();
    }
  }

  // If name is still empty, use first clear line or default
  if (!result.name) {
    const lines = text.split(/[\r\n]+/).map(l => l.trim()).filter(l => l.length > 2 && l.length < 50);
    result.name = lines[0] || 'Packaged Commodity';
  }

  return result;
}
