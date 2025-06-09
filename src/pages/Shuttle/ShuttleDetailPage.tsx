import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';

interface ShuttleInfo {
  id: number;
  departureTime: string;
}

interface ExtendedShuttleInfo extends ShuttleInfo {
  routeName: 'BAEKSEOK' | 'SAMSONG' | 'SAMSONG_WITH_WONHEUNG';
  shuttleDirection: 'TO_SCHOOL' | 'FROM_SCHOOL';
}

const ShuttleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useI18n();
  const { openLoginModal } = useAuth();

  const allShuttles: ExtendedShuttleInfo[] = useMemo(() => [
    { id: 1, routeName: 'BAEKSEOK', shuttleDirection: 'TO_SCHOOL', departureTime: '08:20:00' },
    { id: 2, routeName: 'SAMSONG', shuttleDirection: 'TO_SCHOOL', departureTime: '08:30:00' },
    { id: 3, routeName: 'SAMSONG_WITH_WONHEUNG', shuttleDirection: 'TO_SCHOOL', departureTime: '08:40:00' },
    { id: 4, routeName: 'BAEKSEOK', shuttleDirection: 'FROM_SCHOOL', departureTime: '17:00:00' },
    { id: 5, routeName: 'SAMSONG', shuttleDirection: 'FROM_SCHOOL', departureTime: '17:10:00' },
    { id: 6, routeName: 'SAMSONG_WITH_WONHEUNG', shuttleDirection: 'FROM_SCHOOL', departureTime: '17:20:00' },
  ], []);

  const shuttleInfo = useMemo(() => {
    return allShuttles.find(shuttle => shuttle.id === Number(id));
  }, [id, allShuttles]);

  if (!shuttleInfo) {
    return <div style={{ padding: 24, textAlign: 'center' }}>{t.noShuttle}</div>;
  }

  const handleHelpClick = () => {
    openLoginModal();
  };

  const handleRegisterClick = () => {
    openLoginModal();
  };

  return (
    <div style={{ padding: 24, paddingBottom: 80 }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {t[shuttleInfo.routeName.toLowerCase()]} - {t[shuttleInfo.shuttleDirection.toLowerCase()]}
      </h2>
      <div style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 32 }}>
        <p style={{ marginBottom: 8 }}>출발 시간: {shuttleInfo.departureTime}</p>
        <p>노선: {t[shuttleInfo.routeName.toLowerCase()]}</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button
          style={{ background: '#007bff', color: 'white', border: 'none', borderRadius: 4, padding: '12px 0', fontSize: 18, cursor: 'pointer' }}
          onClick={handleRegisterClick}
        >
          {t.register}
        </button>
        <button
          style={{ background: '#f5f5f5', border: 'none', borderRadius: 4, padding: '12px 0', fontSize: 18, cursor: 'pointer' }}
          onClick={handleHelpClick}
        >
          {t.help}
        </button>
      </div>
    </div>
  );
};

export default ShuttleDetailPage; 