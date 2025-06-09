import React, { useState, useMemo, useEffect, useRef } from 'react';
import ShuttleInfoCard from './ShuttleInfoCard';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';
import NoticeModal from '../../components/NoticeModal';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';

interface ShuttleInfo {
  id: number;
  departureTime: string;
}

type ShuttleDirection = 'TO_SCHOOL' | 'FROM_SCHOOL';

interface ExtendedShuttleInfo extends ShuttleInfo {
  routeName: 'BAEKSEOK' | 'SAMSONG' | 'SAMSONG_WITH_WONHEUNG';
  shuttleDirection: ShuttleDirection;
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

  const [currentTab, setCurrentTab] = useState<'TO_SCHOOL' | 'FROM_SCHOOL'>('TO_SCHOOL');
  const [selectedRoute, setSelectedRoute] = useState<string | null>(null);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [modalNoticeContent, setModalNoticeContent] = useState<string>('');
  const [touchStartX, setTouchStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showAllShuttles, setShowAllShuttles] = useState(false);
  const { language } = useLanguage();

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

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }));
    };

    updateTime(); // 초기 시간 설정
    const intervalId = setInterval(updateTime, 60000); // 1분마다 시간 업데이트

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 정리
  }, []);

  // "HH:MM" 형식의 시간을 분 단위 숫자로 변환하는 헬퍼 함수
  const timeToMinutes = (timeString: string): number => {
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
  };

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
    {"id": 1, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:20"},
    {"id": 2, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:25"},
    {"id": 3, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:30"},
    {"id": 4, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:40"},
    {"id": 5, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:00"},
    {"id": 6, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:20"},
    {"id": 7, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:25"},
    {"id": 8, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:30"},
    {"id": 9, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:00"},
    {"id": 10, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:15"},
    {"id": 11, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:25"},
    {"id": 12, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "11:00"},
    {"id": 13, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "12:00"},
    {"id": 14, "routeName": "BAEKSEOK", "shuttleDirection": "TO_SCHOOL", "departureTime": "14:00"},
    {"id": 15, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "11:20"},
    {"id": 16, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "13:20"},
    {"id": 17, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "14:20"},
    {"id": 18, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "15:20"},
    {"id": 19, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:20"},
    {"id": 20, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:30"},
    {"id": 21, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:00"},
    {"id": 22, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:20"},
    {"id": 23, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:30"},
    {"id": 24, "routeName": "BAEKSEOK", "shuttleDirection": "FROM_SCHOOL", "departureTime": "18:20"},
    {"id": 25, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:20"},
    {"id": 26, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:35"},
    {"id": 27, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "08:40"},
    {"id": 28, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:00"},
    {"id": 29, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:10"},
    {"id": 30, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "09:30"},
    {"id": 31, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:10"},
    {"id": 32, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "10:30"},
    {"id": 33, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "11:20"},
    {"id": 34, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "13:20"},
    {"id": 35, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "14:20"},
    {"id": 36, "routeName": "SAMSONG", "shuttleDirection": "TO_SCHOOL", "departureTime": "15:20"},
    {"id": 37, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "12:20"},
    {"id": 38, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "13:20"},
    {"id": 39, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "14:20"},
    {"id": 40, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "15:20"},
    {"id": 41, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:00"},
    {"id": 42, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "16:20"},
    {"id": 43, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:00"},
    {"id": 44, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:20"},
    {"id": 45, "routeName": "SAMSONG_WITH_WONHEUNG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "17:30"},
    {"id": 46, "routeName": "SAMSONG_WITH_WONHEUNG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "18:10"},
    {"id": 47, "routeName": "SAMSONG_WITH_WONHEUNG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "18:20"},
    {"id": 48, "routeName": "SAMSONG", "shuttleDirection": "FROM_SCHOOL", "departureTime": "19:20"},
  ], []);

  const availableRoutes = useMemo(() => {
    const routes = new Set<string>();
    allShuttles.forEach(shuttle => {
      if (shuttle.shuttleDirection === currentTab) {
        routes.add(shuttle.routeName);
      }
    });
    return Array.from(routes);
  }, [allShuttles, currentTab]);

  const filteredShuttles = useMemo(() => {
    const currentMinutes = timeToMinutes(currentTime);

    return allShuttles.filter(shuttle => {
      const matchesTab = shuttle.shuttleDirection === currentTab;
      const matchesRoute = selectedRoute 
        ? selectedRoute === 'SAMSONG' 
          ? shuttle.routeName === 'SAMSONG' || shuttle.routeName === 'SAMSONG_WITH_WONHEUNG'
          : shuttle.routeName === selectedRoute
        : true;
      
      const shuttleMinutes = timeToMinutes(shuttle.departureTime);
      const isFutureTime = shuttleMinutes >= currentMinutes;

      console.log(`[Shuttle Filter] Tab: ${currentTab}, Shuttle: ${shuttle.routeName}-${shuttle.shuttleDirection} at ${shuttle.departureTime} (${shuttleMinutes}min), Current Time: ${currentTime} (${currentMinutes}min), MatchesTab: ${matchesTab}, MatchesRoute: ${matchesRoute}, IsFuture: ${isFutureTime}, Result: ${matchesTab && matchesRoute && isFutureTime}`);

      return matchesTab && matchesRoute && isFutureTime;
    }).sort((a, b) => {
      return timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime);
    });
  }, [allShuttles, currentTab, selectedRoute, currentTime]);

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
            background: currentTab === 'TO_SCHOOL' ? '#007bff' : '#f0f0f0',
            color: currentTab === 'TO_SCHOOL' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '1.1em',
            borderRadius: '5px 0 0 5px',
          }}
          onClick={() => {
            setCurrentTab('TO_SCHOOL');
            setSelectedRoute(null);
          }}
        >
          {t.toSchool}
        </button>
        <button
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            background: currentTab === 'FROM_SCHOOL' ? '#007bff' : '#f0f0f0',
            color: currentTab === 'FROM_SCHOOL' ? 'white' : 'black',
            cursor: 'pointer',
            fontSize: '1.1em',
            borderRadius: '0 5px 5px 0',
          }}
          onClick={() => {
            setCurrentTab('FROM_SCHOOL');
            setSelectedRoute(null);
          }}
        >
          {t.fromSchool}
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
          onChange={(e) => setSelectedRoute(e.target.value === t.allRoutes ? null : e.target.value)}>
          <option value={t.allRoutes}>{t.allRoutes}</option>
          {availableRoutes.map(route => (
            <option key={route} value={route}>
              {route === 'BAEKSEOK' && currentTab === 'FROM_SCHOOL' 
                ? language === 'en' 
                  ? 'Baekseok (via Daegok)'
                  : '백석(대곡 경유)'
                : t[route.toLowerCase()] || route}
            </option>
          ))}
        </select>
      </div>

      {/* 셔틀 정보 표시 */}
      {filteredShuttles.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#888', marginTop: 48, fontSize: 20 }}>
          {t.noShuttle}
        </div>
      ) : (
        <>
          {filteredShuttles.slice(0, showAllShuttles ? undefined : 3).map((shuttle, index) => (
            <ShuttleInfoCard
              key={shuttle.id}
              info={shuttle}
              onCardClick={handleCardClick}
              onHelpClick={handleHelpClick}
              showCountdown={!showAllShuttles && index < 3}
            />
          ))}
          {filteredShuttles.length > 3 && !showAllShuttles && (
            <button
              onClick={() => setShowAllShuttles(true)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '16px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                color: '#007bff',
                fontSize: '16px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              {language === 'en' ? 'View more (' : '더보기 ('}
              {filteredShuttles.length - 3}
              {language === 'en' ? 'more)' : '개 더 보기)'}

            </button>
          )}
          {showAllShuttles && (
            <button
              onClick={() => setShowAllShuttles(false)}
              style={{
                width: '100%',
                padding: '12px',
                marginTop: '16px',
                backgroundColor: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '8px',
                color: '#6c757d',
                fontSize: '16px',
                cursor: 'pointer',
                textAlign: 'center'
              }}
            >
              접기
            </button>
          )}
        </>
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