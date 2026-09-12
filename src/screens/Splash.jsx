import React from 'react';
import { Scale, ArrowRight, ShieldCheck } from 'lucide-react';

export default function Splash({ onNavigate }) {
  return (
    <div className="screen-container splash-screen">

      <div className="splash-content">
        <div className="splash-brand">
          <div className="shield-logo-wrap">
            <div className="shield-outline">
              <Scale size={48} className="shield-icon" strokeWidth={1.8} />
            </div>
          </div>

          <h1 className="splash-title">
            Legal Metrology
            <span>Packaged Commodities</span>
            <span>Compliance Checker</span>
          </h1>

          <div className="splash-motto">
            Scan &bull; Check &bull; Comply
          </div>

          <p className="splash-desc">
            Ensure Safe Products<br />for a Fair Marketplace
          </p>
        </div>

        {/* Commodity vector packaging illustration */}
        <div className="splash-illustrations">
          <svg className="packaging-line-art" viewBox="0 0 340 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Bottle */}
            <path d="M40 78V35C40 32 44 28 47 28H53C56 28 60 32 60 35V78H40Z" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <path d="M48 28V20H52V28" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <line x1="44" y1="46" x2="56" y2="46" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />

            {/* Milk / Juice carton */}
            <path d="M75 78V36L88 24L101 36V78H75Z" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <line x1="88" y1="24" x2="88" y2="78" stroke="rgba(255,255,255,0.25)" strokeWidth="1.2" />

            {/* Big shipping box */}
            <rect x="115" y="38" width="60" height="40" rx="3" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <line x1="145" y1="38" x2="145" y2="78" stroke="rgba(255,255,255,0.35)" strokeWidth="1.2" strokeDasharray="3 3" />
            <path d="M125 52H140" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />
            <path d="M125 58H135" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />

            {/* Jar */}
            <path d="M190 78V48C190 44 194 42 198 42H214C218 42 222 44 222 48V78H190Z" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <rect x="194" y="36" width="24" height="6" rx="2" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <rect x="196" y="54" width="20" height="14" rx="1" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />

            {/* Beverage can */}
            <rect x="238" y="42" width="22" height="36" rx="4" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <ellipse cx="249" cy="42" rx="11" ry="3" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <line x1="243" y1="56" x2="255" y2="56" stroke="rgba(255,255,255,0.3)" strokeWidth="1.2" />

            {/* Small bottle */}
            <path d="M276 78V52C276 49 279 47 282 47H290C293 47 296 49 296 52V78H276Z" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <rect x="283" y="42" width="6" height="5" stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" />
            <line x1="20" y1="78" x2="320" y2="78" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          </svg>
        </div>

        <div className="splash-actions">
          <button
            type="button"
            className="btn-splash-primary"
            onClick={() => onNavigate('login')}
          >
            <span>Get Started</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
