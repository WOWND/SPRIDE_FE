import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';
import { ShuttleInfo } from './ShuttleInfoCard';

interface ExtendedShuttleInfo extends ShuttleInfo {
  type: '등교' | '하교';
  route: string;
}

const ShuttleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useI18n();
  const { openLoginModal } = useAuth();

  const allShuttles: ExtendedShuttleInfo[] = useMemo(() => [
    { id: 1, title: t.navShuttle + ' A1', description: t.navShuttle + ' A1 정보입니다. 이 셔틀은 학교 정문에서 출발하여 도서관을 거쳐 기숙사까지 운행합니다.', type: '등교', route: t.routeA },
    { id: 2, title: t.navShuttle + ' B1', description: t.navShuttle + ' B1 정보입니다. 이 셔틀은 시내를 경유하여 학교 후문까지 운행합니다.', type: '등교', route: t.routeB },
    { id: 3, title: t.navShuttle + ' C1', description: t.navShuttle + ' C1 정보입니다. 이 셔틀은 시외버스터미널에서 학교까지 운행합니다.', type: '등교', route: t.routeC },
    { id: 4, title: t.navShuttle + ' A2', description: t.navShuttle + ' A2 정보입니다. 이 셔틀은 기숙사에서 출발하여 도서관을 거쳐 학교 정문까지 운행합니다.', type: '하교', route: t.routeA },
    { id: 5, title: t.navShuttle + ' B2', description: t.navShuttle + ' B2 정보입니다. 이 셔틀은 학교 후문에서 시내를 경유하여 운행합니다.', type: '하교', route: t.routeB },
    { id: 6, title: t.navShuttle + ' C2', description: t.navShuttle + ' C2 정보입니다. 이 셔틀은 학교에서 시외버스터미널까지 운행합니다.', type: '하교', route: t.routeC },
  ], [t]);

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
    openLoginModal(); // 또는 회원가입 페이지로 이동하는 로직 추가
  };

  return (
    <div style={{ padding: 24, paddingBottom: 80 }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>{shuttleInfo.title}</h2>
      <p style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 32 }}>{shuttleInfo.description}</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <button
          style={{ background: '#00bcd4', color: 'white', border: 'none', borderRadius: 4, padding: '12px 0', fontSize: 18, cursor: 'pointer' }}
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