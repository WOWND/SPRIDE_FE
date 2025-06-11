import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

interface TaxiArticle {
  id: number;
  route: string;
  time: string;
  direction: string;
  // 필요한 경우 추가 필드를 여기에 정의
}

const TaxiDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<TaxiArticle | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      console.log('Fetching taxi article details for ID:', id);
      try {
        const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/articles/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Successfully fetched article:', data);
          setArticle(data);
        } else {
          console.error('택시팟 글을 불러오는데 실패했습니다. Status:', response.status);
          navigate('/taxi'); // 실패 시 목록으로 돌아가기
        }
      } catch (error) {
        console.error('택시팟 글 요청 중 오류 발생:', error);
        navigate('/taxi');
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id, navigate]);

  const getRouteDirectionDisplay = (route: string, direction: string) => {
    const routeMap: { [key: string]: string } = {
      'BAEKSEOK': '백석',
      'SAMSUNG': '삼송',
      'SAMSUNG_VIA_WONHEUNG': '삼송(원흥경유)',
    };
    const routeName = routeMap[route] || route;

    if (direction === 'TO_SCHOOL') {
      return `${routeName} → 학교`;
    } else if (direction === 'FROM_SCHOOL') {
      return `학교 → ${routeName}`;
    }
    return routeName; // 기본값
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (!article) {
    return <div>로딩 중...</div>;
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/taxi')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#f0f0f0',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          ← 목록으로
        </button>
      </div>

      <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>
          {getRouteDirectionDisplay(article.route, article.direction)}
        </h1>
        <div style={{ color: '#666', marginBottom: '20px' }}>
          출발 시간: {formatTime(article.time)}
        </div>
        {/* 필요한 경우 추가 정보를 여기에 표시 */}
      </div>
    </div>
  );
};

export default TaxiDetailPage; 