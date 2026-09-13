import React, { useState } from 'react';
import { ArrowLeft, Share2, Printer, Check, Scale, ShieldCheck, Download } from 'lucide-react';
import { mockComplianceChecks, mockProductData, mockFlags } from '../data/mockData';
import { generateCompliancePDF } from '../utils/pdfGenerator';

export default function ReportPreview({
  onNavigate,
  complianceChecks,
  productData,
  flags: currentFlags,
  currentUser
}) {
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  if (!complianceChecks && !productData) {
    return (
      <div className="screen-container">
        <div className="screen-header">
          <button
            type="button"
            className="header-back-btn"
            onClick={() => onNavigate('compliance-report')}
          >
            <ArrowLeft size={20} />
          </button>
          <h3 className="screen-header-title">Report Preview</h3>
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
            <Scale size={32} color="#94a3b8" />
          </div>
          <h4 style={{ margin: '0 0 8px', color: '#1e293b', fontSize: '1.1rem' }}>No Document Available</h4>
          <p style={{ margin: '0 0 20px', color: '#64748b', fontSize: '0.85rem' }}>
            The compliance report details have been removed.
          </p>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onNavigate('scan-method')}
            style={{ padding: '8px 20px', fontSize: '0.85rem' }}
          >
            Start New Inspection
          </button>
        </div>
      </div>
    );
  }

  const activeChecks = complianceChecks || {};
  const activeProduct = productData || {};
  const activeFlags = currentFlags || [];

  const reportId = activeChecks.reportId || 'LMPC-REPORT-001';
  const scanDate = activeChecks.scanDate || new Date().toLocaleDateString();

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Legal Metrology Compliance Report',
        text: `Compliance Report for ${activeProduct.name} - Report ID: ${reportId}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleDownloadPDF = () => {
    try {
      generateCompliancePDF({
        reportId,
        scanDate,
        productData: activeProduct,
        complianceChecks: activeChecks,
        flags: activeFlags,
        currentUser: currentUser || 'Inspector Officer'
      });
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } catch (err) {
      console.error(err);
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
          onClick={() => onNavigate('compliance-report')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Report Preview</h3>
        <button
          type="button"
          className="header-icon-btn"
          onClick={handleDownloadPDF}
          title="Download PDF"
        >
          <Download size={18} />
        </button>
      </div>

      <div className="screen-scroll-body padded-body">
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
              fontSize: '0.85rem'
            }}
          >
            <Check size={18} color="#059669" />
            <span>PDF downloaded to your device!</span>
          </div>
        )}

        {/* Printable Official Document Sheet */}
        <div className="official-cert-sheet printable-document">
          <div className="cert-watermark">
            <Scale size={160} />
          </div>

          <div className="cert-header">
            <div className="cert-emblem">
              <Scale size={24} className="text-primary" />
            </div>
            <h4 className="cert-title">Legal Metrology</h4>
            <p className="cert-sub">Compliance Report</p>
            <span className="cert-rule-citation">(Packaged Commodities) Rules, 2011</span>
          </div>

          <div className="cert-divider"></div>

          {/* Product and Audit Metadata */}
          <div className="cert-meta-grid">
            <div className="cert-meta-row">
              <span className="cert-meta-key">Product:</span>
              <span className="cert-meta-val bold">{activeProduct.name} {activeProduct.netQuantity ? `(${activeProduct.netQuantity})` : ''}</span>
            </div>
            <div className="cert-meta-row">
              <span className="cert-meta-key">Scan Date:</span>
              <span className="cert-meta-val">{scanDate}</span>
            </div>
            <div className="cert-meta-row">
              <span className="cert-meta-key">Report ID:</span>
              <span className="cert-meta-val mono">{reportId}</span>
            </div>
            <div className="cert-meta-row">
              <span className="cert-meta-key">Inspector:</span>
              <span className="cert-meta-val">{currentUser || 'Verified Officer #LM-408'}</span>
            </div>
          </div>

          {/* Compliance Summary Table */}
          <div className="cert-section-heading">Compliance Summary</div>
          <div className="cert-summary-table">
            <div className="cert-tbl-header">
              <span>Total Checks</span>
              <span>Passed</span>
              <span>Flags</span>
              <span>N/A</span>
            </div>
            <div className="cert-tbl-values">
              <span>{activeChecks.totalChecks || 11}</span>
              <span className="text-success bold">{activeChecks.passed !== undefined ? activeChecks.passed : 7}</span>
              <span className="text-danger bold">{activeFlags.length}</span>
              <span>{activeChecks.na || 0}</span>
            </div>
          </div>

          {/* Flagged Issues */}
          <div className="cert-section-heading">Flagged Issues ({activeFlags.length})</div>
          <div className="cert-flagged-list">
            {activeFlags.length > 0 ? (
              activeFlags.map((flag, idx) => (
                <div key={flag.id || idx} className="cert-flag-row">
                  <div className="cert-flag-bullet">
                    <span className={flag.severity?.toLowerCase() === 'high' ? 'dot-red' : 'dot-amber'}></span>
                    <span>{flag.title}</span>
                  </div>
                  <span className="cert-rule-tag">{flag.rule || 'Rule 6(1)'}</span>
                </div>
              ))
            ) : (
              <div style={{ padding: '8px 12px', color: '#16a34a', fontSize: '0.85rem' }}>
                ✓ No non-compliance flags detected. Product conforms with packaging standards.
              </div>
            )}
          </div>

          {/* Official Verification Seal */}
          <div className="cert-footer-seal-wrap">
            <div className="cert-signature-line">
              <div className="cert-sig-mark">Authorized Inspection Signatory</div>
              <p className="cert-sig-sub">Directorate of Legal Metrology</p>
            </div>
            <div className="cert-stamp-badge">
              <ShieldCheck size={20} />
              <span>OFFICIALLY AUDITED</span>
            </div>
          </div>
        </div>

        {/* Bottom actions: Download PDF + Share */}
        <div className="action-bottom-wrap" style={{ display: 'flex', gap: 10 }}>
          <button
            type="button"
            className="btn-primary"
            onClick={handleDownloadPDF}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Download size={18} />
            <span>Download PDF</span>
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={handleShare}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
          >
            <Share2 size={18} />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
