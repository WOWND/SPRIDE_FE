import React, { useState } from 'react';
import { useI18n } from '../hooks/useI18n';
import { useLanguage } from '../contexts/LanguageContext';

interface TaxiRegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { content: string; direction: string; route: string; type: string }) => void;
}

const TaxiRegistrationModal: React.FC<TaxiRegistrationModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const t = useI18n();
  const { language } = useLanguage();
  const [direction, setDirection] = useState<string>('TO_SCHOOL');
  const [route, setRoute] = useState<string>('BAEKSEOK');
  const [content, setContent] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (!content.trim()) {
      alert(t.모집_내용을_입력해주세요);
      return;
    }
    setIsSubmitting(true);
    try {
      await onSubmit({
        content,
        direction,
        route,
        type: 'TAXI',
      });
      onClose();
    } catch (error) {
      console.error('택시팟 등록 실패:', error);
      alert(t.택시팟_등록에_실패했습니다);
    } finally {
      setIsSubmitting(false);
    }
  };

  const directionOptions = [
    { value: 'TO_SCHOOL', label: t.toSchool },
    { value: 'FROM_SCHOOL', label: t.fromSchool },
  ];

  const routeOptions = [
    { value: 'BAEKSEOK', label: t.baekseok },
    { value: 'SAMSUNG', label: t.samsong },
    { value: 'SAMSUNG_VIA_WONHEUNG', label: t.samsong_with_wonheung },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '25px',
          borderRadius: '10px',
          width: '90%',
          maxWidth: '400px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>{t.택시팟_모집하기}</h2>

        <div>
          <label htmlFor="direction-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {t.방향}
          </label>
          <select
            id="direction-select"
            value={direction}
            onChange={(e) => setDirection(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          >
            {directionOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="route-select" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {t.노선}
          </label>
          <select
            id="route-select"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          >
            {routeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="content-textarea" style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            {t.모집_내용}
          </label>
          <textarea
            id="content-textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={t.예_2명_구해요_짐_많으신_분_환영합니다}
            rows={5}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              resize: 'vertical',
            }}
          ></textarea>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              backgroundColor: '#f0f0f0',
              cursor: 'pointer',
            }}
          >
            {t.취소}
          </button>
          <button
            onClick={handleRegister}
            disabled={isSubmitting}
            style={{
              padding: '10px 20px',
              borderRadius: '5px',
              border: 'none',
              backgroundColor: isSubmitting ? '#cccccc' : '#007bff',
              color: 'white',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
            }}
          >
            {isSubmitting ? t.등록_중 : t.등록}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaxiRegistrationModal; 