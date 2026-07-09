// src/pages/Dashboard/components/AwarenessSection.jsx
import { useState } from 'react';
import {
  Box, Typography, Grid, Chip, useTheme, alpha, Collapse,
} from '@mui/material';
import {
  Info, Warning, PsychologyAlt, LocalHospital,
  SelfImprovement, MedicalServices, ExpandMore,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const AWARENESS_CARDS = [
  {
    emoji: '🔬',
    icon: <Info sx={{ fontSize: 28 }} />,
    title: 'What is PCOS?',
    category: 'Basics',
    categoryColor: '#EC407A',
    summary: 'Polycystic Ovary Syndrome (PCOS) is a common hormonal disorder affecting 1 in 10 women of reproductive age.',
    detail: 'PCOS affects the ovaries and ovulation. The three main features are: cysts in the ovaries, high levels of male hormones (androgens), and irregular or skipped periods. Not all women with PCOS will have cysts on their ovaries.',
    accentColor: '#EC407A',
  },
  {
    emoji: '🩺',
    icon: <Warning sx={{ fontSize: 28 }} />,
    title: 'Common Symptoms',
    category: 'Symptoms',
    categoryColor: '#FFA726',
    summary: 'PCOS symptoms can vary widely. Recognizing them early leads to better management and quality of life.',
    detail: 'Irregular periods, excess androgen (elevated male hormone levels), polycystic ovaries, weight gain, acne, thinning hair, excess facial/body hair, and skin darkening are all common signs. Many women have no symptoms at all.',
    accentColor: '#FFA726',
  },
  {
    emoji: '💡',
    icon: <PsychologyAlt sx={{ fontSize: 28 }} />,
    title: 'Common Myths',
    category: 'Education',
    categoryColor: '#7E57C2',
    summary: "Many misconceptions surround PCOS. Let's debunk the most common ones to empower better decisions.",
    detail: 'Myth: You must have cysts to have PCOS. Fact: The name is misleading — many women with PCOS never develop cysts. Myth: PCOS means you cannot get pregnant. Fact: Most women with PCOS can conceive with the right treatment.',
    accentColor: '#7E57C2',
  },
  {
    emoji: '💊',
    icon: <LocalHospital sx={{ fontSize: 28 }} />,
    title: 'Treatment Options',
    category: 'Treatment',
    categoryColor: '#66BB6A',
    summary: 'PCOS has no cure, but symptoms can be managed effectively through lifestyle changes and medical treatments.',
    detail: 'Options include lifestyle modifications (diet, exercise), hormonal birth control to regulate periods, medications like Metformin to improve insulin resistance, anti-androgen medications, and fertility treatments if needed. Always consult a gynecologist.',
    accentColor: '#66BB6A',
  },
  {
    emoji: '🥗',
    icon: <SelfImprovement sx={{ fontSize: 28 }} />,
    title: 'Healthy Lifestyle',
    category: 'Wellness',
    categoryColor: '#26C6DA',
    summary: 'Lifestyle plays a powerful role in managing PCOS. Small daily changes can lead to significant improvements.',
    detail: 'A balanced diet rich in fiber, lean protein, and healthy fats helps manage insulin levels. Regular physical activity (30 minutes most days) reduces androgen levels and improves insulin sensitivity. Stress management through yoga, mindfulness, and adequate sleep (7–8 hours) also significantly reduces symptoms.',
    accentColor: '#26C6DA',
  },
  {
    emoji: '🏥',
    icon: <MedicalServices sx={{ fontSize: 28 }} />,
    title: 'When to See a Doctor',
    category: 'Medical',
    categoryColor: '#F06292',
    summary: 'Know when to seek professional medical advice. Early consultation leads to better health outcomes.',
    detail: 'See a doctor if you experience: irregular or missed periods for several months, symptoms of high androgen levels (excess hair growth, acne, male-pattern baldness), difficulty getting pregnant, or weight gain without an obvious cause. A gynecologist or endocrinologist can provide proper diagnosis and treatment.',
    accentColor: '#F06292',
  },
];

const AwarenessCard = ({ card, index }) => {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      style={{ height: '100%' }}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        style={{ height: '100%' }}
      >
        <Box
          sx={{
            height: '100%',
            borderRadius: 4,
            p: 3,
            background: isDark ? alpha(theme.palette.background.paper, 0.6) : '#FFFFFF',
            border: `1px solid ${alpha(card.accentColor, isDark ? 0.2 : 0.1)}`,
            boxShadow: isDark
              ? `0 4px 20px ${alpha('#000', 0.3)}`
              : `0 4px 20px ${alpha(card.accentColor, 0.06)}`,
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top accent line */}
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: `linear-gradient(90deg, ${card.accentColor}, ${alpha(card.accentColor, 0.4)})`,
            }}
          />

          {/* Icon area */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2, mt: 0.5 }}>
            <Box
              sx={{
                width: 52,
                height: 52,
                borderRadius: 3,
                bgcolor: alpha(card.accentColor, isDark ? 0.2 : 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: card.accentColor,
                flexShrink: 0,
              }}
            >
              {card.icon}
            </Box>
            <Box>
              <Chip
                label={card.category}
                size="small"
                sx={{
                  mb: 0.5,
                  bgcolor: alpha(card.accentColor, 0.12),
                  color: card.accentColor,
                  fontWeight: 700,
                  fontSize: '0.68rem',
                  height: 20,
                }}
              />
              <Typography variant="subtitle1" fontWeight={700} lineHeight={1.3}>
                {card.emoji} {card.title}
              </Typography>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" lineHeight={1.7} sx={{ flexGrow: 1, mb: 2 }}>
            {card.summary}
          </Typography>

          <Collapse in={expanded}>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                lineHeight: 1.8,
                mt: 1,
                mb: 2,
                p: 2,
                bgcolor: alpha(card.accentColor, isDark ? 0.1 : 0.05),
                borderRadius: 2,
                borderLeft: `3px solid ${card.accentColor}`,
                fontSize: '0.82rem',
              }}
            >
              {card.detail}
            </Typography>
          </Collapse>

          <Box
            onClick={() => setExpanded((e) => !e)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              color: card.accentColor,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.82rem',
              '&:hover': { opacity: 0.8 },
            }}
            role="button"
            aria-expanded={expanded}
            aria-label={expanded ? 'Show less' : 'Read more'}
          >
            {expanded ? 'Show Less' : 'Read More'}
            <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <ExpandMore sx={{ fontSize: 18 }} />
            </motion.div>
          </Box>
        </Box>
      </motion.div>
    </motion.div>
  );
};

const AwarenessSection = () => (
  <Box sx={{ mb: 5 }}>
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
        <Typography variant="h5" fontWeight={800}>PCOS Awareness</Typography>
        <Chip label="Educational" size="small" sx={{ bgcolor: 'rgba(233,30,99,0.1)', color: '#EC407A', fontWeight: 700, fontSize: '0.7rem' }} />
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Learn about PCOS — knowledge is your first step toward better health
      </Typography>
    </motion.div>
    <Grid container spacing={2.5}>
      {AWARENESS_CARDS.map((card, i) => (
        <Grid item xs={12} sm={6} md={4} key={card.title}>
          <AwarenessCard card={card} index={i} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default AwarenessSection;
