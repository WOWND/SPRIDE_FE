import React from 'react';
import { useI18n } from '../hooks/useI18n';

const BottomNav: React.FC = () => {
  const t = useI18n();
  const navs: { key: string; icon: string; labelKey: keyof typeof t; active: boolean }[] = [
    { key: 'shuttle', icon: '🚌', labelKey: 'navShuttle', active: true },
    { key: 'taxi', icon: '🚕', labelKey: 'navTaxi', active: false },
    { key: 'lost', icon: '📦', labelKey: 'navLost', active: false },
    { key: 'profile', icon: '👤', labelKey: 'navProfile', active: false },
  ];

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      background: '#f5f5f5',
      borderTop: '1px solid #ddd',
      padding: '6px 0 4px 0',
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
      zIndex: 100
    }}>
      {navs.map((nav) => (
        <button
          key={nav.key}
          style={{
            background: 'none',
            border: 'none',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: nav.active ? '#00bcd4' : '#888',
            fontWeight: nav.active ? 700 : 400,
            fontSize: 22,
            cursor: 'pointer',
            flex: 1,
            padding: 0,
          }}
        >
          <span style={{ fontSize: 26, marginBottom: 2 }}>{nav.icon}</span>
          <span style={{ fontSize: 12 }}>{t[nav.labelKey]}</span>
        </button>
      ))}
    </nav>
  );
};

export default BottomNav; 