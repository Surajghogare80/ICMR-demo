// src/pages/Explore/components/SubpointArticleDialog.jsx
import { Dialog, DialogContent, Box, Typography, IconButton } from '@mui/material';
import { Close } from '@mui/icons-material';
import { COLORS } from '../../../theme/index.js';

const SubpointArticleDialog = ({ subpoint, open, onClose }) => {
  if (!subpoint) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <Box sx={{ position: 'relative' }}>
        <Box
          component="img"
          src={subpoint.image}
          alt={subpoint.title}
          sx={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }}
        />
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ position: 'absolute', top: 10, right: 10, color: COLORS.white, bgcolor: 'rgba(0,0,0,0.35)', '&:hover': { bgcolor: 'rgba(0,0,0,0.5)' } }}
        >
          <Close />
        </IconButton>
      </Box>

      <DialogContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={700} gutterBottom>
          {subpoint.title}
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          {subpoint.article}
        </Typography>
      </DialogContent>
    </Dialog>
  );
};

export default SubpointArticleDialog;
