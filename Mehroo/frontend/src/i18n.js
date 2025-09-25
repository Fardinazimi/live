import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import de from './locales/de.json';
import fa from './locales/fa.json';

i18n
  .use(LanguageDetector) // auto-detect user language
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      de: { translation: de },
      fa: { translation: fa }
    },
    fallbackLng: 'en', // default language
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
