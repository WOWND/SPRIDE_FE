import ko from '../locales/ko';
import en from '../locales/en';
import { useLanguage } from '../contexts/LanguageContext';

const resources = { ko, en };

export function useI18n() {
  const { language } = useLanguage();
  return resources[language];
} 