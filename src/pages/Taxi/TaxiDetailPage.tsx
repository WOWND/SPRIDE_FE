import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useI18n } from '../../hooks/useI18n';

interface Comment {
  nickname: string;
  time: string;
  content: string;
}

interface TaxiArticle {
  id: number;
  route: string;
  time?: string;
  direction?: string;
  nickname: string;
  content: string;
  comments: Comment[];
}

const TaxiDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, openLoginModal } = useAuth();
  const t = useI18n();

  const [article, setArticle] = useState<TaxiArticle | null>(null);
  const [commentContent, setCommentContent] = useState<string>('');
  const [isSubmittingComment, setIsSubmittingComment] = useState<boolean>(false);

  const fetchArticleDetails = async () => {
    console.log('Fetching taxi article details for ID:', id);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/comments/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Successfully fetched article and comments:', data);
        setArticle({
          id: Number(id),
          route: data.route,
          time: data.time,
          direction: data.direction,
          nickname: data.nickname,
          content: data.content,
          comments: data.comments || [],
        });
      } else {
        console.error('택시팟 글 및 댓글을 불러오는데 실패했습니다. Status:', response.status);
        navigate('/taxi');
      }
    } catch (error) {
      console.error('택시팟 글 및 댓글 요청 중 오류 발생:', error);
      navigate('/taxi');
    }
  };

  useEffect(() => {
    if (id) {
      fetchArticleDetails();
    }
  }, [id, navigate]);

  const handleCommentSubmit = async () => {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    if (!commentContent.trim()) {
      alert(t.댓글_내용을_입력해주세요);
      return;
    }
    setIsSubmittingComment(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL}/api/comments/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ content: commentContent }),
      });

      if (response.ok) {
        setCommentContent('');
        fetchArticleDetails();
      } else {
        const errorData = await response.json();
        console.error('댓글 등록 실패. Status:', response.status, errorData);
        alert(`댓글 등록에 실패했습니다: ${errorData.message || t.알_수_없는_오류}`);
      }
    } catch (error) {
      console.error('댓글 등록 요청 중 오류 발생:', error);
      alert(t.댓글_등록_요청_중_오류_발생);
    } finally {
      setIsSubmittingComment(false);
    }
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

  const formatTime = (timeString: string | undefined | null) => {
    if (!timeString) {
      return 'N/A';
    }
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  if (!article) {
    return <div>{t.로딩_중}</div>;
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
          ← {t.목록으로}
        </button>
      </div>

      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          marginBottom: '20px',
        }}
      >
        <h1 style={{ fontSize: '24px', marginBottom: '10px' }}>
          {getRouteDirectionDisplay(article.route, article.direction || '')}
        </h1>
        <div style={{ color: '#666', fontSize: '14px', marginBottom: '15px' }}>
          {article.nickname} | {formatTime(article.time)}
        </div>
        <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{article.content}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '15px' }}>{t.댓글} ({article.comments.length})</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {article.comments.length === 0 ? (
            <p style={{ color: '#999' }}>{t.아직_댓글이_없습니다}</p>
          ) : (
            article.comments.map((comment, index) => (
              <div
                key={index}
                style={{
                  padding: '10px 15px',
                  backgroundColor: '#f9f9f9',
                  borderRadius: '5px',
                  border: '1px solid #eee',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <span style={{ fontWeight: 'bold' }}>{comment.nickname}</span>
                  <span style={{ color: '#888', fontSize: '12px' }}>{formatTime(comment.time)}</span>
                </div>
                <p style={{ fontSize: '14px' }}>{comment.content}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 style={{ fontSize: '20px', marginBottom: '10px' }}>{t.댓글_작성}</h2>
        <textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          placeholder={t.댓글을_입력하세요}
          rows={3}
          style={{
            width: '100%',
            padding: '10px',
            borderRadius: '5px',
            border: '1px solid #ccc',
            resize: 'vertical',
            marginBottom: '10px',
          }}
        ></textarea>
        <button
          onClick={handleCommentSubmit}
          disabled={isSubmittingComment}
          style={{
            padding: '10px 20px',
            backgroundColor: isSubmittingComment ? '#cccccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: isSubmittingComment ? 'not-allowed' : 'pointer',
            fontSize: '16px',
          }}
        >
          {isSubmittingComment ? t.등록_중 : t.등록}
        </button>
      </div>
    </div>
  );
};

export default TaxiDetailPage; 