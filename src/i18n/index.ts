import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import vi from './locales/vi.json';
import zhTW from './locales/zh-TW.json';

i18n.use(initReactI18next).init({
  resources: {
    vi: { translation: vi },
    'zh-TW': { translation: zhTW },
  },
  lng: 'vi',
  fallbackLng: 'vi',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
