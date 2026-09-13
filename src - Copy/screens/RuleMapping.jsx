import React, { useState } from 'react';
import { ArrowLeft, ChevronRight, AlertCircle, AlertTriangle, Info, ArrowRight } from 'lucide-react';
import { mockFlags } from '../data/mockData';

export default function RuleMapping({ onNavigate, onSelectFlag }) {
  const [filter, setFilter] = useState('all');

  const filteredFlags = mockFlags.filter((f) => {
    if (filter === 'all') return true;
    return f.severity.toLowerCase() === filter.toLowerCase();
  });

  const getBadgeClass = (severity) => {
    switch (severity.toLowerCase()) {
      case 'high':
        return 'flag-badge-high';
      case 'medium':
        return 'flag-badge-medium';
      default:
        return 'flag-badge-low';
    }
  };

  return (
    <div className="screen-container">

      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('flag-detection')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Rule Mapping</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Filter Chips */}
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Flags ({mockFlags.length})
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'high' ? 'active' : ''}`}
            onClick={() => setFilter('high')}
          >
            High (2)
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'medium' ? 'active' : ''}`}
            onClick={() => setFilter('medium')}
          >
            Medium (1)
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'low' ? 'active' : ''}`}
            onClick={() => setFilter('low')}
          >
            Low (1)
          </button>
        </div>

        {/* Detailed rule mapping cards */}
        <div className="rule-mapping-list">
          {filteredFlags.map((flag) => (
            <div
              key={flag.id}
              className="rule-mapping-card"
              onClick={() => {
                if (onSelectFlag) onSelectFlag(flag);
                onNavigate('single-flag');
              }}
            >
              <div className="rule-card-top">
                <div className="rule-title-group">
                  <div className={`rule-indicator-dot ${getBadgeClass(flag.severity)}`}>
                    <AlertCircle size={14} />
                  </div>
                  <div>
                    <h5 className="rule-item-title">{flag.title}</h5>
                    <span className="rule-item-code">{flag.rule}</span>
                  </div>
                </div>
                <ChevronRight size={18} className="chevron-icon" />
              </div>
              <p className="rule-item-desc">{flag.description}</p>
            </div>
          ))}
        </div>

        <div className="action-bottom-wrap">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={() => onNavigate('corrective-suggestions')}
          >
            <span>Proceed to Suggestions</span>
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
