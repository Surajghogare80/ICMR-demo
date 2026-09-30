// src/utils/localeFormat.js
// Locale-aware date/number formatting helpers built on the native Intl APIs,
// so we never hand-assemble language-specific date strings inside components.

const INTL_LOCALE_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  mr: 'mr-IN',
};

export const toIntlLocale = (lang) => INTL_LOCALE_MAP[lang] || INTL_LOCALE_MAP.en;

export const formatLocalizedDate = (date, lang, options = { day: 'numeric', month: 'long', year: 'numeric' }) => {
  const parsed = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(parsed.getTime())) return '';
  try {
    return new Intl.DateTimeFormat(toIntlLocale(lang), options).format(parsed);
  } catch {
    return new Intl.DateTimeFormat(INTL_LOCALE_MAP.en, options).format(parsed);
  }
};

export const formatLocalizedDateTime = (date, lang) =>
  formatLocalizedDate(date, lang, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  });

export const formatLocalizedNumber = (value, lang, options) => {
  try {
    return new Intl.NumberFormat(toIntlLocale(lang), options).format(value);
  } catch {
    return new Intl.NumberFormat(INTL_LOCALE_MAP.en, options).format(value);
  }
};
