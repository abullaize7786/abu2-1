import React from 'react';
import { X, BookOpen, Scale, CheckCircle2 } from 'lucide-react';
import { legalMetrologyRules } from '../data/mockData';

export default function LegalHandbookModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content handbook-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Scale size={20} className="text-primary" />
            </div>
            <div>
              <h3>Legal Metrology Handbook</h3>
              <p className="modal-subtitle">Packaged Commodities Rules, 2011</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="handbook-body">
          <div className="handbook-intro-card">
            <BookOpen size={20} />
            <div>
              <strong>Ministry of Consumer Affairs, Food & Public Distribution</strong>
              <p>Key regulatory compliance provisions for all pre-packed commodities sold in the Indian marketplace.</p>
            </div>
          </div>

          <div className="handbook-rules-list">
            {legalMetrologyRules.map((item, idx) => (
              <div key={idx} className="handbook-rule-item">
                <div className="rule-badge-chip">{item.rule}</div>
                <h4>{item.title}</h4>
                <p>{item.summary}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary full-width" onClick={onClose}>
            Close Reference Guide
          </button>
        </div>
      </div>
    </div>
  );
}
