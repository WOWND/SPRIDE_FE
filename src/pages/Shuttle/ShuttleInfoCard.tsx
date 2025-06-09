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
}

const ShuttleInfoCard: React.FC<ShuttleInfoCardProps> = ({ info, onCardClick, onHelpClick, showCountdown = false }) => {
  const t = useI18n();
  const { language } = useLanguage();
  const [remainingTime, setRemainingTime] = useState<string>('');

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
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        borderRadius: 4,
        textAlign: 'center'
      }}>
        {language === 'en' ? 'Joongbu University' : '중부대학교'} 셔틀 현황
      </div>
    </div>
  );
};

export default ShuttleInfoCard; 