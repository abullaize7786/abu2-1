import React, { useState } from 'react';
import { ArrowLeft, Share2, Printer, Check, Scale, ShieldCheck } from 'lucide-react';
import { mockComplianceChecks, mockProductData } from '../data/mockData';

export default function ReportPreview({ onNavigate }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Legal Metrology Compliance Report',
        text: `Compliance Report for ${mockProductData.name} - Report ID: ${mockComplianceChecks.reportId}`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handlePrint = () => {
    window.print();
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
          onClick={handlePrint}
          title="Print Document"
        >
          <Printer size={18} />
        </button>
      </div>

      <div className="screen-scroll-body padded-body">
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
              <span className="cert-meta-val bold">{mockProductData.name} ({mockProductData.netQuantity})</span>
            </div>
            <div className="cert-meta-row">
              <span className="cert-meta-key">Scan Date:</span>
              <span className="cert-meta-val">{mockComplianceChecks.scanDate}</span>
            </div>
            <div className="cert-meta-row">
              <span className="cert-meta-key">Report ID:</span>
              <span className="cert-meta-val mono">{mockComplianceChecks.reportId}</span>
            </div>
            <div className="cert-meta-row">
              <span className="cert-meta-key">Inspector:</span>
              <span className="cert-meta-val">Verified Officer #LM-408</span>
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
              <span>{mockComplianceChecks.totalChecks}</span>
              <span className="text-success bold">{mockComplianceChecks.passed}</span>
              <span className="text-danger bold">{mockComplianceChecks.flags}</span>
              <span>{mockComplianceChecks.na}</span>
            </div>
          </div>

          {/* Flagged Issues */}
          <div className="cert-section-heading">Flagged Issues</div>
          <div className="cert-flagged-list">
            <div className="cert-flag-row">
              <div className="cert-flag-bullet">
                <span className="dot-red"></span>
                <span>MRP Declaration Missing</span>
              </div>
              <span className="cert-rule-tag">Rule 6(1)(e)</span>
            </div>

            <div className="cert-flag-row">
              <div className="cert-flag-bullet">
                <span className="dot-red"></span>
                <span>Unit Sale Price Missing</span>
              </div>
              <span className="cert-rule-tag">Rule 6(1)(h)</span>
            </div>

            <div className="cert-flag-row">
              <div className="cert-flag-bullet">
                <span className="dot-amber"></span>
                <span>Consumer Care Details Missing</span>
              </div>
              <span className="cert-rule-tag">Rule 6(1)(j)</span>
            </div>

            <div className="cert-flag-row">
              <div className="cert-flag-bullet">
                <span className="dot-blue"></span>
                <span>Image Quality Low</span>
              </div>
              <span className="cert-rule-tag">Validation Check</span>
            </div>
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

        {/* Share action */}
        <div className="action-bottom-wrap">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={handleShare}
          >
            <Share2 size={18} />
            <span>{copied ? 'Link Copied to Clipboard!' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
