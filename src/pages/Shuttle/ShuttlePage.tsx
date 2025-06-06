import React, { useState } from 'react';
import ShuttleInfoCard, { ShuttleInfo } from './ShuttleInfoCard';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';

const ShuttlePage: React.FC = () => {
  const t = useI18n();
  const { openLoginModal } = useAuth();
  // 더미 데이터: 필요시 수정 가능
  const [shuttles, setShuttles] = useState<ShuttleInfo[]>([
    { id: 1, title: t.navShuttle + ' 1', description: t.navShuttle + ' 정보 1' }, // 더미 데이터도 다국어 적용
    { id: 2, title: t.navShuttle + ' 2', description: t.navShuttle + ' 정보 2' }, // 더미 데이터도 다국어 적용
  ]);

  const handleHelpClick = (id: number) => {
    // 로그인 모달 띄우기
    openLoginModal();
    // alert(`셔틀 ID ${id} 도움/신고 클릭됨`); // 테스트용 alert 제거
  };

  const handleRegisterClick = () => {
    // 로그인 모달 띄우기
    openLoginModal();
  };

  return (
    <div style={{ padding: 24, paddingBottom: 80 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <button
          style={{ background: '#e0e0e0', border: 'none', padding: '12px 32px', borderRadius: 4, cursor: 'pointer' }}
          onClick={handleRegisterClick}
        >
          {t.register}
        </button>
        {/* 설정(언어) 버튼은 헤더에 있음 */}
      </div>
      <div style={{ background: '#b2ebf2', padding: 12, borderRadius: 4, textAlign: 'center', marginBottom: 16 }}>
        {t.notice}
      </div>
      {shuttles.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 48, fontSize: 20 }}>
          {t.noShuttle}
        </div>
      ) : (
        shuttles.map((info) => (
          <ShuttleInfoCard key={info.id} info={info} onHelpClick={handleHelpClick} />
        ))
      )}
    </div>
  );
};

export default ShuttlePage; 