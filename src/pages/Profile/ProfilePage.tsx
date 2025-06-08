import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import EditProfileModal from '../../components/EditProfileModal';

interface ProfileData {
  nickname: string;
  score: number;
  profileUrl: string;
  level: 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND' | 'MASTER';
  introText: string;
}

const levelDetails = {
  BRONZE: { min: 0, max: 99, nextMin: 100, color: '#CD7F32', icon: '🥉', name: 'BRONZE' },
  SILVER: { min: 100, max: 299, nextMin: 300, color: '#C0C0C0', icon: '🥈', name: 'SILVER' },
  GOLD: { min: 300, max: 599, nextMin: 600, color: '#FFD700', icon: '🥇', name: 'GOLD' },
  PLATINUM: { min: 600, max: 999, nextMin: 1000, color: '#E5E4E2', icon: '✨', name: 'PLATINUM' },
  DIAMOND: { min: 1000, max: 1499, nextMin: 1500, color: '#B9F2FF', icon: '💎', name: 'DIAMOND' },
  MASTER: { min: 1500, max: Infinity, nextMin: Infinity, color: '#FF4500', icon: '👑', name: 'MASTER' },
};

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/members`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data: ProfileData = await response.json();
        setProfile(data);
      } else {
        console.error('프로필 정보를 불러오는데 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 정보 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleLogout = async () => {
    // 1. 메인 페이지로 이동 (replace 옵션 사용)
    navigate('/', { replace: true });

    // 2. isLoggedIn 상태를 false로 변경
    auth.logout();
    
    // 3. 백엔드로 로그아웃 요청 (비동기로 처리)
    try {
      await fetch(`${import.meta.env.VITE_SERVER_URL}/api/auth/kakao/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키 포함
      });
    } catch (error) {
      console.error('로그아웃 중 오류 발생:', error);
    }
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    fetchProfile();
  };

  const currentLevelInfo = profile?.level ? levelDetails[profile.level] : null;
  const contributionBgStyle = currentLevelInfo 
    ? { background: `linear-gradient(to right, ${currentLevelInfo.color}, ${currentLevelInfo.color}BB)` } 
    : { backgroundColor: '#ddd' };

  let progressBarWidth = '0%';
  let percentage = 0; 
  let scoreProgressText = '정보 로딩 중...';

  if (profile && currentLevelInfo) {
    if (profile.level === 'MASTER') {
      progressBarWidth = '100%';
      scoreProgressText = '최고 레벨 달성!';
      percentage = 100; 
    } else {
      const pointsEarnedInCurrentSegment = profile.score - currentLevelInfo.min;
      const totalPointsForCurrentSegment = currentLevelInfo.nextMin - currentLevelInfo.min;
      
      percentage = totalPointsForCurrentSegment > 0
        ? Math.min(100, (pointsEarnedInCurrentSegment / totalPointsForCurrentSegment) * 100)
        : 0;
      
      progressBarWidth = `${percentage}%`;
      scoreProgressText = `${profile.score} / ${currentLevelInfo.nextMin}`;
    }
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
    }}>
      {/* 프로필 수정 버튼 */}
      <div style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '20px',
      }}>
        <button 
          onClick={handleEditClick}
          style={{
            borderRadius: '20px',
            padding: '5px 15px',
            border: '1px solid #ccc',
            backgroundColor: '#eee',
            cursor: 'pointer',
          }}
        >프로필 수정</button>
      </div>

      {/* 프로필 정보 섹션 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '30px',
        width: '100%',
      }}>
        {/* 프로필 사진 */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#ddd',
          marginRight: '20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
          {profile?.profileUrl && (
            <img 
              src={profile.profileUrl} 
              alt="프로필 사진" 
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          )}
        </div>
        {/* 닉네임 */}
        <div style={{
          flexGrow: 1,
          height: '50px',
          backgroundColor: '#ddd',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          fontSize: '1.5em',
        }}>
          {profile?.nickname || '닉네임'}
        </div>
      </div>

      {/* 한 줄 소개 메시지 */}
      {profile?.introText && (
        <div style={{
          width: '100%',
          backgroundColor: '#f0f0f0',
          padding: '10px 15px',
          borderRadius: '5px',
          marginBottom: '20px',
          textAlign: 'center',
          fontSize: '1em',
          color: '#555',
        }}>
          {profile.introText}
        </div>
      )}

      {/* 기여도 섹션 */}
      <div style={{
        width: '100%',
        height: '150px',
        ...contributionBgStyle,
        marginBottom: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.5em',
        color: 'white',
        textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
        borderRadius: '10px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        padding: '10px',
      }}>
        {profile && currentLevelInfo ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '2.5em', marginRight: '10px' }}>{currentLevelInfo.icon}</span>
              <span style={{ fontSize: '2em', fontWeight: 'bold' }}>{currentLevelInfo.name}</span>
            </div>

            {profile.level !== 'MASTER' && (
              <>
                <div style={{
                  width: '80%',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  marginBottom: '5px',
                }}>
                  <span style={{ fontSize: '0.9em', fontWeight: 'bold' }}>{percentage.toFixed(0)}%</span>
                </div>
                {/* Progress Bar */}
                <div style={{
                  width: '80%',
                  height: '15px',
                  backgroundColor: 'black',
                  borderRadius: '7.5px',
                  overflow: 'hidden',
                  marginBottom: '5px',
                }}>
                  <div style={{
                    width: progressBarWidth,
                    height: '100%',
                    backgroundColor: 'white',
                    borderRadius: '7.5px',
                  }}>
                  </div>
                </div>
                {/* Score / Next Level Score below the bar */}
                <p style={{ fontSize: '1em', margin: '0' }}>{scoreProgressText}</p>
              </>
            )}
            {profile.level === 'MASTER' && (
                <p style={{ fontSize: '1em' }}>{scoreProgressText}</p>
            )}
          </>
        ) : (
          <p>기여도 정보 로딩 중...</p>
        )}
      </div>

      {/* 랭킹 확인 버튼 */}
      <button style={{
        width: '100%',
        padding: '15px',
        backgroundColor: '#ddd',
        border: 'none',
        marginBottom: '20px',
        cursor: 'pointer',
        fontSize: '1.2em',
      }}>
        랭킹 확인
      </button>

      {/* 로그아웃 버튼 */}
      <button 
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#ddd',
          border: 'none',
          cursor: 'pointer',
          fontSize: '1em',
        }}
      >
        로그아웃
      </button>

      {/* 프로필 수정 모달 */}
      <EditProfileModal 
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        currentProfile={profile}
        onProfileUpdated={fetchProfile}
      />
    </div>
  );
};

export default ProfilePage; 