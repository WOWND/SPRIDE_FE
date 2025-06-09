import ko from '../locales/ko';
import en from '../locales/en';
import { useLanguage } from '../contexts/LanguageContext';
import { TranslationKeys } from '../types/i18n';

const resources = { ko, en };

export function useI18n() {
  const { language } = useLanguage();
  // 현재 활성 언어의 리소스 객체를 반환합니다.
  // 타입 추론을 위해 정의된 TranslationKeys를 사용합니다.
  return resources[language] as TranslationKeys;
} 