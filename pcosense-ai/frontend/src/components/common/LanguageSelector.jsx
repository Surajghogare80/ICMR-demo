// src/components/common/LanguageSelector.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Menu, MenuItem, ListItemText } from '@mui/material';
import { Translate, KeyboardArrowDown } from '@mui/icons-material';
import { changeLanguage, SUPPORTED_LANGUAGES } from '../../i18n.js';

// Each language's name is shown in its own native script regardless of the
// currently active UI language (the standard pattern - a Bengali speaker
// recognizes "বাংলা" instantly; retranslating "Bengali" into whichever
// language happens to be active would be both harder to maintain and less
// recognizable to the reader).
const NATIVE_LANGUAGE_NAMES = {
  en: 'English',
  hi: 'हिन्दी',
  mr: 'मराठी',
  bn: 'বাংলা',
  te: 'తెలుగు',
  ta: 'தமிழ்',
  gu: 'ગુજરાતી',
  kn: 'ಕನ್ನಡ',
  or: 'ଓଡ଼ିଆ',
  pa: 'ਪੰਜਾਬੀ',
  ml: 'മലയാളം',
  ur: 'اردو',
  as: 'অসমীয়া',
};

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleSelect = (lang) => {
    setAnchorEl(null);
    if (lang !== i18n.language) {
      changeLanguage(lang);
    }
  };

  // i18n.language can report a region-qualified tag from browser detection
  // (e.g. "en-GB", "hi-IN") even though only the base code is ever actually
  // selectable here, so normalize before looking up the display name.
  const baseLanguage = i18n.language?.split('-')[0].toLowerCase();
  const currentLanguageName = NATIVE_LANGUAGE_NAMES[baseLanguage] || i18n.language;

  return (
    <>
      <Button
        size="small"
        startIcon={<Translate fontSize="small" />}
        endIcon={<KeyboardArrowDown fontSize="small" />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        aria-label={t('language.select_language')}
      >
        {currentLanguageName}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 160 } }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {SUPPORTED_LANGUAGES.map((lang) => (
          <MenuItem
            key={lang}
            selected={baseLanguage === lang}
            onClick={() => handleSelect(lang)}
          >
            <ListItemText>{NATIVE_LANGUAGE_NAMES[lang] || lang}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
