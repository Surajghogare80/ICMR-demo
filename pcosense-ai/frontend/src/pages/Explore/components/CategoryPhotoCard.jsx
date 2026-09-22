// src/pages/Explore/components/CategoryPhotoCard.jsx
import { Card, CardActionArea, Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import ExploreIcon from '../ExploreIcon.jsx';
import { COLORS } from '../../../theme/index.js';

// A main "tab": a real photo with a small icon+label pill overlaid on its
// bottom-left corner. Clicking it opens the category's subtabs.
const CategoryPhotoCard = ({ category, onClick }) => (
  <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} style={{ height: '100%' }}>
    <Card elevation={0} sx={{ height: '100%', overflow: 'hidden' }}>
      <CardActionArea onClick={() => onClick(category.id)} sx={{ height: '100%' }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={category.coverImage}
            alt={category.title}
            loading="lazy"
            sx={{ width: '100%', height: { xs: 240, sm: 260, md: 280 }, objectFit: 'cover', display: 'block' }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              bgcolor: 'background.paper',
              borderRadius: 999,
              py: 1.5,
              px: 2.25,
              boxShadow: '0 6px 18px rgba(0,0,0,0.25)',
            }}
          >
            <ExploreIcon name={category.icon} sx={{ fontSize: 22, color: COLORS.secondaryDark, flexShrink: 0 }} />
            <Typography variant="subtitle1" fontWeight={700} noWrap>
              {category.title}
            </Typography>
          </Box>
        </Box>
      </CardActionArea>
    </Card>
  </motion.div>
);

export default CategoryPhotoCard;
