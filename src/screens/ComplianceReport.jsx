import React from 'react';
import { ArrowLeft, Download, FileText, CheckCircle2, AlertCircle, Eye, Trash2 } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { mockComplianceChecks, mockFlags } from '../data/mockData';

export default function ComplianceReport({
  onNavigate,
  complianceChecks,
  productData,
  flags: currentFlags,
  onDeleteReport
}) {
  const activeChecks = complianceChecks || mockComplianceChecks;
  const reportId = activeChecks.reportId || 'LMPC-REPORT-001';
  const scanDate = activeChecks.scanDate || new Date().toLocaleDateString();
  const totalChecks = activeChecks.totalChecks || 11;
  const passed = activeChecks.passed || 7;
  const flagsCount = activeChecks.flagsCount !== undefined ? activeChecks.flagsCount : (activeChecks.flags || 4);
  const na = activeChecks.na || 0;

  const displayFlags = currentFlags && currentFlags.length > 0 ? currentFlags : mockFlags;

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to permanently delete Compliance Report ${reportId}?`)) {
      if (onDeleteReport) {
        onDeleteReport(reportId);
      }
      onNavigate('flagged-history');
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
          onClick={handleDelete}
          style={{ color: '#ef4444' }}
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="screen-scroll-body padded-body">
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
            onClick={handleDelete}
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
            onClick={() => onNavigate('report-preview')}
            style={{
              flex: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6
            }}
          >
            <Download size={18} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      <BottomNav
        activeTab="report"
        onSelectTab={(tabId, screen) => onNavigate(screen)}
      />
    </div>
  );
}
