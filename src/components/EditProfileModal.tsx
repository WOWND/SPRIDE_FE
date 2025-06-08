import React, { useState, useEffect } from 'react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    nickname: string;
    introText: string;
    profileUrl: string;
  } | null;
  onProfileUpdated: () => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen, onClose, currentProfile, onProfileUpdated
}) => {
  const [newNickname, setNewNickname] = useState(currentProfile?.nickname || '');
  const [newIntroText, setNewIntroText] = useState(currentProfile?.introText || '');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadMessage, setUploadMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentProfile) {
      setNewNickname(currentProfile.nickname);
      setNewIntroText(currentProfile.introText);
    }
  }, [currentProfile]);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) {
      setUploadMessage('업로드할 파일을 선택해주세요.');
      return;
    }

    const formData = new FormData();
    formData.append('profileImage', selectedFile);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/members/profile-image`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        setUploadMessage('프로필 사진이 성공적으로 업로드되었습니다.');
        onProfileUpdated(); // 부모 컴포넌트의 프로필 정보 갱신
      } else {
        const errorText = await response.text();
        setUploadMessage(`업로드 실패: ${errorText}`);
      }
    } catch (error) {
      console.error('프로필 사진 업로드 중 오류 발생:', error);
      setUploadMessage('프로필 사진 업로드 중 오류가 발생했습니다.');
    }
  };

  const handleSubmitProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/members`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nickname: newNickname,
          introText: newIntroText,
        }),
      });

      if (response.ok) {
        alert('프로필 정보가 성공적으로 수정되었습니다.');
        onProfileUpdated(); // 부모 컴포넌트의 프로필 정보 갱신
        onClose(); // 모달 닫기
      } else {
        alert('프로필 정보 수정에 실패했습니다.');
      }
    } catch (error) {
      console.error('프로필 정보 수정 중 오류 발생:', error);
      alert('프로필 정보 수정 중 오류가 발생했습니다.');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '90%',
        maxWidth: '500px',
        maxHeight: '90vh',
        overflowY: 'auto',
        position: 'relative',
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'none',
            border: 'none',
            fontSize: '1.5em',
            cursor: 'pointer',
          }}
        >
          &times;
        </button>
        <h2>프로필 수정</h2>

        <div style={{ marginBottom: '20px' }}>
          <h3>프로필 사진</h3>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            {currentProfile?.profileUrl && (
              <img 
                src={currentProfile.profileUrl} 
                alt="현재 프로필" 
                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', marginRight: '10px' }}
              />
            )}
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <button onClick={handleImageUpload} style={{ padding: '8px 15px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            업로드
          </button>
          {uploadMessage && <p style={{ fontSize: '0.9em', color: uploadMessage.includes('실패') ? 'red' : 'green' }}>{uploadMessage}</p>}
        </div>

        <form onSubmit={handleSubmitProfile}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>닉네임</label>
            <input
              type="text"
              value={newNickname}
              onChange={(e) => setNewNickname(e.target.value)}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '16px' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>자기소개</label>
            <textarea
              value={newIntroText}
              onChange={(e) => setNewIntroText(e.target.value)}
              rows={4}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '5px', resize: 'vertical', fontSize: '16px' }}
            ></textarea>
          </div>
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            제출
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal; 