import React from 'react';
import { useI18n } from '../../hooks/useI18n';

export interface ShuttleInfo {
  id: number;
  title: string;
  description?: string;
}

interface ShuttleInfoCardProps {
  info: ShuttleInfo;
  onHelpClick: (id: number) => void;
}

const ShuttleInfoCard: React.FC<ShuttleInfoCardProps> = ({ info, onHelpClick }) => {
  const t = useI18n();
  return (
    <div style={{ background: '#e0e0e0', borderRadius: 8, padding: 32, marginBottom: 12, textAlign: 'center', fontSize: 28, fontWeight: 600 }}>
      {info.title}
      <div style={{ fontSize: 16, fontWeight: 400, margin: '12px 0 0 0' }}>{info.description}</div>
      <div style={{ marginTop: 16 }}>
        <button
          style={{ background: '#f5f5f5', border: 'none', borderRadius: 4, padding: '8px 0', width: '100%' }}
          onClick={() => onHelpClick(info.id)}
        >
          {t.help}
        </button>
      </div>
    </div>
  );
};

export default ShuttleInfoCard; 