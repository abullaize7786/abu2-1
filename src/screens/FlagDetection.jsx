import React from 'react';
import { ArrowLeft, AlertCircle, AlertTriangle, CheckCircle2, ChevronRight } from 'lucide-react';
import { mockFlags } from '../data/mockData';

export default function FlagDetection({ onNavigate, onSelectFlag, flags = mockFlags }) {
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

  const isCompliant = flags.length === 0;

  return (
    <div className="screen-container">
      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('extracted-details')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Flag Detection</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Warning or Success Banner */}
        {isCompliant ? (
          <div className="alert-banner-card" style={{ background: '#ecfdf5', borderColor: '#a7f3d0' }}>
            <div className="alert-banner-icon-wrap" style={{ background: '#d1fae5', color: '#059669' }}>
              <CheckCircle2 size={28} />
            </div>
            <div className="alert-banner-text">
              <h4 style={{ color: '#065f46' }}>Fully Compliant</h4>
              <p style={{ color: '#047857' }}>All mandatory declarations verified</p>
            </div>
          </div>
        ) : (
          <div className="alert-banner-card">
            <div className="alert-banner-icon-wrap">
              <AlertCircle size={28} className="alert-banner-icon" />
            </div>
            <div className="alert-banner-text">
              <h4>Issues Found</h4>
              <p>{flags.length} Flag{flags.length > 1 ? 's' : ''} detected</p>
            </div>
          </div>
        )}

        {/* Flag list */}
        {isCompliant ? (
          <div style={{ textAlign: 'center', padding: '30px 16px', color: '#64748b' }}>
            <p style={{ margin: '0 0 16px', fontSize: '0.9rem' }}>
              No non-compliance issues found on this product label. You can generate the official compliance certification report.
            </p>
          </div>
        ) : (
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
        )}

        <div className="action-bottom-wrap">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={() => onNavigate(isCompliant ? 'compliance-result' : 'rule-mapping')}
          >
            {isCompliant ? 'View Compliance Result' : 'View Rule Mapping'}
          </button>
        </div>
      </div>
    </div>
  );
}
