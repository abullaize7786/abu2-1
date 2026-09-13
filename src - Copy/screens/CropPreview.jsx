import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowLeft,
  Crop as CropIcon,
  RotateCcw,
  Check,
  CheckCircle2,
  Sliders,
  Upload,
  UserX,
  XCircle,
  Sparkles
} from 'lucide-react';
import { detectCodeFromMedia, parseScannedCode } from '../utils/qrParser';
import { validatePackagingSubject } from '../utils/packagingValidator';
import { extractDeclarationsFromImage } from '../utils/ocrService';

export default function CropPreview({
  onNavigate,
  imageSrc,
  onCroppedImageSave,
  onExtractedProduct,
  onQRDetected
}) {
  const [currentImage, setCurrentImage] = useState(imageSrc || null);
  const [originalImage, setOriginalImage] = useState(imageSrc || null);
  const [isCropped, setIsCropped] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [humanWarning, setHumanWarning] = useState(null);

  // Crop Inset percentages (0 to 40%)
  const [cropInset, setCropInset] = useState({ top: 10, bottom: 10, left: 10, right: 10 });
  const [cropPreset, setCropPreset] = useState('tight'); // 'tight' | 'center' | 'bottom' | 'full'

  const imgRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (imageSrc) {
      setCurrentImage(imageSrc);
      setOriginalImage(imageSrc);
      setIsCropped(false);
      setHumanWarning(null);
    }
  }, [imageSrc]);

  // Apply preset crop boundaries
  const handlePresetChange = (preset) => {
    setCropPreset(preset);
    if (preset === 'tight') {
      setCropInset({ top: 12, bottom: 12, left: 12, right: 12 });
    } else if (preset === 'center') {
      setCropInset({ top: 20, bottom: 20, left: 15, right: 15 });
    } else if (preset === 'bottom') {
      setCropInset({ top: 40, bottom: 8, left: 10, right: 10 });
    } else if (preset === 'full') {
      setCropInset({ top: 2, bottom: 2, left: 2, right: 2 });
    }
  };

  // Perform actual canvas crop!
  const executeCrop = () => {
    if (!currentImage) return;

    setIsProcessing(true);
    setHumanWarning(null);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      try {
        const naturalW = img.naturalWidth || img.width;
        const naturalH = img.naturalHeight || img.height;

        const cropX = (cropInset.left / 100) * naturalW;
        const cropY = (cropInset.top / 100) * naturalH;
        const cropW = naturalW - cropX - (cropInset.right / 100) * naturalW;
        const cropH = naturalH - cropY - (cropInset.bottom / 100) * naturalH;

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(50, Math.floor(cropW));
        canvas.height = Math.max(50, Math.floor(cropH));
        const ctx = canvas.getContext('2d');

        ctx.drawImage(
          img,
          cropX,
          cropY,
          cropW,
          cropH,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Validate human vs packaging in cropped zone
        const validation = await validatePackagingSubject(canvas);
        if (!validation.isValid) {
          setIsProcessing(false);
          setHumanWarning('Proper-ah scan pannunga! Human detected in cropped area.');
          return;
        }

        const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.92);
        setCurrentImage(croppedDataUrl);
        setIsCropped(true);

        // Scan cropped region for QR / Barcodes
        const detected = await detectCodeFromMedia(canvas);
        if (detected && detected.rawValue) {
          const parsed = parseScannedCode(detected);
          parsed.frontImage = croppedDataUrl;
          if (onQRDetected) {
            onQRDetected(parsed, croppedDataUrl);
          }
        }

        if (onCroppedImageSave) {
          onCroppedImageSave(croppedDataUrl);
        }
      } catch (err) {
        console.error('Canvas crop error:', err);
      } finally {
        setIsProcessing(false);
      }
    };
    img.src = currentImage;
  };

  // Reset to original uncropped image
  const handleReset = () => {
    setCurrentImage(originalImage);
    setIsCropped(false);
    setHumanWarning(null);
    setCropInset({ top: 10, bottom: 10, left: 10, right: 10 });
    setCropPreset('tight');
  };

  // Confirm and extract biscuit declarations via OCR
  const handleNext = async () => {
    if (!currentImage) return;

    setIsProcessing(true);
    setHumanWarning(null);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // STEP 1: Reject human scans!
      const validation = await validatePackagingSubject(canvas);
      if (!validation.isValid) {
        setIsProcessing(false);
        setHumanWarning(
          'Proper-ah scan pannunga! Human detected. Please scan a valid biscuit or product package properly.'
        );
        return; // BLOCKED!
      }

      // STEP 2: Extract text declarations via OCR (biscuits / packaging)
      try {
        const ocrResult = await extractDeclarationsFromImage(canvas);
        if (ocrResult?.productData && ocrResult.productData.name) {
          ocrResult.productData.frontImage = currentImage;
          if (onExtractedProduct) {
            onExtractedProduct(ocrResult.productData, currentImage);
          }
        } else if (onCroppedImageSave) {
          onCroppedImageSave(currentImage);
        }
      } catch (e) {
        if (onCroppedImageSave) {
          onCroppedImageSave(currentImage);
        }
      }

      setIsProcessing(false);
      onNavigate('extracted-details');
    };
    img.src = currentImage;
  };

  const handleUploadNew = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCurrentImage(evt.target.result);
        setOriginalImage(evt.target.result);
        setIsCropped(false);
        setHumanWarning(null);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="screen-container">
      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('scan-camera')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Crop &amp; Confirm</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body preview-body" style={{ padding: '16px' }}>
        {/* Human Rejection Warning Banner */}
        {humanWarning && (
          <div
            style={{
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: 12,
              padding: '12px 14px',
              marginBottom: 12,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              color: '#b91c1c',
              animation: 'shake 0.4s ease'
            }}
          >
            <UserX size={24} color="#dc2626" style={{ flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>
                Proper-ah Scan Pannunga!
              </strong>
              <p style={{ margin: 0, fontSize: '0.78rem', lineHeight: 1.3 }}>
                {humanWarning}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setHumanWarning(null)}
              style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer' }}
            >
              <XCircle size={18} />
            </button>
          </div>
        )}

        {/* Preview Frame with crop box */}
        <div
          className="preview-image-container"
          style={{
            position: 'relative',
            borderRadius: 14,
            overflow: 'hidden',
            background: '#0f172a',
            minHeight: 280,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {currentImage ? (
            <>
              <img
                ref={imgRef}
                src={currentImage}
                alt="Captured Label"
                className="preview-image"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 380,
                  objectFit: 'contain',
                  display: 'block'
                }}
              />

              {/* Interactive Crop Outline Box */}
              {!isCropped && (
                <div
                  style={{
                    position: 'absolute',
                    top: `${cropInset.top}%`,
                    bottom: `${cropInset.bottom}%`,
                    left: `${cropInset.left}%`,
                    right: `${cropInset.right}%`,
                    border: '2px solid #38bdf8',
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.55)',
                    pointerEvents: 'none',
                    borderRadius: 8
                  }}
                >
                  <div className="crop-corner top-left"></div>
                  <div className="crop-corner top-right"></div>
                  <div className="crop-corner bottom-left"></div>
                  <div className="crop-corner bottom-right"></div>
                  <div className="crop-grid-lines">
                    <div className="grid-h1"></div>
                    <div className="grid-h2"></div>
                    <div className="grid-v1"></div>
                    <div className="grid-v2"></div>
                  </div>
                </div>
              )}

              {/* Cropped Badge */}
              {isCropped && (
                <div
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'rgba(16, 185, 129, 0.9)',
                    color: '#fff',
                    padding: '4px 10px',
                    borderRadius: 20,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <CheckCircle2 size={14} /> Cropped
                </div>
              )}
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: 30, color: '#94a3b8' }}>
              <p style={{ margin: '0 0 12px', fontSize: '0.9rem' }}>No image captured.</p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Biscuit / Label Photo
              </button>
            </div>
          )}
        </div>

        {/* Crop Controls & Presets */}
        {currentImage && !isCropped && (
          <div style={{ marginTop: 14, background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                Crop Frame Preset
              </span>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                Adjust Area
              </span>
            </div>

            <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
              <button
                type="button"
                className={`btn-preview-sub ${cropPreset === 'tight' ? 'active' : ''}`}
                style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
                onClick={() => handlePresetChange('tight')}
              >
                Biscuit Label
              </button>
              <button
                type="button"
                className={`btn-preview-sub ${cropPreset === 'center' ? 'active' : ''}`}
                style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
                onClick={() => handlePresetChange('center')}
              >
                Center
              </button>
              <button
                type="button"
                className={`btn-preview-sub ${cropPreset === 'bottom' ? 'active' : ''}`}
                style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
                onClick={() => handlePresetChange('bottom')}
              >
                MRP / Specs
              </button>
              <button
                type="button"
                className={`btn-preview-sub ${cropPreset === 'full' ? 'active' : ''}`}
                style={{ flex: 1, padding: '6px 4px', fontSize: '0.75rem' }}
                onClick={() => handlePresetChange('full')}
              >
                Full Pack
              </button>
            </div>
          </div>
        )}

        {/* Action button row */}
        <div className="preview-actions-row" style={{ marginTop: 14 }}>
          {!isCropped ? (
            <button
              type="button"
              className="btn-preview-sub active"
              onClick={executeCrop}
              disabled={isProcessing}
              style={{ flex: 1, background: '#3b82f6', color: '#fff', border: 'none' }}
            >
              <CropIcon size={16} />
              <span>{isProcessing ? 'Cropping...' : 'Crop Selection'}</span>
            </button>
          ) : (
            <button
              type="button"
              className="btn-preview-sub"
              onClick={handleReset}
              style={{ flex: 1 }}
            >
              <RotateCcw size={16} />
              <span>Reset Crop</span>
            </button>
          )}

          <button
            type="button"
            className="btn-preview-sub"
            onClick={() => onNavigate('scan-camera')}
          >
            <RotateCcw size={16} />
            <span>Retake</span>
          </button>
        </div>

        {/* Hidden upload input */}
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleUploadNew}
        />

        {/* Primary Next Button */}
        <div className="preview-next-wrap" style={{ marginTop: 16 }}>
          <button
            type="button"
            className="btn-primary full-width"
            onClick={handleNext}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <span className="btn-spinner-wrap">
                <span className="spinner-dots"></span> Extracting Biscuit Declarations...
              </span>
            ) : (
              'Confirm & Extract Details'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
