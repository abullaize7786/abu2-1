import React, { useRef } from 'react';
import { Scale, Camera, Upload, Barcode, History, Bell, ChevronRight, CheckCircle2, AlertTriangle, BookOpen, Edit3 } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Dashboard({
  onNavigate,
  onSelectScanMethod,
  onOpenHandbook,
  currentUser,
  recentProduct,
  recentFlagsCount = 0,
  onCustomImageUpload
}) {
  const fileInputRef = useRef(null);

  const userInitials = currentUser
    ? currentUser.split('@')[0].slice(0, 2).toUpperCase()
    : 'LM';

  const handleUploadCardClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        const dataUrl = evt.target.result;
        if (onCustomImageUpload) {
          onCustomImageUpload(dataUrl);
        }
        if (onSelectScanMethod) {
          onSelectScanMethod('upload');
        }
        onNavigate('crop-preview');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="screen-container dashboard-screen">
      {/* Hidden file input for Upload Image card */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        onChange={handleFileChange}
      />

      {/* Header */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-logo-badge">
            <Scale size={20} className="header-logo-icon" />
          </div>
          <div className="header-titles">
            <h2 className="header-app-name">Legal Metrology</h2>
            <p className="header-app-sub">Compliance Checker</p>
          </div>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="icon-circle-btn notification-btn"
            onClick={() => onNavigate('notifications')}
            title="Notifications"
          >
            <Bell size={18} />
            <span className="badge-unread-dot"></span>
          </button>
          <button
            type="button"
            className="avatar-circle-btn"
            onClick={() => onNavigate('profile')}
            title={currentUser || "Profile"}
          >
            <span>{userInitials}</span>
          </button>
        </div>
      </header>

      {/* Main scrollable body */}
      <div className="screen-scroll-body">
        {/* Hero Card */}
        <div className="hero-banner-card">
          <div className="hero-text-col">
            <h3 className="hero-heading">
              Scan &amp; Check Packaged Commodities
            </h3>
            <p className="hero-description">
              Verify labels, images and product details against Legal Metrology Rules, 2011
            </p>
            <button
              type="button"
              className="hero-cta-btn"
              onClick={() => onNavigate('scan-method')}
            >
              Start Inspection
            </button>
          </div>
          <div className="hero-image-col">
            <img
              src="/package_box.jpg"
              alt="Packaged Commodities"
              className="hero-box-img"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* 4 Action Cards Grid */}
        <div className="action-tiles-grid">
          {/* Card 1: Scan Product */}
          <button
            type="button"
            className="action-tile tile-green"
            onClick={() => {
              onSelectScanMethod('camera');
              onNavigate('scan-camera');
            }}
          >
            <div className="tile-icon-wrap icon-green">
              <Camera size={22} />
            </div>
            <div className="tile-text-wrap">
              <h4>Scan Product</h4>
              <p>Camera / Live Scan</p>
            </div>
          </button>

          {/* Card 2: Upload Image -> Opens device file picker */}
          <button
            type="button"
            className="action-tile tile-cyan"
            onClick={handleUploadCardClick}
          >
            <div className="tile-icon-wrap icon-cyan">
              <Upload size={22} />
            </div>
            <div className="tile-text-wrap">
              <h4>Upload Image</h4>
              <p>Choose from device</p>
            </div>
          </button>

          {/* Card 3: Fill Manually -> Opens editable declarations */}
          <button
            type="button"
            className="action-tile tile-blue"
            onClick={() => {
              onSelectScanMethod('manual');
              onNavigate('extracted-details');
            }}
          >
            <div className="tile-icon-wrap icon-blue">
              <Edit3 size={22} />
            </div>
            <div className="tile-text-wrap">
              <h4>Fill Manually</h4>
              <p>Enter Declarations</p>
            </div>
          </button>

          {/* Card 4: History */}
          <button
            type="button"
            className="action-tile tile-teal"
            onClick={() => onNavigate('flagged-history')}
          >
            <div className="tile-icon-wrap icon-teal">
              <History size={22} />
            </div>
            <div className="tile-text-wrap">
              <h4>History</h4>
              <p>Previous Scans</p>
            </div>
          </button>
        </div>

        {/* Recent Scan preview card */}
        <div className="recent-scan-section">
          <div className="section-title-row">
            <h4>Recent Inspection</h4>
            {recentProduct && (
              <button
                type="button"
                className="section-link-btn"
                onClick={() => onNavigate('flagged-history')}
              >
                View All
              </button>
            )}
          </div>

          {recentProduct ? (
            <div
              className="recent-product-card"
              onClick={() => onNavigate('extracted-details')}
            >
              <img
                src={recentProduct.frontImage || '/package_box.jpg'}
                alt={recentProduct.name || 'Recent Product'}
                className="recent-product-thumb"
                onError={(e) => {
                  e.target.src = '/package_box.jpg';
                }}
              />
              <div className="recent-product-info">
                <div className="recent-product-badge-row">
                  <span
                    style={{
                      padding: '2px 8px',
                      borderRadius: 4,
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      background: recentFlagsCount > 0 ? '#fef3c7' : '#dcfce7',
                      color: recentFlagsCount > 0 ? '#b45309' : '#15803d'
                    }}
                  >
                    {recentFlagsCount > 0 ? `${recentFlagsCount} Flags Detected` : 'Fully Compliant'}
                  </span>
                  <span className="recent-date">Active Inspection</span>
                </div>
                <h5 className="recent-product-name">
                  {recentProduct.name} {recentProduct.variant ? `(${recentProduct.variant})` : ''}
                </h5>
                <p className="recent-product-meta">
                  MRP: {recentProduct.mrp || 'Not declared'} &bull; {recentProduct.netQuantity || 'N/A'}
                </p>
              </div>
              <ChevronRight size={18} className="chevron-icon" />
            </div>
          ) : (
            <div
              className="recent-product-card"
              style={{
                padding: '22px 16px',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                cursor: 'pointer',
                background: '#f8fafc',
                border: '1px dashed #cbd5e1',
                borderRadius: 14
              }}
              onClick={() => onNavigate('scan-method')}
            >
              <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                No inspection recorded for <strong>{currentUser || 'this account'}</strong>.
              </p>
              <button
                type="button"
                className="btn-secondary"
                style={{ padding: '6px 14px', fontSize: '0.8rem', borderRadius: 8 }}
              >
                + Start Scan or Fill Manually
              </button>
            </div>
          )}
        </div>

        {/* Legal Rules Quick Reference banner */}
        <div className="rules-handbook-banner" onClick={onOpenHandbook}>
          <div className="handbook-banner-left">
            <BookOpen size={20} className="handbook-icon" />
            <div>
              <h5>Legal Metrology Rules, 2011</h5>
              <p>Rule 6(1) Declarations Handbook &amp; Penalties</p>
            </div>
          </div>
          <ChevronRight size={16} />
        </div>
      </div>

      <BottomNav
        activeTab="home"
        onSelectTab={(tabId, screen) => onNavigate(screen)}
      />
    </div>
  );
}
