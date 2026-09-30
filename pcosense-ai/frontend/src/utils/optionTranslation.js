// src/utils/optionTranslation.js
// Single source of truth for turning a stored/canonical option or enum value
// (e.g. "High Risk", "Irregular", "Very Heavy") into its translated display
// label, without ever touching the underlying value itself. The slug always
// uses underscores ("high_risk") to match the convention used across every
// options.*/riskLevels/status/results translation key in the locale files.
export const slugifyOptionValue = (value) => {
  if (value === undefined || value === null || value === '') return '';
  return String(value).toLowerCase().replace(/\s+/g, '_');
};

// namespace is the i18next key prefix under which the slugged value lives,
// e.g. "options.cycleRegularity", "predictionResult.riskLevels",
// "dashboard.healthSummary.status", "admin.results".
export const translateOptionValue = (t, namespace, value) => {
  if (value === undefined || value === null || value === '') return value;
  return t(`${namespace}.${slugifyOptionValue(value)}`, { defaultValue: value });
};
