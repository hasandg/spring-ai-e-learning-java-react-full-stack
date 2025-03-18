import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en';
import tr from './locales/tr';

export const resources = {
  en: {
    translation: en,
  },
  tr: {
    translation: tr,
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: 'en', // default language
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // react already safes from xss
  },
  detection: {
    order: ['localStorage', 'navigator'],
    caches: ['localStorage'],
  },
});

export default i18n; 