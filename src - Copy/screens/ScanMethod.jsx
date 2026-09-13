import React, { useRef } from 'react';
import { ArrowLeft, Camera, Image, Barcode, Sparkles, HelpCircle, Edit3 } from 'lucide-react';

export default function ScanMethod({ onNavigate, onSelectMethod, onCustomImageUpload }) {
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (onCustomImageUpload) {
        onCustomImageUpload(url);
      }
      onNavigate('crop-preview');
    }
  };

  return (
    <div className="screen-container">

      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('dashboard')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Choose Scan Method</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        <div className="method-selection-list">
          {/* Card 1: Camera */}
          <div
            className="method-card"
            onClick={() => {
              onSelectMethod('camera');
              onNavigate('scan-camera');
            }}
          >
            <div className="method-icon-wrap">
              <Camera size={24} className="method-icon" />
            </div>
            <div className="method-info">
              <h4>Camera</h4>
              <p>Scan product / label in real time</p>
            </div>
          </div>

          {/* Card 2: Upload Image */}
          <div
            className="method-card"
            onClick={handleUploadClick}
          >
            <div className="method-icon-wrap">
              <Image size={24} className="method-icon" />
            </div>
            <div className="method-info">
              <h4>Upload Image</h4>
              <p>Pick an image from gallery</p>
            </div>
          </div>

          {/* Card 3: Scan Barcode */}
          <div
            className="method-card"
            onClick={() => {
              onSelectMethod('barcode');
              onNavigate('scan-camera');
            }}
          >
            <div className="method-icon-wrap">
              <Barcode size={24} className="method-icon" />
            </div>
            <div className="method-info">
              <h4>Scan Barcode</h4>
              <p>Scan product barcode</p>
            </div>
          </div>

          {/* Card 4: Fill Manually */}
          <div
            className="method-card"
            onClick={() => {
              if (onSelectMethod) onSelectMethod('manual');
              onNavigate('extracted-details');
            }}
          >
            <div className="method-icon-wrap" style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3b82f6' }}>
              <Edit3 size={24} className="method-icon" />
            </div>
            <div className="method-info">
              <h4>Fill Manually</h4>
              <p>Enter packaging details by hand</p>
            </div>
          </div>
        </div>

        {/* Demo Fast Track card */}
        <div className="sample-pack-suggestion">
          <div className="sample-badge">
            <Sparkles size={16} />
            <span>Sample Product Ready</span>
          </div>
          <div className="sample-card-inner">
            <img
              src="/package_box.jpg"
              alt="Sample Pack"
              className="sample-thumb"
              onError={(e) => { e.target.src = '/package_box.jpg'; }}
            />
            <div className="sample-details">
              <strong>Packaged Commodity (Sample)</strong>
              <p>Sample package with compliance declarations ready for automated verification</p>
            </div>
          </div>
          <button
            type="button"
            className="btn-secondary full-width"
            onClick={() => onNavigate('scan-camera')}
          >
            Use Sample Product
          </button>
        </div>


        {/* Legal notice tip */}
        <div className="method-help-box">
          <HelpCircle size={16} />
          <span>Under Legal Metrology Rules, 2011, ensure text is in English or Hindi (Devanagari script) with adequate contrast.</span>
        </div>
      </div>

      {/* Hidden file input — placed at root level for reliable mobile triggering */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ position: 'fixed', top: -9999, left: -9999, opacity: 0, pointerEvents: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />
    </div>
  );
}
