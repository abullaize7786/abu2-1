import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, Clock, ChevronRight, CheckCircle2, FileText, Trash2, RotateCcw } from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function FlaggedHistory({
  onNavigate,
  onSelectFlag,
  flags = [],
  historyScans = [],
  currentUser,
  onDeleteHistoryScan,
  onClearAllHistory,
  onClearCurrentScan
}) {
  const [tab, setTab] = useState('current');

  const getBadgeClass = (severity = 'medium') => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'flag-badge-high';
      case 'medium':
        return 'flag-badge-medium';
      default:
        return 'flag-badge-low';
    }
  };

  const getBadgeIcon = (severity = 'medium') => {
    switch (severity.toLowerCase()) {
      case 'high':
        return '? High';
      case 'medium':
        return '? Medium';
      default:
        return 'Low';
    }
  };

  const handleDeleteItem = (e, scanId, productName) => {
    e.stopPropagation();
    if (window.confirm(`Delete inspection record for "${productName || 'this item'}"?`)) {
      if (onDeleteHistoryScan) {
        onDeleteHistoryScan(scanId);
      }
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete ALL scan history records for this account?')) {
      if (onClearAllHistory) {
        onClearAllHistory();
      }
    }
  };

  const handleClearActive = () => {
    if (window.confirm('Clear active scan details and flags?')) {
      if (onClearCurrentScan) {
        onClearCurrentScan();
      }
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
        <h3 className="screen-header-title">Flagged Issues</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Tab switch */}
        <div className="sub-tabs-pill-row">
          <button
            type="button"
            className={`pill-tab ${tab === 'current' ? 'active' : ''}`}
            onClick={() => setTab('current')}
          >
            Current Scan ({flags.length})
          </button>
          <button
            type="button"
            className={`pill-tab ${tab === 'history' ? 'active' : ''}`}
            onClick={() => setTab('history')}
          >
            History ({historyScans.length})
          </button>
        </div>

        {tab === 'current' ? (
          flags.length > 0 ? (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Active Flags Detected</span>
                <button
                  type="button"
                  onClick={handleClearActive}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ef4444',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  <Trash2 size={13} /> Clear Scan
                </button>
              </div>

              <div className="flag-items-list">
                {flags.map((flag) => (
                  <div
                    key={flag.id}
                    className="flag-item-card"
                    onClick={() => {
                      if (onSelectFlag) onSelectFlag(flag);
                      onNavigate('single-flag');
                    }}
                  >
                    <div className="flag-circle-icon">
                      <AlertCircle size={16} />
                    </div>
                    <div className="flag-item-details">
                      <div className="flag-item-top">
                        <h5 className="flag-title">{flag.title}</h5>
                        <span className={`flag-badge ${getBadgeClass(flag.severity)}`}>
                          {getBadgeIcon(flag.severity)}
                        </span>
                      </div>
                      <span className="flag-rule-code">{flag.rule}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="action-bottom-wrap">
                <button
                  type="button"
                  className="btn-primary full-width"
                  onClick={() => {
                    if (onSelectFlag && flags[0]) onSelectFlag(flags[0]);
                    onNavigate('single-flag');
                  }}
                >
                  View Evidence Detail
                </button>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
              <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 12px' }} />
              <h4 style={{ margin: '0 0 6px', color: '#1e293b' }}>No Active Flags</h4>
              <p style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
                No compliance issues found for {currentUser || 'this account'}.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => onNavigate('scan-method')}
                style={{ padding: '8px 18px', fontSize: '0.85rem' }}
              >
                Scan or Fill a Product
              </button>
            </div>
          )
        ) : historyScans.length > 0 ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Saved Reports ({historyScans.length})
              </span>
              <button
                type="button"
                onClick={handleClearAll}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#ef4444',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <Trash2 size={13} /> Clear All
              </button>
            </div>

            <div className="history-scans-list">
              {historyScans.map((scan, idx) => (
                <div
                  key={scan.id || idx}
                  className="history-scan-card"
                  style={{ position: 'relative' }}
                  onClick={() => onNavigate('compliance-report')}
                >
                  <div className="history-scan-header" style={{ paddingRight: 28 }}>
                    <h5>{scan.product}</h5>
                    <span
                      className={`status-badge-chip ${
                        scan.isCompliant ? 'chip-green' : 'chip-amber'
                      }`}
                    >
                      {scan.status}
                    </span>
                  </div>
                  <div className="history-scan-meta">
                    <span>{scan.id}</span>
                    <span>&bull;</span>
                    <span>{scan.date}</span>
                  </div>
                  <div className="history-scan-checks">{scan.checks}</div>

                  {/* Delete this scan button */}
                  <button
                    type="button"
                    title="Delete this record"
                    onClick={(e) => handleDeleteItem(e, scan.id, scan.product)}
                    style={{
                      position: 'absolute',
                      top: 14,
                      right: 12,
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: 'none',
                      borderRadius: 6,
                      color: '#ef4444',
                      padding: 5,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <FileText size={42} color="#94a3b8" style={{ margin: '0 auto 12px' }} />
            <h4 style={{ margin: '0 0 6px', color: '#1e293b' }}>No History Yet</h4>
            <p style={{ fontSize: '0.85rem', margin: '0 0 16px' }}>
              Past inspection reports for <strong>{currentUser || 'this account'}</strong> will be saved here.
            </p>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onNavigate('scan-method')}
              style={{ padding: '8px 18px', fontSize: '0.85rem' }}
            >
              Start First Inspection
            </button>
          </div>
        )}
      </div>

      <BottomNav
        activeTab="history"
        onSelectTab={(tabId, screen) => onNavigate(screen)}
      />
    </div>
  );
}
