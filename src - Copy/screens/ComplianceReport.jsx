import React, { useState } from 'react';
import { ArrowLeft, Download, FileText, CheckCircle2, AlertCircle, Eye, Trash2, Check, AlertTriangle } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { mockComplianceChecks, mockFlags } from '../data/mockData';
import { generateCompliancePDF } from '../utils/pdfGenerator';

export default function ComplianceReport({
  onNavigate,
  complianceChecks,
  productData,
  flags: currentFlags,
  currentUser,
  onDeleteReport
}) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // If report has been deleted or no data exists, show clean empty state (NO mock data leak)
  if (!complianceChecks && !productData) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <button
            type="button"
            className="header-back-btn"
            onClick={() => onNavigate('dashboard')}
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="screen-header-title">Compliance Report</h3>
          <div style={{ width: 32 }}></div>
        </div>

        <div
          className="screen-scroll-body padded-body"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center'
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16
            }}
          >
            <FileText size={32} color="#94a3b8" />
          </div>
          <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '1.1rem', fontWeight: 600 }}>
            No Report Details Available
          </h4>
          <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '0.85rem', maxWidth: 280, lineHeight: 1.4 }}>
            The compliance report and scan details have been deleted. Scan a product or fill declarations manually to generate a new report.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('scan-method')}
            style={{ padding: '10px 22px', fontSize: '0.85rem' }}
          >
            Start New Inspection
          </button>
        </div>

        <BottomNav
          activeTab="report"
          onSelectTab={(tabId, screen) => onNavigate(screen)}
        />
      </div>
    );
  }

  const activeChecks = complianceChecks || {};
  const reportId = activeChecks.reportId || 'LMPC-REPORT-001';
  const scanDate = activeChecks.scanDate || new Date().toLocaleDateString();
  const totalChecks = activeChecks.totalChecks || 11;
  const passed = activeChecks.passed !== undefined ? activeChecks.passed : (11 - (currentFlags?.length || 0));
  const flagsCount = activeChecks.flagsCount !== undefined ? activeChecks.flagsCount : (currentFlags?.length || 0);
  const na = activeChecks.na || 0;

  const displayFlags = currentFlags || [];

  const confirmDelete = () => {
    if (onDeleteReport) {
      onDeleteReport(reportId);
    }
    setShowDeleteModal(false);
  };

  const handleDownloadPDF = () => {
    try {
      generateCompliancePDF({
        reportId,
        scanDate,
        productData: productData || {
          name: 'Packaged Commodity Item',
          variant: 'Standard Pack',
          netQuantity: '100g',
          mrp: '₹ 20.00',
          unitSalePrice: '₹ 0.20 / g',
          mfgDate: '09-2026',
          bestBefore: '09-2027',
          manufacturer: 'Parle Products Pvt Ltd, Mumbai',
          countryOfOrigin: 'India'
        },
        complianceChecks: activeChecks,
        flags: displayFlags,
        currentUser: currentUser || 'Inspector Officer'
      });

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error('PDF download error:', err);
      window.print();
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
        <h3 className="screen-header-title">Compliance Report</h3>
        <button
          type="button"
          className="icon-circle-btn"
          title="Delete Report"
          onClick={() => setShowDeleteModal(true)}
          style={{ color: '#ef4444' }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Success Alert when PDF is downloaded */}
        {downloadSuccess && (
          <div
            style={{
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              borderRadius: 10,
              padding: '10px 14px',
              marginBottom: 14,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              fontSize: '0.85rem',
              fontWeight: 500
            }}
          >
            <Check size={18} color="#059669" />
            <span>Official PDF downloaded successfully! Check your downloads.</span>
          </div>
        )}

        {/* Report Identification Card */}
        <div className="report-id-card">
          <div className="report-id-row">
            <span className="report-meta-label">Report ID:</span>
            <span className="report-meta-val bold">{reportId}</span>
          </div>
          {productData?.name && (
            <div className="report-id-row">
              <span className="report-meta-label">Product:</span>
              <span className="report-meta-val">{productData.name} {productData.variant ? `(${productData.variant})` : ''}</span>
            </div>
          )}
          <div className="report-id-row">
            <span className="report-meta-label">Scan Date:</span>
            <span className="report-meta-val">{scanDate}</span>
          </div>
        </div>

        {/* Summary Metric Box */}
        <div className="report-summary-box">
          <h5 className="summary-box-title">Summary</h5>
          <div className="summary-metric-grid">
            <div className="metric-cell">
              <span className="metric-name">Total Checks</span>
              <span className="metric-number">{totalChecks}</span>
            </div>
            <div className="metric-cell">
              <span className="metric-name">
                <span className="status-indicator-dot green"></span> Passed
              </span>
              <span className="metric-number text-success">{passed}</span>
            </div>
            <div className="metric-cell">
              <span className="metric-name">
                <span className="status-indicator-dot red"></span> Flags
              </span>
              <span className="metric-number text-danger">{flagsCount}</span>
            </div>
            <div className="metric-cell">
              <span className="metric-name">
                <span className="status-indicator-dot grey"></span> N/A
              </span>
              <span className="metric-number text-muted">{na}</span>
            </div>
          </div>
        </div>

        {/* Flagged Items Section */}
        {displayFlags.length > 0 && (
          <div className="report-flagged-section">
            <div className="section-title-row">
              <h5 className="flagged-section-title">Flagged Items ({displayFlags.length})</h5>
              <button
                type="button"
                className="view-cert-link"
                onClick={() => onNavigate('report-preview')}
              >
                <Eye size={14} /> Preview Doc
              </button>
            </div>

            <div className="flagged-items-table">
              {displayFlags.map((flag, idx) => (
                <div key={flag.id || idx} className="flag-table-row">
                  <div className="flag-table-name">
                    <span className={flag.severity?.toLowerCase() === 'high' ? 'dot-red' : 'dot-amber'}></span>
                    <span>{flag.title}</span>
                  </div>
                  <span className="flag-table-rule">{flag.rule}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Passed Checks summary */}
        <div className="passed-checks-summary-box">
          <div className="passed-summary-header">
            <CheckCircle2 size={16} className="text-success" />
            <span>{passed} Checks Passed Compliantly</span>
          </div>
          <p className="passed-summary-note">
            Legal Metrology declarations verified against Legal Metrology Rules, 2011.
          </p>
        </div>

        <div className="action-bottom-wrap" style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => setShowDeleteModal(true)}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              color: '#ef4444',
              borderColor: '#fca5a5'
            }}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleDownloadPDF}
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Download size={18} />
            <span>{downloadSuccess ? 'Downloaded!' : 'Download PDF'}</span>
          </button>
        </div>
      </div>

      {/* Delete Confirmation In-App Modal */}
      {showDeleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(3px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 16
          }}
          onClick={() => setShowDeleteModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: 16,
              padding: '24px 20px',
              maxWidth: 340,
              width: '100%',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
              textAlign: 'center'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 14px'
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <h4 style={{ margin: '0 0 8px', fontSize: '1.05rem', color: '#1e293b', fontWeight: 600 }}>
              Delete Compliance Report?
            </h4>
            <p style={{ margin: '0 0 20px', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.4 }}>
              Are you sure you want to permanently delete report <strong>{reportId}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="button"
                className="btn-secondary"
                style={{ flex: 1, padding: '10px 0', fontSize: '0.85rem' }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  padding: '10px 0',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  background: '#dc2626',
                  border: 'none',
                  borderRadius: 10,
                  cursor: 'pointer'
                }}
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav
        activeTab="report"
        onSelectTab={(tabId, screen) => onNavigate(screen)}
      />
    </div>
  );
}
