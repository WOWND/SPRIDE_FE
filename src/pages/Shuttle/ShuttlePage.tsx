import React, { useState, useMemo, useEffect, useRef } from 'react';
import ShuttleInfoCard, { ShuttleInfo } from './ShuttleInfoCard';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';
import NoticeModal from '../../components/NoticeModal';
import { useNavigate } from 'react-router-dom';

interface ExtendedShuttleInfo extends ShuttleInfo {
  type: '등교' | '하교';
  route: string;
}

interface NoticeItem {
  id: number;
  title: string;
  content: string;
}

const ShuttlePage: React.FC = () => {
  const t = useI18n();
  const { openLoginModal } = useAuth();
  const navigate = useNavigate();

  const [currentTab, setCurrentTab] = useState<'등교' | '하교'>('등교');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [modalNoticeContent, setModalNoticeContent] = useState<string>('');
  const [touchStartX, setTouchStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const notices: NoticeItem[] = useMemo(() => [
    {
      id: 1,
      title: t.noticeTitle1,
      content: t.noticeContent1,
    },
    {
      id: 2,
      title: t.noticeTitle2,
      content: t.noticeContent2,
    },
    {
      id: 3,
      title: t.noticeTitle3,
      content: t.noticeContent3,
    },
  ], [t]);

  const intervalRef = useRef<number | null>(null);
  const noticeContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);

  useEffect(() => {
    if (noticeContainerRef.current) {
      const width = noticeContainerRef.current.offsetWidth;
      setContainerWidth(width);
    }
  }, []);

  const startAutoSwipe = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (notices.length === 0 || containerWidth === 0) return;

    intervalRef.current = setInterval(() => {
      setTranslateX(containerWidth);
      setCurrentNoticeIndex((prevIndex) => (prevIndex + 1) % notices.length);
      setTimeout(() => setTranslateX(0), 50);
    }, 5000);
  };

  useEffect(() => {
    startAutoSwipe();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [notices.length, containerWidth]);

  const handlePrevNotice = () => {
    setTranslateX(-containerWidth);
    setCurrentNoticeIndex((prevIndex) =>
      (prevIndex - 1 + notices.length) % notices.length
    );
    setTimeout(() => setTranslateX(0), 50);
    startAutoSwipe();
  };

  const handleNextNotice = () => {
    setTranslateX(containerWidth);
    setCurrentNoticeIndex((prevIndex) =>
      (prevIndex + 1) % notices.length
    );
    setTimeout(() => setTranslateX(0), 50);
    startAutoSwipe();
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentTouchX = e.touches[0].clientX;
    setTranslateX(currentTouchX - touchStartX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const touchEndX = e.changedTouches[0].clientX;
    const swipeDistance = touchStartX - touchEndX;
    const swipeThreshold = 50;

    if (swipeDistance > swipeThreshold) {
      handleNextNotice();
    } else if (swipeDistance < -swipeThreshold) {
      handlePrevNotice();
    } else {
      setTranslateX(0);
      startAutoSwipe();
    }
  };

  const allShuttles: ExtendedShuttleInfo[] = useMemo(() => [
    { id: 1, title: t.navShuttle + ' A1', description: t.navShuttle + ' A1 정보', type: '등교', route: t.routeA },
    { id: 2, title: t.navShuttle + ' B1', description: t.navShuttle + ' B1 정보', type: '등교', route: t.routeB },
    { id: 3, title: t.navShuttle + ' C1', description: t.navShuttle + ' C1 정보', type: '등교', route: t.routeC },
    { id: 4, title: t.navShuttle + ' A2', description: t.navShuttle + ' A2 정보', type: '하교', route: t.routeA },
    { id: 5, title: t.navShuttle + ' B2', description: t.navShuttle + ' B2 정보', type: '하교', route: t.routeB },
    { id: 6, title: t.navShuttle + ' C2', description: t.navShuttle + ' C2 정보', type: '하교', route: t.routeC },
  ], [t]);

  const availableRoutes = useMemo(() => {
    const routes = new Set<string>();
    allShuttles.forEach(shuttle => {
      if (shuttle.type === currentTab) {
        routes.add(shuttle.route);
      }
    });
    return Array.from(routes);
  }, [allShuttles, currentTab]);

  const filteredShuttles = useMemo(() => {
    return allShuttles.filter(shuttle => {
      const matchesTab = shuttle.type === currentTab;
      const matchesRoute = selectedRoute ? shuttle.route === selectedRoute : true;
      return matchesTab && matchesRoute;
    });
  }, [allShuttles, currentTab, selectedRoute]);

  const handleCardClick = (id: number) => {
    navigate(`/shuttle/${id}`);
  };

  const handleHelpClick = (id: number) => {
    openLoginModal();
  };

  const handleNoticeClick = () => {
    if (notices.length > 0) {
      const currentNotice = notices[currentNoticeIndex];
      setModalNoticeContent(currentNotice.content);
    }
    setIsNoticeModalOpen(true);
  };

  const handleCloseNoticeModal = () => {
    setIsNoticeModalOpen(false);
    setModalNoticeContent('');
  };

  return (
    <div style={{ padding: 24, paddingBottom: 80 }}>
      {/* 공지사항 */}
      {notices.length > 0 && (
        <div
          ref={noticeContainerRef}
          style={{
            background: '#cceeff',
            padding: '8px 12px 15px 12px',
            borderRadius: '8px',
            marginBottom: 12,
            cursor: 'pointer',
            overflow: 'hidden',
            position: 'relative',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={handleNoticeClick}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <span
            key={notices[currentNoticeIndex].id}
            style={{
              flexGrow: 1,
              textAlign: 'center',
              transform: `translateX(${translateX}px)`,
              transition: 'transform 0.3s ease-out',
            }}
          >
            {notices[currentNoticeIndex].title}
          </span>

          {/* 이전 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handlePrevNotice();
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5em',
              cursor: 'pointer',
              position: 'absolute',
              left: '10px',
              zIndex: 1,
              padding: '5px',
            }}
          >
            &#8249;
          </button>

          {/* 다음 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleNextNotice();
            }}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5em',
              cursor: 'pointer',
              position: 'absolute',
              right: '10px',
              zIndex: 1,
              padding: '5px',
            }}
          >
            &#8250;
          </button>

          {/* 페이지네이션 인디케이터 */}
          <span style={{
            position: 'absolute',
            bottom: '8px',
            right: '50%',
            transform: 'translateX(50%)',
            fontSize: '0.8em',
            color: '#333',
          }}>
            {`${currentNoticeIndex + 1} / ${notices.length}`}
          </span>
        </div>
      )}

      {/* 등교/하교 탭 */}
      <div style={{ display: 'flex', marginBottom: '20px', width: '100%' }}>
        <button
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            background: currentTab === '등교' ? '#00bcd4' : '#eee',
            color: currentTab === '등교' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '1.1em',
            borderRadius: '5px 0 0 5px',
          }}
          onClick={() => {
            setCurrentTab('등교');
            setSelectedRoute(null);
          }}
        >
          {t.schoolBound}
        </button>
        <button
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            background: currentTab === '하교' ? '#00bcd4' : '#eee',
            color: currentTab === '하교' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '1.1em',
            borderRadius: '0 5px 5px 0',
          }}
          onClick={() => {
            setCurrentTab('하교');
            setSelectedRoute(null);
          }}
        >
          {t.homeBound}
        </button>
      </div>

      {/* 노선도 선택 드롭다운 */}
      <div style={{ marginBottom: '20px', width: '100%' }}>
        <select
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1em',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
          onChange={(e) => setSelectedRoute(e.target.value === t.allRoutes ? null : e.target.value)}
          value={selectedRoute || t.allRoutes}
        >
          <option value={t.allRoutes}>{t.allRoutes}</option>
          {availableRoutes.map(route => (
            <option key={route} value={route}>{route}</option>
          ))}
        </select>
      </div>

      {/* 셔틀 정보 표시 */}
      {filteredShuttles.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 48, fontSize: 20 }}>
          {t.noShuttle}
        </div>
      ) : (
        filteredShuttles.map((info) => (
          <ShuttleInfoCard key={info.id} info={info} onCardClick={handleCardClick} />
        ))
      )}

      {/* 공지사항 모달 */}
      {isNoticeModalOpen && (
        <NoticeModal
          isOpen={isNoticeModalOpen}
          onClose={handleCloseNoticeModal}
          content={modalNoticeContent}
        />
      )}
    </div>
  );
};

export default ShuttlePage; 