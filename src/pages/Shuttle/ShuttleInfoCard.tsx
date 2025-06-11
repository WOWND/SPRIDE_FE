import React, { useState, useEffect } from 'react';
import { useI18n } from '../../hooks/useI18n';
import { useLanguage } from '../../contexts/LanguageContext';

export interface ShuttleInfo {
  id: number;
  routeName: 'BAEKSEOK' | 'SAMSONG' | 'SAMSONG_WITH_WONHEUNG';
  shuttleDirection: 'TO_SCHOOL' | 'FROM_SCHOOL';
  departureTime: string;
}

interface ShuttleInfoCardProps {
  info: ShuttleInfo;
  onCardClick: (id: number) => void;
  onHelpClick: (id: number) => void;
  showCountdown?: boolean;
  crowdLevel?: string;
  status?: string;
  updateTime?: string;
}

const ShuttleInfoCard: React.FC<ShuttleInfoCardProps> = ({ info, onCardClick, onHelpClick, showCountdown = false, crowdLevel, status, updateTime }) => {
  const t = useI18n();
  const { language } = useLanguage();
  const [remainingTime, setRemainingTime] = useState<string>('');

  // CrowdLevel에 따른 배경색 매핑 함수
  const getBackgroundColorByCrowdLevel = (level?: string): string => {
    if (!level) return 'rgba(255, 255, 255, 0.5)'; // 기본 투명한 흰색
    switch (level) {
      case 'EMPTY': return '#e0ffe0'; // 아주 여유 - 연한 초록
      case 'LIGHT': return '#ccffcc'; // 여유 - 연한 초록
      case 'NORMAL': return '#e0f2f7'; // 보통 - 연한 파랑
      case 'LITTLE_CROWDED': return '#ffe0b2'; // 혼잡 - 연한 주황
      case 'VERY_CROWDED': return '#ffccbc'; // 매우 혼잡 - 연한 빨강
      case 'FULL': return '#ffaaaa'; // 만석 - 좀 더 진한 빨강
      default: return 'rgba(255, 255, 255, 0.5)';
    }
  };

  // CrowdLevel 매핑 함수
  const getCrowdLevelDisplay = (level?: string): string => {
    if (!level) return '';
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

  // Status 매핑 함수
  const getStatusDisplay = (statusVal?: string): string => {
    if (!statusVal) return '';
    const statusMap: { [key: string]: { ko: string; en: string } } = {
      WAITING: { ko: '대기 중', en: 'Waiting' },
      BOARDING: { ko: '탑승 중', en: 'Boarding' },
      DEPARTED: { ko: '출발함', en: 'Departed' },
    };
    return statusMap[statusVal]?.[language] || statusVal;
  };

  // 업데이트 시간 계산 및 표시 함수
  const getUpdateTimeDisplay = (timeString?: string): string => {
    if (!timeString) return '';

    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    const providedDate = new Date();
    providedDate.setHours(hours, minutes, seconds, 0);

    const now = new Date();
    const diffMillis = now.getTime() - providedDate.getTime();
    const diffMinutes = Math.floor(diffMillis / (1000 * 60));

    if (diffMinutes < 1) {
      return language === 'en' ? 'Updated Just now' : '방금 전 정보';
    } else if (diffMinutes < 60) {
      return language === 'en' ? `Updated ${diffMinutes} min ago` : `${diffMinutes}분 전 정보`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMins = diffMinutes % 60;
      return language === 'en' ? `Updated ${diffHours} hr ${remainingMins} min ago` : `${diffHours}시간 ${remainingMins}분 전 정보`;
    }
  };

  useEffect(() => {
    if (!showCountdown) return;

    const calculateRemainingTime = () => {
      const now = new Date();
      const [hours, minutes] = info.departureTime.split(':').map(Number);
      const departureTime = new Date();
      departureTime.setHours(hours, minutes, 0, 0);

      if (departureTime < now) {
        setRemainingTime(language === 'en' ? 'Departed' : '출발');
        return;
      }

      const diff = departureTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diff / (1000 * 60));
      
      if (diffMinutes < 60) {
        setRemainingTime(language === 'en' ? `${diffMinutes}M left` : `${diffMinutes}분 전`);
      } else {
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        setRemainingTime(
          language === 'en' 
            ? `${hours}H ${minutes}M left`
            : `${hours}시간 ${minutes}분 전`
        );
      }
    };

    calculateRemainingTime();
    const interval = setInterval(calculateRemainingTime, 60000); // 1분마다 업데이트

    return () => clearInterval(interval);
  }, [info.departureTime, showCountdown, language]);

  return (
    <div
      style={{
        background: '#e0e0e0',
        borderRadius: 8,
        padding: 24,
        marginBottom: 12,
        cursor: 'pointer',
      }}
      onClick={() => onCardClick(info.id)}
    >
      {/* 상단: 셔틀 이름과 시간 */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 12,
        fontSize: 20,
        fontWeight: 600
      }}>
        <div>
          {info.routeName === 'SAMSONG_WITH_WONHEUNG' ? (
            <>
              <div>{language === 'en' ? 'Samsong' : '삼송'}</div>
              <div style={{ fontSize: 14, color: '#666' }}>
                {language === 'en' ? '(via Wonheung)' : '(원흥 경유)'}
              </div>
            </>
          ) : info.routeName === 'BAEKSEOK' && info.shuttleDirection === 'FROM_SCHOOL' ? (
            <>
              <div>{t[info.routeName.toLowerCase()]}</div>
              <div style={{ fontSize: 14, color: '#666' }}>
                {language === 'en' ? '(via Daegok)' : '(대곡 경유)'}
              </div>
            </>
          ) : (
            t[info.routeName.toLowerCase()]
          )}
        </div>
        <div>
          {info.departureTime}
          {showCountdown && remainingTime && (
            <span style={{ fontSize: 16, color: '#007bff', marginLeft: '8px' }}>
              ({remainingTime})
            </span>
          )}
        </div>
      </div>

      {/* 중간: 셔틀 방향 설명 */}
      <div style={{ 
        fontSize: 16, 
        color: '#666',
        marginBottom: 12,
        padding: '8px 0',
        borderBottom: '1px solid #ccc'
      }}>
        {info.shuttleDirection === 'TO_SCHOOL' ? (
          `${t[info.routeName.toLowerCase()]} → ${language === 'en' ? 'Joongbu University' : '중부대학교'}`
        ) : (
          `${language === 'en' ? 'Joongbu University' : '중부대학교'} → ${t[info.routeName.toLowerCase()]}`
        )}
      </div>

      {/* 하단: 셔틀 현황 */}
      <div style={{ 
        fontSize: 16,
        color: '#666',
        padding: '8px 0',
        backgroundColor: getBackgroundColorByCrowdLevel(crowdLevel),
        borderRadius: 4,
        textAlign: 'center'
      }}>
        {crowdLevel && status ? (
          <>
            <span style={{ fontWeight: 'bold' }}>{getCrowdLevelDisplay(crowdLevel)}</span> 
            <span> / </span>
            <span style={{ fontWeight: 'bold' }}>{getStatusDisplay(status)}</span>
            {updateTime && (
              <div style={{ fontSize: 12, color: '#888', marginTop: '4px' }}>
                ({getUpdateTimeDisplay(updateTime)}) 
              </div>
            )}
          </>
        ) : (
          '셔틀 현황을 불러오는 중...'
        )}
      </div>
    </div>
  );
};

export default ShuttleInfoCard; 