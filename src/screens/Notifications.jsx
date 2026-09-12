import React, { useState } from 'react';
import { ArrowLeft, AlertCircle, CheckCircle2, Info, ChevronRight, Bell } from 'lucide-react';
import BottomNav from '../components/BottomNav';
import { mockNotifications } from '../data/mockData';

export default function Notifications({ onNavigate }) {
  const [filter, setFilter] = useState('all');

  const filteredList = mockNotifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'flags') return n.type === 'flag';
    if (filter === 'updates') return n.type === 'update' || n.type === 'system';
    return true;
  });

  const getIcon = (item) => {
    if (item.severity === 'high') {
      return (
        <div className="notif-icon-circle icon-danger">
          <AlertCircle size={16} />
        </div>
      );
    }
    if (item.severity === 'medium') {
      return (
        <div className="notif-icon-circle icon-warning">
          <AlertCircle size={16} />
        </div>
      );
    }
    if (item.type === 'system') {
      return (
        <div className="notif-icon-circle icon-success">
          <CheckCircle2 size={16} />
        </div>
      );
    }
    return (
      <div className="notif-icon-circle icon-info">
        <Info size={16} />
      </div>
    );
  };

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
        <h3 className="screen-header-title">Notifications</h3>
        <div style={{ width: 32 }}></div>
      </div>

      <div className="screen-scroll-body padded-body">
        {/* Filter Pills */}
        <div className="filter-chips-row">
          <button
            type="button"
            className={`filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'flags' ? 'active' : ''}`}
            onClick={() => setFilter('flags')}
          >
            Flags
          </button>
          <button
            type="button"
            className={`filter-chip ${filter === 'updates' ? 'active' : ''}`}
            onClick={() => setFilter('updates')}
          >
            Updates
          </button>
        </div>

        {/* Notifications list */}
        <div className="notifications-list">
          {filteredList.map((item) => (
            <div
              key={item.id}
              className={`notif-card ${!item.read ? 'unread' : ''}`}
              onClick={() => {
                if (item.type === 'flag') {
                  onNavigate('single-flag');
                } else if (item.type === 'system') {
                  onNavigate('compliance-report');
                }
              }}
            >
              {getIcon(item)}
              <div className="notif-details">
                <h5 className="notif-title">{item.title}</h5>
                <span className="notif-time">{item.date}</span>
              </div>
              <ChevronRight size={16} className="chevron-icon" />
            </div>
          ))}
        </div>
      </div>

      <BottomNav
        activeTab="home"
        onSelectTab={(tabId, screen) => onNavigate(screen)}
      />
    </div>
  );
}
