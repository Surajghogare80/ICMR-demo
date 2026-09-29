// src/pages/Prediction/PredictionReport.jsx
// Print-only copy of the "Your Screening Result" screen. It is portalled into <body>,
// hidden on screen, and is the only thing visible when the browser prints — so
// "Save as PDF" yields the report in any language the browser can render
// (no PDF library or font embedding needed).
import { createPortal } from 'react-dom';
import { GlobalStyles } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { RISK_BANDS } from '../../theme/index.js';

const REPORT_ID = 'pmos-print-report';

// Each risk band renders its own icon glyph inside the badge — not just its own
// color — so the printed report stays legible for colorblind readers too.
// Shares the same colorblind-safe hues as the live result screen (RISK_BANDS).
const ICON_GLYPHS = {
  // check mark — low
  check: <path d="M75 91l10 10 20-22" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />,
  // "i" dot + stem — moderate
  info: (
    <>
      <circle cx="90" cy="70" r="4.5" fill="#fff" />
      <path d="M90 83v22" stroke="#fff" strokeWidth="6" strokeLinecap="round" />
    </>
  ),
  // exclamation mark — detected
  warning: <path d="M90 68v26M90 104v1.5" stroke="#fff" strokeWidth="6" strokeLinecap="round" />,
  // X mark — high
  cancel: <path d="M79 79l22 22M101 79l-22 22" stroke="#fff" strokeWidth="6" strokeLinecap="round" />,
};

const StatusIcon = ({ p, icon }) => (
  <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-hidden="true">
    <circle cx="90" cy="90" r="88" fill={p.ringOuter} />
    <circle cx="90" cy="90" r="68" fill={p.ring} />
    <circle cx="90" cy="90" r="46" fill={p.color} />
    {ICON_GLYPHS[icon] || ICON_GLYPHS.check}
  </svg>
);

const PredictionReport = ({ result, band }) => {
  const { t } = useTranslation();
  const p = RISK_BANDS[band.key] || RISK_BANDS.low;
  const recommendations = Array.isArray(result.recommendation) ? result.recommendation : [];

  return createPortal(
    <>
      <GlobalStyles styles={{
        [`#${REPORT_ID}`]: { display: 'none' },
        '@media print': {
          '#root': { display: 'none !important' },
          [`#${REPORT_ID}`]: { display: 'block !important' },
          // Zero page margin stops the browser printing its own header/footer (page title, URL, date);
          // the report supplies its own padding instead.
          '@page': { margin: 0 },
          body: { background: '#fff !important', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact' },
        },
      }} />
      <div
        id={REPORT_ID}
        style={{
          fontFamily: 'Inter, Arial, "Noto Sans", sans-serif', color: '#1f2937', lineHeight: 1.5,
          maxWidth: 560, margin: '0 auto', padding: '14mm 0', boxSizing: 'content-box', WebkitPrintColorAdjust: 'exact', printColorAdjust: 'exact',
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 800, textAlign: 'center', margin: 0, color: '#111827' }}>
          {t('predictionResult.report.title')}
        </h1>
        <p style={{ fontSize: 12, textAlign: 'center', color: '#9ca3af', margin: '6px 0 22px' }}>
          {t('predictionResult.report.subtitle')}
        </p>

        {/* Result card */}
        <div style={{ background: p.bg, border: `2px solid ${p.border}`, borderRadius: 20, padding: '28px 24px', textAlign: 'center', breakInside: 'avoid' }}>
          <StatusIcon p={p} icon={p.icon} />
          <div style={{ fontSize: 52, fontWeight: 800, color: p.dark, lineHeight: 1.1 }}>{result.probability}%</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{t('predictionResult.report.probabilityLabel')}</div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 22, padding: '10px 26px',
            borderRadius: 999, background: p.ringOuter, border: `2px solid ${p.border}`,
            fontSize: 18, fontWeight: 700, color: p.dark,
          }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: p.color, display: 'inline-block' }} />
            {t(`predictionResult.report.bands.${band.key}.pill`)}
          </div>

          <p style={{ fontSize: 14, color: '#374151', margin: '18px 12px 0' }}>
            {t(`predictionResult.report.bands.${band.key}.text`)}
          </p>

        </div>

        {/* What to do next */}
        {recommendations.length > 0 && (
          <div style={{ background: p.bg, border: `1px solid ${p.border}`, borderRadius: 16, padding: '18px 22px', marginTop: 22 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: p.dark, marginBottom: 12 }}>
              {t('predictionResult.report.whatToDoNext')}
            </div>
            {recommendations.map((rec, i) => (
              <div key={i} style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 12, breakInside: 'avoid' }}>
                <span style={{
                  flex: '0 0 22px', width: 22, height: 22, borderRadius: '50%', background: p.color, color: '#fff',
                  fontSize: 12, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{i + 1}</span>
                <span style={{ fontSize: 13.5, color: '#374151' }}>{rec}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </>,
    document.body,
  );
};

/** Opens the browser print dialog (choose "Save as PDF") with a meaningful default file name. */
export const printReport = (fileName) => {
  const previousTitle = document.title;
  const restore = () => { document.title = previousTitle; window.removeEventListener('afterprint', restore); };
  window.addEventListener('afterprint', restore);
  document.title = fileName;
  window.print();
};

export default PredictionReport;
