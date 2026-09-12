import { createWorker } from 'tesseract.js';
import { parseBiscuitAndPackageText } from './packagingValidator';

let workerPromise = null;

async function getWorker() {
  if (!workerPromise) {
    workerPromise = (async () => {
      const worker = await createWorker('eng');
      return worker;
    })();
  }
  return workerPromise;
}

/**
 * Runs OCR on an image URL or canvas and extracts packaged commodity declarations.
 */
export async function extractDeclarationsFromImage(imageSrcOrCanvas, onProgress) {
  try {
    const worker = await getWorker();
    const ret = await worker.recognize(imageSrcOrCanvas);
    const ocrText = ret?.data?.text || '';

    // Extract biscuit/packaging fields
    const parsed = parseBiscuitAndPackageText(ocrText);
    return {
      success: true,
      text: ocrText,
      productData: parsed
    };
  } catch (err) {
    console.warn('Tesseract OCR error:', err);
    // Fallback parser if worker fails
    return {
      success: false,
      text: '',
      productData: null
    };
  }
}
