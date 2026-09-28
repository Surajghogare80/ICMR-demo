// src/pages/Prediction/PredictionReport.jsx
// Print-only copy of the "Your Screening Result" screen. It is portalled into <body>,
// hidden on screen, and is the only thing visible when the browser prints — so
// "Save as PDF" yields the report in any language the browser can render
// (no PDF library or font embedding needed).
import { createPortal } from 'react-dom';
import { GlobalStyles } from '@mui/material';
import { useTranslation } from 'react-i18next';

const REPORT_ID = 'pmos-print-report';

// accent = ring/badge colour, dark = text, bg = card fill, border = card/pill outline
const PALETTE = {
  low:      { accent: '#22C55E', dark: '#166534', bg: '#F0FDF4', border: '#86EFAC', ring: '#BBF7D0', ringOuter: '#DCFCE7' },
  moderate: { accent: '#EAB308', dark: '#854D0E', bg: '#FEFCE8', border: '#FDE047', ring: '#FEF08A', ringOuter: '#FEF9C3' },
  detected: { accent: '#F97316', dark: '#9A3412', bg: '#FFF7ED', border: '#FDBA74', ring: '#FED7AA', ringOuter: '#FFEDD5' },
  high:     { accent: '#EF4444', dark: '#991B1B', bg: '#FEF2F2', border: '#FCA5A5', ring: '#FECACA', ringOuter: '#FEE2E2' },
};

const StatusIcon = ({ p, severe }) => (
  <svg width="180" height="180" viewBox="0 0 180 180" role="img" aria-hidden="true">
    <circle cx="90" cy="90" r="88" fill={p.ringOuter} />
    <circle cx="90" cy="90" r="68" fill={p.ring} />
    <circle cx="90" cy="90" r="46" fill={p.accent} />
    <circle cx="90" cy="90" r="19" fill="none" stroke="#fff" strokeWidth="4" />
    {severe
      ? <path d="M90 80v12M90 98v1" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" />
      : <path d="M81 90.5l6.5 6.5L99.5 84" fill="none" stroke="#fff" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />}
  </svg>
);

const PredictionReport = ({ result, band }) => {
  const { t } = useTranslation();
  const p = PALETTE[band.key] || PALETTE.low;
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
          <StatusIcon p={p} severe={band.severe} />
          <div style={{ fontSize: 52, fontWeight: 800, color: p.dark, lineHeight: 1.1 }}>{result.probability}%</div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{t('predictionResult.report.probabilityLabel')}</div>

          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10, marginTop: 22, padding: '10px 26px',
            borderRadius: 999, background: p.ringOuter, border: `2px solid ${p.border}`,
            fontSize: 18, fontWeight: 700, color: p.dark,
          }}>
            <span style={{ width: 14, height: 14, borderRadius: '50%', background: p.accent, display: 'inline-block' }} />
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
                  flex: '0 0 22px', width: 22, height: 22, borderRadius: '50%', background: p.accent, color: '#fff',
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
