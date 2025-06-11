import React, { useState, useMemo, useEffect, useRef } from 'react';
import ShuttleInfoCard from './ShuttleInfoCard';
import { useI18n } from '../../hooks/useI18n';
import { useAuth } from '../../contexts/AuthContext';
import NoticeModal from '../../components/NoticeModal';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { allShuttles, ShuttleDirection, ExtendedShuttleInfo } from '../../data/shuttleData';

interface ShuttleInfo {
  id: number;
  departureTime: string;
}

interface NoticeItem {
  id: number;
  title: string;
  content: string;
}

interface ShuttleStatusData {
  id: number;
  crowdLevel: string; // 사용자에게 enum 형식 받을 예정
  status: string; // 사용자에게 enum 형식 받을 예정
  time: string;
}

const ShuttlePage: React.FC = () => {
  const t = useI18n();
  const { openLoginModal } = useAuth();
  const navigate = useNavigate();

  // sessionStorage에서 이전 탭 및 노선 선택 불러오기
  const initialTab = (sessionStorage.getItem('shuttleCurrentTab') as ShuttleDirection) || 'TO_SCHOOL';
  const initialRoute = sessionStorage.getItem('shuttleSelectedRoute') || null;

  const [currentTab, setCurrentTabState] = useState<ShuttleDirection>(initialTab);
  const [selectedRoute, setSelectedRouteState] = useState<string | null>(initialRoute);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [currentNoticeIndex, setCurrentNoticeIndex] = useState(0);
  const [modalNoticeContent, setModalNoticeContent] = useState<string>('');
  const [touchStartX, setTouchStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [showAllShuttles, setShowAllShuttles] = useState(false);
  const [shuttleStatusData, setShuttleStatusData] = useState<Record<number, ShuttleStatusData>>({});
  const { language } = useLanguage();

  // 탭 변경 함수: 탭 상태를 업데이트하고 sessionStorage에 저장하며, 노선 선택을 초기화합니다.
  const setCurrentTab = (tab: ShuttleDirection) => {
    setCurrentTabState(tab);
    sessionStorage.setItem('shuttleCurrentTab', tab);
    setSelectedRouteState(null); // 탭 변경 시 노선 선택 초기화
    sessionStorage.removeItem('shuttleSelectedRoute'); // sessionStorage에서도 노선 초기화
  };

  // 노선 선택 함수: 노선 상태를 업데이트하고 sessionStorage에 저장합니다.
  const setSelectedRoute = (route: string | null) => {
    setSelectedRouteState(route);
    if (route) {
      sessionStorage.setItem('shuttleSelectedRoute', route);
    } else {
      sessionStorage.removeItem('shuttleSelectedRoute');
    }
  };

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

      return matchesTab && matchesRoute && isFutureTime;
    }).sort((a, b) => {
      return timeToMinutes(a.departureTime) - timeToMinutes(b.departureTime);
    });
  }, [allShuttles, currentTab, selectedRoute, currentTime]);

  // 현재 보이는 셔틀들의 ID를 가져와 API 호출
  useEffect(() => {
    const fetchShuttleStatus = async () => {
      const displayedShuttleIds = filteredShuttles.slice(0, showAllShuttles ? undefined : 3).map(shuttle => shuttle.id);

      if (displayedShuttleIds.length === 0) {
        setShuttleStatusData({});
        return;
      }

      try {
        const serverUrl = import.meta.env.VITE_SERVER_URL || ''; // 환경 변수 불러오기
        // GET 요청으로 변경: idList를 쿼리 파라미터로 전달
        const queryParams = new URLSearchParams();
        displayedShuttleIds.forEach(id => queryParams.append('idList', id.toString()));
        const url = `${serverUrl}/api/shuttles?${queryParams.toString()}`;

        const response = await fetch(url, {
          method: 'GET',
          // GET 요청에서는 Content-Type 헤더와 body가 필요 없습니다.
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: ShuttleStatusData[] = await response.json();
        const newStatusData: Record<number, ShuttleStatusData> = {};
        data.forEach(item => {
          newStatusData[item.id] = item;
        });
        setShuttleStatusData(newStatusData);
      } catch (error) {
        console.error("셔틀 현황 정보를 가져오는 데 실패했습니다:", error);
        // 오류 처리: 예를 들어, 사용자에게 메시지를 표시하거나 재시도 로직 추가
      }
    };

    fetchShuttleStatus();
  }, [filteredShuttles, showAllShuttles]); // 필터링된 셔틀 목록 또는 '더보기' 상태 변경 시 재실행

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
    <div style={{ padding: 13, paddingBottom: 80 }}>
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
            color: currentTab === 'TO_SCHOOL' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '5px 0 0 5px',
            fontSize: '1em',
            fontWeight: 'bold',
          }}
          onClick={() => setCurrentTab('TO_SCHOOL')}
        >
          {t.toSchool}
        </button>
        <button
          style={{
            flex: 1,
            padding: '10px 0',
            border: 'none',
            background: currentTab === 'FROM_SCHOOL' ? '#007bff' : '#f0f0f0',
            color: currentTab === 'FROM_SCHOOL' ? 'white' : '#333',
            cursor: 'pointer',
            borderRadius: '0 5px 5px 0',
            fontSize: '1em',
            fontWeight: 'bold',
          }}
          onClick={() => setCurrentTab('FROM_SCHOOL')}
        >
          {t.fromSchool}
        </button>
      </div>

      {/* 노선도 선택 드롭다운 */}
      <div style={{ marginBottom: '20px' }}>
        <select
          key={currentTab}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '1em',
            borderRadius: '5px',
            border: '1px solid #ccc',
          }}
          value={selectedRoute || t.allRoutes}
          onChange={(e) => setSelectedRoute(e.target.value === t.allRoutes ? null : e.target.value)}>
          <option value={t.allRoutes}>{t.allRoutes}</option>
          {availableRoutes.map(route => (
            <option key={route} value={route}>
              {route === 'BAEKSEOK' && currentTab === 'FROM_SCHOOL' 
                ? language === 'en' 
                  ? 'Baekseok (via Daegok)'
                  : '백석 (대곡 경유)'
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
          {filteredShuttles.slice(0, showAllShuttles ? undefined : 3).map((shuttle, index) => {
            const statusInfo = shuttleStatusData[shuttle.id];
            return (
              <ShuttleInfoCard
                key={shuttle.id}
                info={shuttle}
                onCardClick={handleCardClick}
                onHelpClick={handleHelpClick}
                showCountdown={!showAllShuttles && index < 3}
                crowdLevel={statusInfo?.crowdLevel}
                status={statusInfo?.status}
                updateTime={statusInfo?.time}
              />
            );
          })}
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