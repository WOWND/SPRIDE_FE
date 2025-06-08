import React from 'react';
import { useI18n } from '../../hooks/useI18n';

export interface ShuttleInfo {
  id: number;
  title: string;
  description?: string;
  type: '등교' | '하교';
  route: string;
}

interface ShuttleInfoCardProps {
  info: ShuttleInfo;
  onCardClick: (id: number) => void;
}

const ShuttleInfoCard: React.FC<ShuttleInfoCardProps> = ({ info, onCardClick }) => {
  const t = useI18n();
  return (
    <div
      style={{
        background: '#e0e0e0',
        borderRadius: 8,
        padding: 32,
        marginBottom: 12,
        textAlign: 'center',
        fontSize: 28,
        fontWeight: 600,
        cursor: 'pointer',
      }}
      onClick={() => onCardClick(info.id)}
    >
      {info.title}
      <div style={{ fontSize: 16, fontWeight: 400, margin: '12px 0 0 0' }}>{info.description}</div>
    </div>
  );
};

export default ShuttleInfoCard; 