import React from 'react';

export const SCREEN_LIST = [
  { id: 'splash', num: '1', name: 'Splash Screen' },
  { id: 'login', num: '2', name: 'Login / Register' },
  { id: 'dashboard', num: '3', name: 'Home Dashboard' },
  { id: 'scan-method', num: '4', name: 'Scan Method Selection' },
  { id: 'scan-camera', num: '5', name: 'Image / Barcode Scan' },
  { id: 'crop-preview', num: '6', name: 'Crop & Confirm' },
  { id: 'extracted-details', num: '7', name: 'Extracted Details' },
  { id: 'flag-detection', num: '8', name: 'Flag Detection' },
  { id: 'rule-mapping', num: '9', name: 'Rule Mapping' },
  { id: 'corrective-suggestions', num: '10', name: 'Corrective Suggestions' },
  { id: 'compliance-result', num: '11', name: 'Compliance Result' },
  { id: 'flagged-history', num: '12', name: 'Flagged History + Evidence' },
  { id: 'single-flag', num: '13', name: 'Single Flag Detail' },
  { id: 'compliance-report', num: '14', name: 'Compliance Report' },
  { id: 'report-preview', num: '15', name: 'Report Preview' },
  { id: 'profile', num: '16', name: 'Profile & Settings' },
  { id: 'notifications', num: '18', name: 'Notifications' },
];

export default function DeviceFrame({ children }) {
  return (
    <div className="device-wrapper-page">
      {/* Main Container */}
      <main className="device-stage stage-phone">
        <div className="phone-mockup-frame">
          {/* Phone Bezel Buttons */}
          <div className="phone-btn-volume-up"></div>
          <div className="phone-btn-volume-down"></div>
          <div className="phone-btn-power"></div>

          {/* Inner Phone Screen */}
          <div className="phone-screen-viewport">
            {children}
            {/* Home indicator bar */}

          </div>
        </div>
      </main>
    </div>
  );
}
