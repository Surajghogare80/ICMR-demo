// src/pages/Explore/components/SubpointPhotoCard.jsx
import { Card, CardActionArea, Box, Typography } from '@mui/material';
import { MenuBook } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { COLORS } from '../../../theme/index.js';

// A subtab: a real photo, the topic title, and a "Read more" affordance.
// Clicking it opens the article content for that topic.
const SubpointPhotoCard = ({ subpoint, onOpen }) => {
  const { t } = useTranslation();

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} style={{ height: '100%' }}>
      <Card elevation={0} sx={{ height: '100%', overflow: 'hidden' }}>
        <CardActionArea onClick={() => onOpen(subpoint)} sx={{ height: '100%' }}>
          <Box
            component="img"
            src={subpoint.image}
            alt={subpoint.title}
            loading="lazy"
            sx={{ width: '100%', height: { xs: 190, sm: 200, md: 210 }, objectFit: 'cover', display: 'block' }}
          />
          <Box sx={{ p: 2.5 }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>
              {subpoint.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: COLORS.secondaryDark, fontWeight: 600 }}>
              <MenuBook sx={{ fontSize: 18 }} />
              <Typography variant="body1" fontWeight={600} color="inherit">
                {t('explore.readMore')}
              </Typography>
            </Box>
          </Box>
        </CardActionArea>
      </Card>
    </motion.div>
  );
};

export default SubpointPhotoCard;
