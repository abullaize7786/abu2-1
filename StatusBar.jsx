import React from 'react';
import { Wifi, BatteryMedium, Signal } from 'lucide-react';

export default function StatusBar({ dark = false }) {
  return (
    <div className={`status-bar ${dark ? 'status-bar-dark' : 'status-bar-light'}`}>
      <div className="status-time">9:41</div>
      <div className="status-notch">
        <div className="notch-pill">
          <div className="notch-camera"></div>
        </div>
      </div>
      <div className="status-icons">
        <Signal size={14} strokeWidth={2.5} />
        <Wifi size={14} strokeWidth={2.5} />
        <div className="battery-badge">
          <BatteryMedium size={18} strokeWidth={2.2} />
        </div>
      </div>
    </div>
  );
}
