import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useLanguage } from '../contexts/LanguageContext';

interface ShuttleRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (crowdLevel: string, status: string) => void;
  shuttleId: number;
}

const ShuttleRegistrationModal: React.FC<ShuttleRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  shuttleId,
}) => {
  const t = useI18n();
  const { language } = useLanguage();
  const [selectedCrowdLevel, setSelectedCrowdLevel] = useState<string>('NORMAL'); // 기본값 설정
  const [selectedStatus, setSelectedStatus] = useState<string>('WAITING'); // 기본값 설정

  if (!isOpen) return null;

  // CrowdLevel 및 Status 매핑 함수 (ShuttleInfoCard에서 복사)
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

  const getStatusDisplay = (statusVal: string): string => {
    const statusMap: { [key: string]: { ko: string; en: string } } = {
      WAITING: { ko: '대기 중', en: 'Waiting' },
      BOARDING: { ko: '탑승 중', en: 'Boarding' },
      DEPARTED: { ko: '출발함', en: 'Departed' },
    };
    return statusMap[statusVal]?.[language] || statusVal;
  };

  const handleSubmission = () => {
    onSubmit(selectedCrowdLevel, selectedStatus);
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          textAlign: 'center',
        }}
      >
        <h2 style={{ marginBottom: '20px', fontSize: '22px', fontWeight: 'bold' }}>셔틀 정보 등록</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>혼잡도:</label>
          <select
            value={selectedCrowdLevel}
            onChange={(e) => setSelectedCrowdLevel(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ddd',
            }}
          >
            <option value="EMPTY">{getCrowdLevelDisplay('EMPTY')}</option>
            <option value="LIGHT">{getCrowdLevelDisplay('LIGHT')}</option>
            <option value="NORMAL">{getCrowdLevelDisplay('NORMAL')}</option>
            <option value="LITTLE_CROWDED">{getCrowdLevelDisplay('LITTLE_CROWDED')}</option>
            <option value="VERY_CROWDED">{getCrowdLevelDisplay('VERY_CROWDED')}</option>
            <option value="FULL">{getCrowdLevelDisplay('FULL')}</option>
          </select>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>상태:</label>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ddd',
            }}
          >
            <option value="WAITING">{getStatusDisplay('WAITING')}</option>
            <option value="BOARDING">{getStatusDisplay('BOARDING')}</option>
            <option value="DEPARTED">{getStatusDisplay('DEPARTED')}</option>
          </select>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-around', gap: '10px' }}>
          <button
            onClick={handleSubmission}
            style={{
              padding: '12px 20px',
              fontSize: '18px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            등록
          </button>
          <button
            onClick={onClose}
            style={{
              padding: '12px 20px',
              fontSize: '18px',
              backgroundColor: '#f0f0f0',
              color: '#333',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              flex: 1,
            }}
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShuttleRegistrationModal; 