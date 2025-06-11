import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TaxiRegistrationModal from '../../components/TaxiRegistrationModal';
import { useAuth } from '../../contexts/AuthContext';

interface TaxiArticle {
  id: number;
  route: string;
  time: string;
  direction: string;
}

const TaxiPage: React.FC = () => {
  const [articles, setArticles] = useState<TaxiArticle[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuth();

  const fetchArticles = async () => {
    console.log('Fetching taxi articles...');
    const url = `${import.meta.env.VITE_SERVER_URL}/api/articles?type=TAXI`;
    console.log('Request URL:', url);
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched articles:', data);
        setArticles(data);
      } else {
        console.error('택시팟 글 목록을 불러오는데 실패했습니다. Status:', response.status);
      }
    } catch (error) {
      console.error('택시팟 글 목록 요청 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    console.log('TaxiPage useEffect triggered.');
    fetchArticles();
  }, []);

  const handleArticleClick = (id: number) => {
    navigate(`/taxi/${id}`);
  };

  const handleRegisterSubmit = async (data: { content: string; direction: string; route: string; type: string }) => {
    console.log('Submitting taxi registration:', data);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      if (response.ok) {
        alert('택시팟이 성공적으로 등록되었습니다!');
        fetchArticles();
      } else {
        const errorData = await response.json();
        console.error('택시팟 등록 실패. Status:', response.status, errorData);
        alert(`택시팟 등록에 실패했습니다: ${errorData.message || '알 수 없는 오류'}`);
      }
    } catch (error) {
      console.error('택시팟 등록 요청 중 오류 발생:', error);
      alert('택시팟 등록 요청 중 오류가 발생했습니다.');
    }
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

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
    return routeName;
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ marginBottom: '20px', fontSize: '24px', fontWeight: 'bold' }}>택시팟</h1>
      
      <button
        onClick={() => {
          if (!isAuthenticated) {
            openLoginModal();
          } else {
            setIsModalOpen(true);
          }
        }}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginBottom: '20px',
          fontSize: '16px',
        }}
      >
        모집하기
      </button>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {articles.map((article) => (
          <div
            key={article.id}
            onClick={() => handleArticleClick(article.id)}
            style={{
              padding: '15px',
              backgroundColor: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
                {getRouteDirectionDisplay(article.route, article.direction)}
              </span>
            </div>
            <span style={{ color: '#666' }}>{formatTime(article.time)}</span>
          </div>
        ))}
      </div>
      <TaxiRegistrationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleRegisterSubmit}
      />
    </div>
  );
};

export default TaxiPage; 