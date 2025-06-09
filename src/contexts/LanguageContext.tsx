import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Language = 'ko' | 'en';

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const getDefaultLanguage = (): Language => {
    const stored = localStorage.getItem('lang');
    if (stored === 'ko' || stored === 'en') return stored;
    const navLang = navigator.language.toLowerCase();
    if (navLang.startsWith('ko')) return 'ko';
    if (navLang.startsWith('en')) return 'en';
    return 'en'; // 기본값
  };

  const [language, setLanguageState] = useState<Language>(getDefaultLanguage());

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('lang', lang);
  };

  useEffect(() => {
    // 추후 localStorage 등에서 불러오도록 확장 가능
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}; 