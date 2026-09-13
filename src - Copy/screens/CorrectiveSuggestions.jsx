import React from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, HelpCircle, ShieldCheck, Sparkles } from 'lucide-react';

export default function CorrectiveSuggestions({ onNavigate, onShowExample }) {
  const suggestions = [
    {
      id: 1,
      title: 'Add MRP declaration',
      subtitle: 'Include MRP (incl. of all taxes) as per Rule 6(1)(e)',
      rule: 'Rule 6(1)(e)',
      btnType: 'example',
      iconType: 'green',
      exampleText: `MAXIMUM RETAIL PRICE (MRP):\n₹ 20.00 (INCL. OF ALL TAXES)\n\n* Minimum font size: 2.0 mm for packaging area < 100 cm²`,
    },
    {
      id: 2,
      title: 'Add unit sale price',
      subtitle: 'Mention unit sale price (per g / per kg) as per Rule 6(1)(h)',
      rule: 'Rule 6(1)(h)',
      btnType: 'example',
      iconType: 'amber',
      exampleText: `UNIT SALE PRICE (USP):\n₹ 0.29 / g\n\n* Mandatory since Dec 2022 amendments for all pre-packed commodities`,
    },
    {
      id: 3,
      title: 'Add consumer care details',
      subtitle: 'Include toll-free number, email, website as per Rule 6(1)(j)',
      rule: 'Rule 6(1)(j)',
      btnType: 'example',
      iconType: 'green',
      exampleText: `CONSUMER GRIEVANCES:\nDesignated Executive: Consumer Care Cell\nAddress: P.O. Box 4, New Delhi - 110001\nToll Free: 1800-103-1947\nEmail: wecare@in.nestle.com`,
    },
    {
      id: 4,
      title: 'Use high-quality image',
      subtitle: 'Ensure clear and legible label with all details visible.',
      rule: 'Validation Check',
      btnType: 'tip',
      iconType: 'blue',
      isTip: true,
      exampleText: `RECOMMENDED CAPTURE TECHNIQUE:\n1. Keep camera perpendicular to surface\n2. Avoid harsh glare or ceiling flash reflections\n3. Minimum resolution: 1080p for OCR compliance`,
    },
  ];

  return (
    <div className="screen-container">

      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('rule-mapping')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Corrective Suggestions</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        <div className="suggestions-list">
          {suggestions.map((item) => (
            <div key={item.id} className="suggestion-card">
              <div className="suggestion-left">
                <div className={`suggestion-icon-circle ${item.iconType}`}>
                  {item.iconType === 'blue' ? (
                    <Sparkles size={16} />
                  ) : item.iconType === 'amber' ? (
                    <AlertCircle size={16} />
                  ) : (
                    <CheckCircle2 size={16} />
                  )}
                </div>
                <div className="suggestion-info">
                  <h5>{item.title}</h5>
                  <p>{item.subtitle}</p>
                </div>
              </div>

              <button
                type="button"
                className="btn-suggestion-pill"
                onClick={() => onShowExample(item)}
              >
                {item.btnType === 'tip' ? 'Tip' : 'Example'}
              </button>
            </div>
          ))}
        </div>

        <div className="action-bottom-wrap">
          <button
            type="button"
            className="btn-primary full-width"
            onClick={() => onNavigate('compliance-result')}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
