/**
 * Detects whether an image/video frame contains a human / face / person.
 * Combines Native Shape Detection API (FaceDetector) + Skin Tone Distribution Analysis.
 */
export async function detectHuman(mediaElement) {
  if (!mediaElement) return false;

  // 1. Check native browser FaceDetector API if supported
  if (typeof window !== 'undefined' && 'FaceDetector' in window) {
    try {
      const detector = new window.FaceDetector({ fastMode: true, maxDetectedFaces: 2 });
      const faces = await detector.detect(mediaElement);
      if (faces && faces.length > 0) {
        return {
          isHuman: true,
          confidence: 0.95,
          reason: 'Human face detected by sensor'
        };
      }
    } catch (e) {
      // fallback to pixel skin analysis
    }
  }

  // 2. Pixel Skin-Tone & Feature Analysis via Offscreen Canvas
  try {
    const width = mediaElement.videoWidth || mediaElement.naturalWidth || mediaElement.width || 320;
    const height = mediaElement.videoHeight || mediaElement.naturalHeight || mediaElement.height || 240;

    if (width <= 0 || height <= 0) return false;

    // Downscale for fast real-time analysis (e.g. 100x100)
    const sampleW = 100;
    const sampleH = 100;
    const canvas = document.createElement('canvas');
    canvas.width = sampleW;
    canvas.height = sampleH;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    // Focus on center 70% where face/person would be centered in reticle
    const sx = width * 0.15;
    const sy = height * 0.15;
    const sWidth = width * 0.7;
    const sHeight = height * 0.7;

    ctx.drawImage(mediaElement, sx, sy, sWidth, sHeight, 0, 0, sampleW, sampleH);
    const imgData = ctx.getImageData(0, 0, sampleW, sampleH);
    const data = imgData.data;

    let skinPixels = 0;
    const totalPixels = sampleW * sampleH;

    for (let i = 0; i < data.length; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // YCbCr skin tone detection standard formula
      const Y = 0.299 * r + 0.587 * g + 0.114 * b;
      const Cb = 128 - 0.168736 * r - 0.331264 * g + 0.5 * b;
      const Cr = 128 + 0.5 * r - 0.418688 * g - 0.081312 * b;

      // RGB heuristic + YCbCr chromaticity cluster for human skin
      const isRgbSkin =
        r > 80 &&
        g > 40 &&
        b > 20 &&
        r > g &&
        r > b &&
        Math.abs(r - g) > 12 &&
        Math.max(r, g, b) - Math.min(r, g, b) > 15;

      const isYCbCrSkin = Cb >= 77 && Cb <= 128 && Cr >= 133 && Cr <= 175;

      if (isRgbSkin && isYCbCrSkin) {
        skinPixels++;
      }
    }

    const skinRatio = skinPixels / totalPixels;

    // If center frame contains more than 35% skin tone distribution, human/face is present
    if (skinRatio > 0.35) {
      return {
        isHuman: true,
        confidence: Math.min(0.92, skinRatio * 1.5),
        reason: 'Human skin tone pattern detected in target area'
      };
    }
  } catch (err) {
    console.warn('Human detector error:', err);
  }

  return { isHuman: false };
}
