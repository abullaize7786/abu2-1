import React from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, ChevronRight, FileText, ArrowRight } from 'lucide-react';
import { mockComplianceChecks } from '../data/mockData';

export default function ComplianceResult({ onNavigate }) {
  const { totalChecks, passed, flags, na, status, statusNote } = mockComplianceChecks;

  // SVG Donut Calculations
  const radius = 64;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  const passedFraction = passed / totalChecks;
  const flagsFraction = flags / totalChecks;

  const passedStroke = circumference * passedFraction;
  const flagsStroke = circumference * flagsFraction;
  const passedOffset = 0;
  const flagsOffset = -passedStroke;

  return (
    <div className="screen-container">

      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('corrective-suggestions')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Compliance Result</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Circular Donut Score Card */}
        <div className="result-donut-card">
          <div className="donut-meter-wrap">
            <svg className="donut-svg" width="160" height="160" viewBox="0 0 160 160">
              {/* Background circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#e2e8f0"
                strokeWidth={strokeWidth}
              />
              {/* Passed green arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#10b981"
                strokeWidth={strokeWidth}
                strokeDasharray={`${passedStroke} ${circumference}`}
                strokeDashoffset={passedOffset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
              {/* Flags red arc */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                fill="transparent"
                stroke="#ef4444"
                strokeWidth={strokeWidth}
                strokeDasharray={`${flagsStroke} ${circumference}`}
                strokeDashoffset={flagsOffset}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
              />
            </svg>
            <div className="donut-center-text">
              <span className="donut-number">{passed}/{totalChecks}</span>
              <span className="donut-sub">Checks Passed</span>
            </div>
          </div>

          {/* Legend row */}
          <div className="donut-legend-row">
            <div className="legend-item">
              <span className="legend-box green"></span>
              <span className="legend-label">Passed</span>
              <span className="legend-val">{passed}</span>
            </div>
            <div className="legend-item">
              <span className="legend-box red"></span>
              <span className="legend-label">Flags</span>
              <span className="legend-val">{flags}</span>
            </div>
            <div className="legend-item">
              <span className="legend-box grey"></span>
              <span className="legend-label">N/A</span>
              <span className="legend-val">{na}</span>
            </div>
          </div>
        </div>

        {/* Warning Alert Banner */}
        <div className="compliance-status-card status-partial">
          <AlertTriangle size={24} className="status-alert-icon" />
          <div className="status-text">
            <h4>{status}</h4>
            <p>{statusNote}</p>
          </div>
        </div>

        {/* Quick link to Flagged Issues */}
        <div
          className="result-quick-link"
          onClick={() => onNavigate('flagged-history')}
        >
          <span>Review Flagged Evidence</span>
          <ChevronRight size={16} />
        </div>

        <div className="action-bottom-wrap">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={() => onNavigate('compliance-report')}
          >
            <span>View Report</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
