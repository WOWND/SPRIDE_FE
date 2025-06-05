import React, { useState, useRef, useEffect } from 'react';
import { useLanguage, Language } from '../../contexts/LanguageContext';

interface LanguageSelectorProps {
  size?: number;
}

const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'ko', label: '한국어' },
  { code: 'en', label: 'English' },
];

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ size = 28 }) => {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        style={{
          borderRadius: '50%',
          border: 'none',
          background: '#eee',
          padding: 8,
          cursor: 'pointer',
          width: size,
          height: size,
          fontSize: size * 0.7,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onClick={() => setOpen((v) => !v)}
      >
        🌐
      </button>
      {open && (
        <div
          style={{
            position: 'absolute',
            top: size + 8,
            right: 0,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            zIndex: 1000,
            minWidth: 100,
            padding: 4,
          }}
        >
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              style={{
                width: '100%',
                padding: '8px 0',
                background: language === lang.code ? '#b2ebf2' : 'transparent',
                color: language === lang.code ? '#222' : '#555',
                fontWeight: language === lang.code ? 700 : 400,
                border: 'none',
                borderRadius: 6,
                cursor: 'pointer',
                fontSize: 16,
                marginBottom: 2,
              }}
              disabled={language === lang.code}
            >
              {lang.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSelector; 