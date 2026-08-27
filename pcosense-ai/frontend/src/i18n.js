// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Every page/feature keeps its own translation fragment file under
// locales/fragments/ so different areas of the app can be maintained
// independently. They are discovered automatically (Vite's import.meta.glob)
// rather than hand-listed here, so adding a new fragment file needs no
// change to this file — and combined into a single flat "translation"
// namespace per language.
import core from './locales/core.json';

const fragmentModules = import.meta.glob('./locales/fragments/*.json', { eager: true });
const fragments = [core, ...Object.values(fragmentModules).map((mod) => mod.default)];

export const SUPPORTED_LANGUAGES = ['en', 'hi', 'mr'];
export const STORAGE_KEY = 'prabha_language';

const resources = SUPPORTED_LANGUAGES.reduce((acc, lng) => {
  acc[lng] = {
    translation: fragments.reduce((merged, fragment) => Object.assign(merged, fragment[lng]), {}),
  };
  return acc;
}, {});

i18n
  // Official i18next plugin for detecting/persisting the active language:
  // checks localStorage first (so a saved choice always wins), falls back to
  // the browser's own language, then to <html lang>. Writes back to
  // localStorage automatically on every i18n.changeLanguage() call.
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: SUPPORTED_LANGUAGES,
    // Normalizes locale variants (e.g. browser-reported "en-GB", "hi-IN")
    // down to their base language code so they match our supported list.
    load: 'languageOnly',
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage'],
    },
    interpolation: {
      escapeValue: false,
    },
    returnEmptyString: false,
    saveMissing: import.meta.env.DEV,
    missingKeyHandler: import.meta.env.DEV
      ? (lngs, _ns, key) => {
          // eslint-disable-next-line no-console
          console.warn(`[i18n] Missing translation key "${key}" for language(s): ${lngs.join(', ')}`);
        }
      : undefined,
  });

export const changeLanguage = (lang) => {
  if (!SUPPORTED_LANGUAGES.includes(lang)) return;
  // The LanguageDetector's localStorage cache persists this automatically.
  i18n.changeLanguage(lang);
};

export default i18n;
