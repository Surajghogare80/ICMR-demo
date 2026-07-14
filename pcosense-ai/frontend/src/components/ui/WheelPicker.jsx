// src/components/ui/WheelPicker.jsx
import { useRef, useEffect, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';

const WheelPicker = ({ value, onChange, min = 0, max = 100, step = 1, unit = '' }) => {
  const containerRef = useRef(null);
  const ITEM_HEIGHT = 46; // Touch-friendly iOS wheel height in pixels
  const isUserScrolling = useRef(false);
  const scrollTimeoutRef = useRef(null);

  // Generate range of numbers based on min, max, and step
  const options = useMemo(() => {
    const list = [];
    const count = Math.round((max - min) / step) + 1;
    for (let i = 0; i < count; i++) {
      const val = Number((min + i * step).toFixed(step < 1 ? 1 : 0));
      list.push(val);
    }
    return list;
  }, [min, max, step]);

  // Find closest index for initial value
  const getClosestIndex = (targetValue) => {
    const num = Number(targetValue);
    if (isNaN(num)) return 0;
    let closestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < options.length; i++) {
      const diff = Math.abs(options[i] - num);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    return closestIdx;
  };

  const initialIndex = getClosestIndex(value);
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  // Synchronize picker position when external `value`, `min`, `max`, or `step` changes (e.g. typing or unit switch)
  useEffect(() => {
    if (isUserScrolling.current) return;
    if (!containerRef.current || options.length === 0) return;

    const targetIndex = getClosestIndex(value);
    setActiveIndex(targetIndex);

    const targetScrollTop = targetIndex * ITEM_HEIGHT;
    if (Math.abs(containerRef.current.scrollTop - targetScrollTop) > 2) {
      containerRef.current.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      });
    }
  }, [value, options, min, max, step]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    isUserScrolling.current = true;

    const scrollTop = containerRef.current.scrollTop;
    const rawIndex = scrollTop / ITEM_HEIGHT;
    const index = Math.min(Math.max(Math.round(rawIndex), 0), options.length - 1);

    if (index !== activeIndex) {
      setActiveIndex(index);
    }

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isUserScrolling.current = false;
      if (options[index] !== undefined && options[index] !== Number(value)) {
        onChange(options[index]);
      }
    }, 120);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 1, width: '100%', userSelect: 'none' }}>
      <Box
        sx={{
          position: 'relative',
          height: `${ITEM_HEIGHT * 5}px`, // 5 visible rows exactly centered
          width: '100%',
          maxWidth: '320px',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.45)' : 'rgba(255, 248, 251, 0.95)',
          borderRadius: 5,
          border: '1px solid',
          borderColor: (theme) => theme.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.2)' : 'rgba(233, 30, 99, 0.15)',
          boxShadow: (theme) => theme.palette.mode === 'dark' ? 'inset 0 0 24px rgba(0,0,0,0.4)' : 'inset 0 0 24px rgba(233,30,99,0.04)',
          overflow: 'hidden',
        }}
      >
        {/* Pink Center Selection Indicator Overlay (row 3 of 5) */}
        <Box
          sx={{
            position: 'absolute',
            top: `${ITEM_HEIGHT * 2}px`,
            left: '12px',
            right: '12px',
            height: `${ITEM_HEIGHT}px`,
            borderRadius: 3,
            borderTop: '2px solid #E91E63',
            borderBottom: '2px solid #E91E63',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(233, 30, 99, 0.18)' : 'rgba(233, 30, 99, 0.1)',
            boxShadow: '0 4px 16px rgba(233, 30, 99, 0.12)',
            pointerEvents: 'none',
            zIndex: 2,
            transition: 'all 0.2s ease',
          }}
        />

        {/* Top/Bottom Gradient Fades for iOS Depth */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: `${ITEM_HEIGHT * 2}px`,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(to bottom, rgba(30, 41, 59, 0.95) 10%, rgba(30, 41, 59, 0) 100%)'
                : 'linear-gradient(to bottom, rgba(255, 248, 251, 0.95) 10%, rgba(255, 248, 251, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: `${ITEM_HEIGHT * 2}px`,
            background: (theme) =>
              theme.palette.mode === 'dark'
                ? 'linear-gradient(to top, rgba(30, 41, 59, 0.95) 10%, rgba(30, 41, 59, 0) 100%)'
                : 'linear-gradient(to top, rgba(255, 248, 251, 0.95) 10%, rgba(255, 248, 251, 0) 100%)',
            pointerEvents: 'none',
            zIndex: 3,
          }}
        />

        {/* Scrollable Container */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          style={{
            height: '100%',
            overflowY: 'scroll',
            scrollSnapType: 'y mandatory',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingTop: `${ITEM_HEIGHT * 2}px`, // Top spacer exactly 2 rows
            paddingBottom: `${ITEM_HEIGHT * 2}px`, // Bottom spacer exactly 2 rows
            boxSizing: 'border-box',
            scrollBehavior: 'smooth',
          }}
          className="hide-scrollbar"
        >
          {options.map((val, idx) => {
            const distance = Math.abs(idx - activeIndex);
            const isActive = distance === 0;

            let opacity = 1;
            let blur = 'none';
            let scale = 1.05;

            if (distance === 1) {
              opacity = 0.5;
              blur = 'blur(0.6px)';
              scale = 0.94;
            } else if (distance === 2) {
              opacity = 0.25;
              blur = 'blur(1.4px)';
              scale = 0.86;
            } else if (distance >= 3) {
              opacity = 0.1;
              blur = 'blur(2px)';
              scale = 0.8;
            }

            return (
              <div
                key={val}
                style={{
                  height: `${ITEM_HEIGHT}px`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  scrollSnapAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: `scale(${scale})`,
                  opacity,
                  filter: blur,
                }}
                onClick={() => {
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      top: idx * ITEM_HEIGHT,
                      behavior: 'smooth',
                    });
                    setActiveIndex(idx);
                    onChange(val);
                  }
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isActive ? 800 : 500,
                    fontSize: isActive ? '1.35rem' : '1rem',
                    color: isActive ? '#E91E63' : 'text.secondary',
                    letterSpacing: isActive ? '-0.5px' : '0px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {val} {unit && <span style={{ fontSize: isActive ? '0.95rem' : '0.8rem', fontWeight: 600, opacity: 0.85 }}>{unit}</span>}
                </Typography>
              </div>
            );
          })}
        </div>
      </Box>

      {/* Styled inline scrollbar hiding styles */}
      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none !important;
        }
      `}</style>
    </Box>
  );
};

export default WheelPicker;
