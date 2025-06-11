import React, { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { allShuttles, ShuttleInfo, ExtendedShuttleInfo, ShuttleDirection } from '../../data/shuttleData';

const ShuttleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useI18n();
  const { openLoginModal } = useAuth();
  const { language } = useLanguage();

  const shuttleInfo = useMemo(() => {
    return allShuttles.find(shuttle => shuttle.id === Number(id));
  }, [id]);

  if (!shuttleInfo) {
    return <div style={{ padding: 24, textAlign: 'center' }}>{t.noShuttle}</div>;
  }

  const getRouteNameDisplay = (routeName: ExtendedShuttleInfo['routeName'], direction: ShuttleDirection) => {
    if (routeName === 'SAMSONG_WITH_WONHEUNG') {
      return (
        <>
          {language === 'en' ? 'Samsong' : '삼송'}
          <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '0.5em' }}>
            ({language === 'en' ? 'via Wonheung' : '원흥 경유'})
          </span>
        </>
      );
    } else if (routeName === 'BAEKSEOK' && direction === 'FROM_SCHOOL') {
      return (
        <>
          {t[routeName.toLowerCase()]}
          <span style={{ fontSize: '0.8em', color: '#666', marginLeft: '0.5em' }}>
            ({language === 'en' ? 'via Daegok' : '대곡 경유'})
          </span>
        </>
      );
    } else {
      return t[routeName.toLowerCase()];
    }
  };

  const getDirectionDisplay = (direction: ShuttleDirection, routeName: ExtendedShuttleInfo['routeName']) => {
    const routeNameTranslated = t[routeName.toLowerCase()];
    const schoolText = language === 'en' ? 'Joongbu University' : '중부대학교';

    if (direction === 'TO_SCHOOL') {
      return `${routeNameTranslated} → ${schoolText}`;
    } else {
      return `${schoolText} → ${routeNameTranslated}`;
    }
  };

  const handleRegisterClick = () => {
    openLoginModal();
  };

  return (
    <div style={{ padding: 24, paddingBottom: 80 }}>
      <h2 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>
        {getRouteNameDisplay(shuttleInfo.routeName, shuttleInfo.shuttleDirection)}
      </h2>
      <div style={{ fontSize: 16, lineHeight: 1.5, marginBottom: 32 }}>
        <p style={{ marginBottom: 8 }}>{getDirectionDisplay(shuttleInfo.shuttleDirection, shuttleInfo.routeName)}</p>
        <p>출발 시간: {shuttleInfo.departureTime}</p>
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
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
      </div>
    </div>
  );
};

export default ShuttleDetailPage; 