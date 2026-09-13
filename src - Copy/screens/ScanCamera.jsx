import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  Zap,
  ZapOff,
  Image as ImageIcon,
  Camera,
  RefreshCw,
  CheckCircle2,
  UserX
} from 'lucide-react';
import { detectCodeFromMedia, parseScannedCode } from '../utils/qrParser';
import { detectHuman } from '../utils/humanDetector';

export default function ScanCamera({
  onNavigate,
  onImageCaptured,
  onQRDetected
}) {
  const [flashOn, setFlashOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState('environment'); // 'environment' (back) | 'user' (front)
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [isScanning] = useState(true);
  const [detectedQR, setDetectedQR] = useState(null);
  const [humanError, setHumanError] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);
  const fileInputRef = useRef(null);

  // Start real mobile back camera
  const startCamera = useCallback(async (facing = 'environment') => {
    setCameraError(null);
    setCameraActive(false);

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }

    try {
      const constraints = {
        video: {
          facingMode: { ideal: facing },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      let stream;
      try {
        stream = await navigator.mediaDevices.getUserMedia(constraints);
      } catch (err1) {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch((e) => console.log('Video play error:', e));
          setCameraActive(true);
        };
      }
    } catch (err) {
      console.error('Camera stream error:', err);
      setCameraError('Unable to access camera. Please allow camera permissions or upload an image.');
      setCameraActive(false);
    }
  }, []);

  useEffect(() => {
    startCamera(cameraFacing);

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [startCamera, cameraFacing]);

  // Continuous scanning loop (QR/Barcode only)
  useEffect(() => {
    if (!cameraActive) return;

    scanIntervalRef.current = setInterval(async () => {
      if (!videoRef.current || videoRef.current.readyState < 2) return;

      // Check for QR / Barcode
      try {
        const result = await detectCodeFromMedia(videoRef.current);
        if (result && result.rawValue) {
          clearInterval(scanIntervalRef.current);
          handleCodeFound(result);
        }
      } catch (e) {
        // ignore scan ticks
      }
    }, 300);

    return () => {
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
      }
    };
  }, [cameraActive]);

  const handleCodeFound = (codeResult) => {
    let snapshot = null;
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      snapshot = canvas.toDataURL('image/jpeg', 0.85);
    }

    const parsedData = parseScannedCode(codeResult);
    if (snapshot) parsedData.frontImage = snapshot;

    setDetectedQR({
      raw: codeResult.rawValue,
      format: codeResult.format,
      parsed: parsedData,
      image: snapshot
    });

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(100);
    }

    setTimeout(() => {
      if (onQRDetected) {
        onQRDetected(parsedData, snapshot);
      } else if (onImageCaptured) {
        onImageCaptured(snapshot, parsedData);
      }
      onNavigate('extracted-details');
    }, 700);
  };

  const handleCapture = async () => {
    if (videoRef.current && cameraActive) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      // Verify that the frame does not contain a human
      const humanCheck = await detectHuman(canvas);
      if (humanCheck && humanCheck.isHuman) {
        setHumanError('Human / Person detected! Legal Metrology inspections are strictly for packaged commodities and product labels only.');
        return;
      }

      // Check if this captured frame has a QR code or barcode
      try {
        const codeResult = await detectCodeFromMedia(canvas);
        if (codeResult && codeResult.rawValue) {
          handleCodeFound(codeResult);
          return;
        }
      } catch (err) {
        // continue
      }

      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      if (onImageCaptured) {
        onImageCaptured(dataUrl);
      }
      onNavigate('crop-preview');
    } else {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    }
  };

  const handleSwitchCamera = () => {
    const nextFacing = cameraFacing === 'environment' ? 'user' : 'environment';
    setCameraFacing(nextFacing);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const dataUrl = evt.target.result;
      const img = new window.Image();
      img.onload = async () => {
        // Check for human in uploaded image
        const humanCheck = await detectHuman(img);
        if (humanCheck && humanCheck.isHuman) {
          setHumanError('Human / Person detected in uploaded photo! Please upload a photo of a packaged product or label.');
          return;
        }

        const codeResult = await detectCodeFromMedia(img);
        if (codeResult && codeResult.rawValue) {
          const parsed = parseScannedCode(codeResult);
          parsed.frontImage = dataUrl;
          if (onQRDetected) {
            onQRDetected(parsed, dataUrl);
          } else if (onImageCaptured) {
            onImageCaptured(dataUrl, parsed);
          }
          onNavigate('extracted-details');
        } else {
          if (onImageCaptured) {
            onImageCaptured(dataUrl);
          }
          onNavigate('crop-preview');
        }
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="screen-container camera-screen" style={{ background: '#090d16', position: 'relative' }}>
      {/* Human Detected Error Modal Overlay */}
      {humanError && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 100,
            background: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 24,
            animation: 'fadeIn 0.25s ease'
          }}
        >
          <div
            style={{
              background: '#0f172a',
              border: '2px solid #ef4444',
              borderRadius: 22,
              padding: '26px 22px',
              textAlign: 'center',
              color: '#fff',
              maxWidth: 320,
              boxShadow: '0 25px 50px rgba(239, 68, 68, 0.25)'
            }}
          >
            <div
              style={{
                width: 68,
                height: 68,
                borderRadius: '50%',
                background: 'rgba(239, 68, 68, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                border: '1px solid rgba(239, 68, 68, 0.3)'
              }}
            >
              <UserX size={38} color="#ef4444" />
            </div>
            <h4 style={{ margin: '0 0 10px', fontSize: '1.15rem', color: '#f87171', fontWeight: 700 }}>
              Error: Human Detected!
            </h4>
            <p style={{ margin: '0 0 14px', fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
              {humanError}
            </p>
            <div
              style={{
                background: 'rgba(239, 68, 68, 0.1)',
                padding: '8px 12px',
                borderRadius: 8,
                marginBottom: 20,
                fontSize: '0.75rem',
                color: '#fca5a5',
                textAlign: 'left'
              }}
            >
              <strong>Notice:</strong> Legal Metrology verification strictly checks mandatory packaging declarations (MRP, Net Qty, Mfg Date) on consumer commodities.
            </div>
            <button
              type="button"
              className="btn-primary full-width"
              onClick={() => setHumanError(null)}
              style={{ background: '#ef4444', borderColor: '#ef4444' }}
            >
              Scan Packaged Commodity
            </button>
          </div>
        </div>
      )}

      {/* Top Controls Overlay */}
      <div className="camera-header-overlay" style={{ zIndex: 10 }}>
        <button
          type="button"
          className="camera-icon-btn"
          onClick={() => onNavigate('scan-method')}
          title="Back"
        >
          <ArrowLeft size={20} color="#fff" />
        </button>
        <h4 className="camera-title">
          {cameraFacing === 'environment' ? 'Back Camera' : 'Front Camera'}
        </h4>
        <button
          type="button"
          className={`camera-icon-btn ${flashOn ? 'flash-active' : ''}`}
          onClick={() => setFlashOn(!flashOn)}
          title="Flash"
        >
          {flashOn ? <Zap size={20} color="#facc15" /> : <ZapOff size={20} color="#fff" />}
        </button>
      </div>

      {/* Viewfinder Area */}
      <div className="camera-viewfinder-area" style={{ background: '#000', position: 'relative' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="camera-video-stream"
          style={{
            display: cameraActive ? 'block' : 'none',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        />

        {!cameraActive && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
              textAlign: 'center',
              color: '#94a3b8',
              height: '100%'
            }}
          >
            <Camera size={48} color="#64748b" style={{ marginBottom: 12 }} />
            <h5 style={{ color: '#f1f5f9', margin: '0 0 6px', fontSize: '1rem' }}>
              {cameraError ? 'Camera Access Required' : 'Starting Camera...'}
            </h5>
            <p style={{ fontSize: '0.8rem', maxWidth: 260, margin: '0 0 16px', lineHeight: 1.4 }}>
              {cameraError || 'Requesting back camera permission for real-time label and QR scanning.'}
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => startCamera(cameraFacing)}
              >
                Retry Camera
              </button>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                onClick={() => fileInputRef.current?.click()}
              >
                Upload Photo
              </button>
            </div>
          </div>
        )}

        {detectedQR && (
          <div
            style={{
              position: 'absolute',
              top: 70,
              left: 16,
              right: 16,
              zIndex: 30,
              background: 'rgba(16, 185, 129, 0.95)',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              animation: 'slideDown 0.3s ease'
            }}
          >
            <CheckCircle2 size={22} color="#fff" />
            <div style={{ flex: 1, minWidth: 0 }}>
              <strong style={{ display: 'block', fontSize: '0.85rem' }}>
                QR / Barcode Detected!
              </strong>
              <span style={{ fontSize: '0.75rem', opacity: 0.9, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                {detectedQR.raw}
              </span>
            </div>
          </div>
        )}

        {cameraActive && (
          <div className="camera-reticle" style={{ borderColor: detectedQR ? '#10b981' : '#38bdf8' }}>
            <div className="reticle-corner top-left"></div>
            <div className="reticle-corner top-right"></div>
            <div className="reticle-corner bottom-left"></div>
            <div className="reticle-corner bottom-right"></div>
            {isScanning && !detectedQR && <div className="scanning-laser-line"></div>}
          </div>
        )}

        {cameraActive && (
          <div className="camera-instruction-pill" style={{ zIndex: 5 }}>
            Align Packaged Commodity or Label within frame
          </div>
        )}
      </div>

      {/* Bottom Shutter Controls */}
      <div className="camera-bottom-controls" style={{ zIndex: 10 }}>
        <button
          type="button"
          className="camera-control-icon-btn"
          onClick={() => fileInputRef.current?.click()}
          title="Pick Image / QR from Gallery"
        >
          <ImageIcon size={22} color="#fff" />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          accept="image/*"
          onChange={handleFileChange}
        />

        <button
          type="button"
          className="shutter-outer-ring"
          onClick={handleCapture}
          title="Take Photo"
        >
          <div className="shutter-inner-circle"></div>
        </button>

        <button
          type="button"
          className="camera-control-icon-btn"
          onClick={handleSwitchCamera}
          title="Switch Back / Front Camera"
        >
          <RefreshCw size={20} color="#fff" />
        </button>
      </div>
    </div>
  );
}
