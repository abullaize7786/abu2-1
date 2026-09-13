import React from 'react';
import { Home, History, FileText, User } from 'lucide-react';

export default function BottomNav({ activeTab, onSelectTab }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home, screen: 'dashboard' },
    { id: 'history', label: 'History', icon: History, screen: 'flagged-history' },
    { id: 'report', label: 'Report', icon: FileText, screen: 'compliance-report' },
    { id: 'profile', label: 'Profile', icon: User, screen: 'profile' },
  ];

  return (
    <div className="bottom-nav">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onSelectTab(tab.id, tab.screen)}
          >
            <div className="nav-icon-wrapper">
              <Icon size={20} strokeWidth={isActive ? 2.4 : 1.8} />
              {tab.id === 'home' && <span className="nav-dot" />}
            </div>
            <span className="nav-label">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
