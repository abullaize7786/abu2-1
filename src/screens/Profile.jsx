import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  Folder,
  FileText,
  Bell,
  BookOpen,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight
} from 'lucide-react';
import BottomNav from '../components/BottomNav';

export default function Profile({ onNavigate, onOpenHandbook, onLogout, currentUser, scanCount = 0 }) {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const email = currentUser || 'muhammad@email.com';
  const username = email.split('@')[0];
  const displayName = username
    .split('.')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return (
    <div className="screen-container">
      {/* Screen Header */}
      <div className="screen-header">
        <button
          type="button"
          className="header-back-btn"
          onClick={() => onNavigate('dashboard')}
        >
          <ArrowLeft size={20} />
        </button>
        <h3 className="screen-header-title">Profile &amp; Settings</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* User Profile Card */}
        <div className="profile-user-card">
          <div className="profile-avatar-circle">
            <User size={32} />
          </div>
          <div className="profile-user-meta">
            <h4>{displayName}</h4>
            <p>{email}</p>
            <span className="profile-role-tag">Certified Compliance Inspector</span>
          </div>
        </div>

        {/* Settings list */}
        <div className="settings-menu-list">
          <button
            type="button"
            className="settings-menu-item"
            onClick={() => onNavigate('flagged-history')}
          >
            <div className="settings-item-left">
              <Folder size={18} className="settings-icon" />
              <span>My Scans ({scanCount})</span>
            </div>
            <ChevronRight size={18} className="chevron-icon" />
          </button>

          <button
            type="button"
            className="settings-menu-item"
            onClick={() => onNavigate('compliance-report')}
          >
            <div className="settings-item-left">
              <FileText size={18} className="settings-icon" />
              <span>Saved Reports</span>
            </div>
            <ChevronRight size={18} className="chevron-icon" />
          </button>

          <div className="settings-menu-item">
            <div className="settings-item-left">
              <Bell size={18} className="settings-icon" />
              <span>Notifications</span>
            </div>
            <label className="toggle-switch">
              <input
                type="checkbox"
                checked={notificationsEnabled}
                onChange={(e) => setNotificationsEnabled(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>

          <button
            type="button"
            className="settings-menu-item"
            onClick={onOpenHandbook}
          >
            <div className="settings-item-left">
              <BookOpen size={18} className="settings-icon" />
              <span>Legal Metrology Rules (2011)</span>
            </div>
            <ChevronRight size={18} className="chevron-icon" />
          </button>

          <button
            type="button"
            className="settings-menu-item"
            onClick={() => alert('Support line: 1800-11-4000 (Toll Free) | National Consumer Helpline')}
          >
            <div className="settings-item-left">
              <HelpCircle size={18} className="settings-icon" />
              <span>Help &amp; Support</span>
            </div>
            <ChevronRight size={18} className="chevron-icon" />
          </button>

          <button
            type="button"
            className="settings-menu-item"
            onClick={() => alert('Legal Metrology Compliance Checker v2.4.0\nDepartment of Consumer Affairs, Government of India')}
          >
            <div className="settings-item-left">
              <Info size={18} className="settings-icon" />
              <span>About App</span>
            </div>
            <ChevronRight size={18} className="chevron-icon" />
          </button>

          <button
            type="button"
            className="settings-menu-item item-danger"
            onClick={onLogout}
          >
            <div className="settings-item-left">
              <LogOut size={18} className="settings-icon text-danger" />
              <span className="text-danger">Logout ({email})</span>
            </div>
            <ChevronRight size={18} className="chevron-icon text-danger" />
          </button>
        </div>
      </div>

      <BottomNav
        activeTab="profile"
        onSelectTab={(tabId, screen) => onNavigate(screen)}
      />
    </div>
  );
}
