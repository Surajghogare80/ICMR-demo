import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Breadcrumbs,
  Link,
  Divider,
  Stack,
  Chip,
  useTheme,
} from '@mui/material';
import {
  Bookmark,
  BookmarkBorder,
  ShareOutlined,
  Search,
  ArrowBack,
  MenuBook,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import { EXPLORE_CATEGORIES } from './exploreData.js';
import { COLORS } from '../../theme/index.js';
import { ROUTES } from '../../constants/index.js';

const BOOKMARKS_KEY = 'pcosense_explore_bookmarks';

const readBookmarks = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(BOOKMARKS_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

const ExploreArticlePage = () => {
  const { categoryId, articleId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { t } = useTranslation();
  const [bookmarked, setBookmarked] = useState(false);

  const category = useMemo(() => {
    return EXPLORE_CATEGORIES.find((c) => c.id === categoryId);
  }, [categoryId]);

  const article = useMemo(() => {
    return category?.subpoints.find((s) => s.id === articleId);
  }, [category, articleId]);

  const bookmarkKey = `${categoryId}/${articleId}`;

  useEffect(() => {
    setBookmarked(readBookmarks().includes(bookmarkKey));
  }, [bookmarkKey]);

  const relatedSubpoints = useMemo(() => {
    if (!category) return [];
    return category.subpoints.filter((s) => s.id !== articleId).slice(0, 3);
  }, [category, articleId]);

  if (!category || !article) {
    return (
      <Container sx={{ py: 10, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>
          {t('explore.article.notFoundTitle')}
        </Typography>
        <Button variant="contained" onClick={() => navigate(ROUTES.EXPLORE)}>
          {t('explore.article.backToExplore')}
        </Button>
      </Container>
    );
  }

  // Calculate a rough read time based on word count (approx 200 words per minute)
  const wordCount = article.article ? article.article.split(/\s+/).length : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleBookmarkToggle = () => {
    const stored = readBookmarks();
    const isBookmarked = stored.includes(bookmarkKey);
    const next = isBookmarked ? stored.filter((k) => k !== bookmarkKey) : [...stored, bookmarkKey];
    try {
      localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(next));
    } catch {
      // localStorage unavailable (e.g. private browsing) - state still updates for this session
    }
    setBookmarked(!isBookmarked);
    toast.success(isBookmarked ? t('explore.article.bookmarkRemoved') : t('explore.article.bookmarkAdded'));
  };

  const handleShare = async () => {
    const shareData = {
      title: article.title,
      text: category.title,
      url: window.location.href,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err?.name !== 'AbortError') toast.error(t('explore.article.shareFailed'));
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success(t('explore.article.linkCopied'));
    } catch {
      toast.error(t('explore.article.shareFailed'));
    }
  };

  const goToCategory = () => navigate(ROUTES.EXPLORE, { state: { categoryId: category.id } });

  return (
    <Box sx={{ pb: 10, pt: 4, minHeight: '100vh' }}>
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* LEFT SIDEBAR */}
          <Grid item xs={12} md={3} lg={3}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 3 }}>
                <Link
                  component={RouterLink}
                  to={ROUTES.EXPLORE}
                  underline="hover"
                  color="primary"
                  sx={{ display: 'flex', alignItems: 'center', fontWeight: 500 }}
                >
                  {t('explore.article.topics')}
                </Link>
                <Typography color="text.primary" fontWeight={500}>
                  {category.title}
                </Typography>
              </Breadcrumbs>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                {t('explore.article.readTime')}
              </Typography>
              <Typography variant="body2" color="text.primary" fontWeight={500} sx={{ mb: 4 }}>
                {readTime} {t('explore.article.minRead')}
              </Typography>

              <Stack spacing={1} sx={{ mb: 4 }}>
                <Button
                  startIcon={bookmarked ? <Bookmark /> : <BookmarkBorder />}
                  onClick={handleBookmarkToggle}
                  color="secondary"
                  sx={{ justifyContent: 'flex-start', fontWeight: 500, textTransform: 'none' }}
                >
                  {bookmarked ? t('explore.article.bookmarked') : t('explore.article.bookmark')}
                </Button>
                <Button
                  startIcon={<ShareOutlined />}
                  onClick={handleShare}
                  color="secondary"
                  sx={{ justifyContent: 'flex-start', fontWeight: 500, textTransform: 'none' }}
                >
                  {t('explore.article.share')}
                </Button>
              </Stack>

              <Divider sx={{ mb: 4 }} />

              {relatedSubpoints.length > 0 && (
                <>
                  <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1, display: 'block', mb: 2 }}>
                    {t('explore.article.relatedTopics')}
                  </Typography>
                  <Stack spacing={2}>
                    {relatedSubpoints.map((subpoint) => (
                      <Link
                        key={subpoint.id}
                        component={RouterLink}
                        to={`/explore/${category.id}/${subpoint.id}`}
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center', gap: 1, color: COLORS.secondaryDark }}
                      >
                        <MenuBook sx={{ fontSize: '1.1rem', flexShrink: 0 }} /> {subpoint.title}
                      </Link>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
          </Grid>

          {/* MAIN CONTENT */}
          <Grid item xs={12} md={9} lg={9}>
            {/* Back button (Mobile mainly, but good for UX) */}
            <Button
              startIcon={<ArrowBack />}
              onClick={() => navigate(ROUTES.EXPLORE)}
              sx={{ mb: 3, textTransform: 'none', color: 'text.secondary', display: { xs: 'flex', md: 'none' } }}
            >
              {t('explore.article.backToExplore')}
            </Button>

            {/* Hero Image */}
            <Box
              component="img"
              src={article.image || category.coverImage}
              alt={article.title}
              sx={{
                width: '100%',
                height: { xs: 200, sm: 300, md: 400 },
                objectFit: 'cover',
                borderRadius: 3,
                mb: 3,
                boxShadow: theme.palette.mode === 'dark' ? '0 10px 40px rgba(0,0,0,0.45)' : '0 4px 20px rgba(0,0,0,0.08)',
              }}
            />

            {/* Tags */}
            <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ mb: 4 }}>
              <Chip
                icon={<Search fontSize="small" />}
                label={t('explore.article.searchAllTopics')}
                onClick={() => navigate(ROUTES.EXPLORE)}
                variant="outlined"
                color="secondary"
                sx={{ fontWeight: 600, borderRadius: 6, pl: 0.5 }}
                clickable
              />
              <Chip
                label={category.title}
                onClick={goToCategory}
                sx={{ bgcolor: COLORS.secondaryDark, color: COLORS.white, fontWeight: 600, borderRadius: 6, '&:hover': { bgcolor: COLORS.primaryDark } }}
                clickable
              />
            </Stack>

            {/* Title */}
            <Typography
              variant="h3"
              component="h1"
              fontWeight={800}
              sx={{
                mb: 4,
                fontSize: { xs: '2rem', md: '2.5rem' },
                background: `linear-gradient(135deg, ${COLORS.secondaryDark}, ${COLORS.purpleAccent})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {article.title}
            </Typography>

            {/* Content */}
            <Box
              sx={{
                '& h2': { color: COLORS.secondaryDark, fontWeight: 600, mt: 4, mb: 2, fontSize: '1.75rem' },
                '& h3': { color: COLORS.secondaryDark, fontWeight: 600, mt: 3, mb: 2, fontSize: '1.5rem' },
                '& p': { color: 'text.primary', fontSize: '1.1rem', lineHeight: 1.8, mb: 3 },
                '& ul': { color: 'text.primary', fontSize: '1.1rem', lineHeight: 1.8, mb: 3, pl: 3 },
                '& li': { mb: 1 },
                '& strong': { color: 'text.primary', fontWeight: 700 },
              }}
            >
              <ReactMarkdown>
                {article.article}
              </ReactMarkdown>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default ExploreArticlePage;
