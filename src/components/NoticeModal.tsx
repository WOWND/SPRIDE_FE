import React from 'react';

interface NoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: string; // 공지사항 상세 내용
}

const NoticeModal: React.FC<NoticeModalProps> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        width: '80%',
        maxWidth: '500px',
        maxHeight: '80%',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
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
            color: '#888',
          }}
        >
          &times;
        </button>
        <h2>공지사항</h2>
        <div style={{
          flexGrow: 1,
          overflowY: 'auto',
          paddingRight: '10px',
          marginBottom: '20px',
        }}>
          <p style={{ whiteSpace: 'pre-wrap' }}>{content}</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#00bcd4',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoticeModal; 