import React, { useMemo, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import { allShuttles, ShuttleInfo, ExtendedShuttleInfo, ShuttleDirection } from '../../data/shuttleData';
import ShuttleRegistrationModal from '../../components/ShuttleRegistrationModal';

interface ShuttleLog {
  id: number;
  nickname: string;
  crowdLevel: string;
  status: string;
  time: string;
}

const ShuttleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const t = useI18n();
  const { openLoginModal, isAuthenticated } = useAuth();
  const { language } = useLanguage();

  const [shuttleLogs, setShuttleLogs] = useState<ShuttleLog[]>([]);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);

  // CrowdLevel 매핑 함수 (ShuttleInfoCard에서 복사)
  const getCrowdLevelDisplay = (level: string): string => {
    const crowdMap: { [key: string]: { ko: string; en: string } } = {
      EMPTY: { ko: '🟢 아주 여유', en: '🟢 Empty' },
      LIGHT: { ko: '🟢 여유', en: '🟢 Light' },
      NORMAL: { ko: '🟡 보통', en: '🟡 Normal' },
      LITTLE_CROWDED: { ko: '🟠 혼잡', en: '🟠 Slightly Crowded' },
      VERY_CROWDED: { ko: '🔴 매우 혼잡', en: '🔴 Very Crowded' },
      FULL: { ko: '❌ 만석', en: '❌ Full' },
    };
    return crowdMap[level]?.[language] || level;
  };

  // Status 매핑 함수 (ShuttleInfoCard에서 복사)
  const getStatusDisplay = (statusVal: string): string => {
    const statusMap: { [key: string]: { ko: string; en: string } } = {
      WAITING: { ko: '대기 중', en: 'Waiting' },
      BOARDING: { ko: '탑승 중', en: 'Boarding' },
      DEPARTED: { ko: '출발함', en: 'Departed' },
    };
    return statusMap[statusVal]?.[language] || statusVal;
  };

  const shuttleInfo = useMemo(() => {
    return allShuttles.find(shuttle => shuttle.id === Number(id));
  }, [id]);

  const fetchShuttleLogs = async () => {
    if (!id) return;

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || '';
      const url = `${serverUrl}/api/shuttles/${id}/logs`;

      const response = await fetch(url, {
        method: 'GET',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ShuttleLog[] = await response.json();
      setShuttleLogs(data);
    } catch (error) {
      console.error("셔틀 로그를 가져오는 데 실패했습니다:", error);
    }
  };

  useEffect(() => {
    fetchShuttleLogs();
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
    if (isAuthenticated) {
      setIsRegistrationModalOpen(true);
    } else {
      openLoginModal();
    }
  };

  const handleCloseRegistrationModal = () => {
    setIsRegistrationModalOpen(false);
  };

  const handleSubmitRegistration = async (selectedCrowdLevel: string, selectedStatus: string) => {
    if (!id) return;

    try {
      const serverUrl = import.meta.env.VITE_SERVER_URL || '';
      const url = `${serverUrl}/api/shuttles/${id}/logs`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          crowdLevel: selectedCrowdLevel,
          status: selectedStatus,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to register shuttle info: ${response.status}`);
      }

      setIsRegistrationModalOpen(false);
      fetchShuttleLogs();
      console.log('셔틀 정보가 성공적으로 등록되었습니다.');

    } catch (error) {
      console.error('셔틀 정보 등록에 실패했습니다:', error);
    }
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
        {/* 셔틀 현황 로그 표시 */}
        {shuttleLogs.length > 0 && (
          <div style={{ marginTop: 24, borderTop: '1px solid #eee', paddingTop: 16 }}>
            <h3 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12 }}>셔틀 현황 로그</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '12px' }}>
              {[...shuttleLogs].reverse().map(log => (
                <div key={log.id} style={{ marginBottom: '8px', paddingBottom: '8px', borderBottom: '1px dotted #eee' }}>
                  <p style={{ margin: 0, fontSize: '15px' }}>
                    <strong>{log.nickname}</strong> - 
                    {getCrowdLevelDisplay(log.crowdLevel)} / {getStatusDisplay(log.status)} 
                    <span style={{ float: 'right', color: '#888', fontSize: '14px' }}>{log.time}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        <button
          style={{ background: '#f5f5f5', border: 'none', borderRadius: 4, padding: '12px 0', fontSize: 18, cursor: 'pointer' }}
          onClick={() => navigate(-1)}
        >
          뒤로가기
        </button>
      </div>

      <ShuttleRegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={handleCloseRegistrationModal}
        onSubmit={handleSubmitRegistration}
        shuttleId={Number(id)}
      />
    </div>
  );
};

export default ShuttleDetailPage; 