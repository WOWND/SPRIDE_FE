import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ShuttleSelectPage: React.FC = () => {
  const { t } = useTranslation();
  const [info, setInfo] = useState({
    shuttleDirection: 'TO_SCHOOL',
    routeName: 'BAEKSEOK'
  });
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    // This is a placeholder for the useEffect. You might want to fetch data here
  }, []);

  return (
    <div style={{ 
      fontSize: 16, 
      color: '#666',
      marginBottom: 12,
      padding: '8px 0',
      borderBottom: '1px solid #ccc'
    }}>
      {info.shuttleDirection === 'TO_SCHOOL' ? (
        `${t[info.routeName.toLowerCase()]} → ${language === 'en' ? 'Joongbu University' : '중부대학교'}`
      ) : (
        `${language === 'en' ? 'Joongbu University' : '중부대학교'} → ${
          info.routeName === 'BAEKSEOK' 
            ? language === 'en' 
              ? 'Baekseok (via Daegok)'
              : '백석(대곡 경유)'
            : t[info.routeName.toLowerCase()]
        }`
      )}
    </div>
  );
};

export default ShuttleSelectPage; 