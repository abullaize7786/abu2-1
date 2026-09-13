import React, { useState } from 'react';
import { ArrowLeft, AlertTriangle, Maximize2, X, CheckCircle, ExternalLink } from 'lucide-react';
import { mockFlags } from '../data/mockData';

export default function SingleFlag({ onNavigate, flag = mockFlags[0] }) {
  const [showFullImageModal, setShowFullImageModal] = useState(false);

  return (
    <div className="screen-container">

      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('flagged-history')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Flag Details</h3>
        <span className="priority-header-badge">High Priority</span>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Visual Evidence Crop with Bounding Box */}
        <div className="evidence-crop-card">
          <div className="evidence-img-wrap">
            <img
              src="/maggi_back.jpg"
              alt="Evidence Crop"
              className="evidence-bg-img"
            />
            {/* Highlighted Red Bounding Box on missing MRP */}
            <div className="evidence-red-box">
              <span className="evidence-box-label">MRP Missing</span>
            </div>
          </div>

          <div className="evidence-callout-panel">
            <div className="callout-box-wire">
              <span className="callout-wire-text">MRP ₹ ...</span>
            </div>
            <p className="callout-wire-sub">Expected here as per Rule 6(1)(e)</p>
          </div>
        </div>

        {/* Flag Details Section */}
        <div className="single-flag-details-section">
          <div className="single-flag-heading-row">
            <AlertTriangle size={20} className="text-danger" />
            <h4>{flag.title}</h4>
          </div>

          <div className="flag-fact-group">
            <div className="fact-item">
              <span className="fact-label">Rule Reference</span>
              <span className="fact-val font-medium text-primary">{flag.rule}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">What was found</span>
              <span className="fact-val">{flag.found}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">What should be present</span>
              <span className="fact-val">{flag.expected}</span>
            </div>

            <div className="fact-item">
              <span className="fact-label">Suggested correction</span>
              <span className="fact-val text-dark">{flag.suggestedCorrection}</span>
            </div>
          </div>
        </div>

        <div className="action-bottom-wrap">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={() => setShowFullImageModal(true)}
          >
            <Maximize2 size={16} />
            <span>View Full Image</span>
          </button>
        </div>
      </div>

      {/* Full Image Modal */}
      {showFullImageModal && (
        <div className="modal-backdrop" onClick={() => setShowFullImageModal(false)}>
          <div className="modal-content full-image-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Full Captured Package Label</h4>
              <button className="modal-close-btn" onClick={() => setShowFullImageModal(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body-img-view">
              <img
                src="/maggi_back.jpg"
                alt="Full Package Label"
                className="modal-full-img"
              />
            </div>
            <div className="modal-footer">
              <button
                className="btn-secondary full-width"
                onClick={() => setShowFullImageModal(false)}
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
