import ko from '../locales/ko';
import en from '../locales/en';
import { useLanguage } from '../contexts/LanguageContext';

const resources = { ko, en };

export function useI18n() {
  const { language } = useLanguage();
  // 현재 활성 언어의 리소스 객체를 반환합니다.
  // 타입 추론을 위해 리소스 객체 중 하나를 기반으로 타입을 정의합니다.
  return resources[language] as typeof resources['ko'];
} 