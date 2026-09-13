import React from 'react';
import { X, CheckCircle, Info, Sparkles } from 'lucide-react';

export default function ExampleModal({ isOpen, onClose, data }) {
  if (!isOpen || !data) return null;

  const isTip = data.isTip;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className={`modal-icon-badge ${isTip ? 'badge-tip' : 'badge-example'}`}>
              {isTip ? <Sparkles size={18} /> : <CheckCircle size={18} />}
            </div>
            <div>
              <h3>{isTip ? 'Compliance Tip' : 'Standard Compliance Example'}</h3>
              <p className="modal-subtitle">{data.title}</p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="example-modal-body">
          <div className="example-rule-ref">
            <span className="chip-rule">{data.rule || 'Validation standard'}</span>
          </div>

          <div className="example-box-container">
            <div className="example-label">Recommended Label Format:</div>
            <pre className="example-pre-box">{data.exampleText}</pre>
          </div>

          <div className="example-note">
            <Info size={16} />
            <span>Ensure font height complies with Table I of Schedule-II based on packaging area.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-primary full-width" onClick={onClose}>
            Got it, thanks
          </button>
        </div>
      </div>
    </div>
  );
}
