import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      // 모달이 열릴 때 히스토리에 상태 추가
      history.pushState({ modal: true }, '', '');
    }

    const handlePopState = (event: PopStateEvent) => {
      // 뒤로 가기 버튼 클릭 시
      if (isOpen) {
        // 모달이 열려있으면 모달 닫기 (기본 뒤로가기는 방지)
        onClose();
        // history.go(1); // 다시 앞으로 이동 (모달 닫는 동작만 수행하고 페이지는 그대로 유지) - 선택 사항
      } else if (event.state && event.state.modal) {
        // 모달 히스토리 상태인데 모달이 닫혀있으면 (예: 수동으로 URL 조작 등) 다시 닫기
        history.go(-1);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      window.removeEventListener('popstate', handlePopState);
      // 모달이 열린 상태로 언마운트될 경우, 추가된 히스토리 상태 제거
      if (isOpen && history.state && history.state.modal) {
         history.go(-1); // 또는 history.replaceState({}, '', window.location.pathname);
      }
    };
  }, [isOpen, onClose]); // isOpen과 onClose가 변경될 때마다 effect 재실행

  // onClose prop이 변경될 때, Modal 컴포넌트 내에서 history.back() 호출을 처리
  const handleClose = () => {
      onClose();
      // 모달이 닫힐 때 (onClose 호출 시) 추가된 히스토리 상태 제거
      if (history.state && history.state.modal) {
          history.back(); // history.go(-1);
      }
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
      onClick={handleClose} // 배경 클릭 시 닫기 시 handleClose 사용
    >
      <div
        style={{
          backgroundColor: '#fff',
          width: '100%',
          height: '100%',
          maxWidth: 'none',
          maxHeight: 'none',
          overflowY: 'auto',
          position: 'relative',
          paddingTop: 68, // 헤더 높이 고려하여 패딩 추가
          paddingBottom: 60, // 하단 네비게이션 높이 고려하여 패딩 추가
          boxSizing: 'border-box',
        }}
        onClick={(e) => e.stopPropagation()} // 모달 내용 클릭 시 닫히지 않게
      >
        {children}
      </div>
    </div>
  );
};

export default Modal; 