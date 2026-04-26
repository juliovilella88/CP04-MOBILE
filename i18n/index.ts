import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import en from '../locales/en';
import pt from '../locales/pt';

export const LANGUAGE_STORAGE_KEY = '@app_language';

const deviceLanguage = getLocales()?.[0]?.languageCode?.startsWith('pt') ? 'pt' : 'en';

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  resources: {
    pt,
    en,
  },
  lng: deviceLanguage,
  fallbackLng: 'pt',
  interpolation: {
    escapeValue: false,
  },
});

export async function loadSavedLanguage() {
  const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (savedLanguage && savedLanguage !== i18n.language) {
    await i18n.changeLanguage(savedLanguage);
  }
}

export async function changeAppLanguage(language: 'pt' | 'en') {
  await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  await i18n.changeLanguage(language);
}

export default i18n;
