// src/components/common/LanguageSelector.jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton, Menu, MenuItem, ListItemText, Tooltip } from '@mui/material';
import { Translate } from '@mui/icons-material';
import { changeLanguage, SUPPORTED_LANGUAGES } from '../../i18n.js';

const LANGUAGE_LABEL_KEYS = {
  en: 'language.english',
  hi: 'language.hindi',
  mr: 'language.marathi',
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

  return (
    <>
      <Tooltip title={t('language.select_language')}>
        <IconButton
          size="small"
          onClick={(e) => setAnchorEl(e.currentTarget)}
          aria-label={t('language.select_language')}
        >
          <Translate fontSize="small" />
        </IconButton>
      </Tooltip>
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
            selected={i18n.language === lang}
            onClick={() => handleSelect(lang)}
          >
            <ListItemText>{t(LANGUAGE_LABEL_KEYS[lang])}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LanguageSelector;
