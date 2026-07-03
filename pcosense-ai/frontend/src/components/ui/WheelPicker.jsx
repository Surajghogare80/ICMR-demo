// src/components/ui/WheelPicker.jsx
import { useRef, useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';

const WheelPicker = ({ value, onChange, min, max, unit }) => {
  const containerRef = useRef(null);
  const [activeValue, setActiveValue] = useState(value || min);
  const ITEM_HEIGHT = 40; // Height of each scroll item in pixels

  // Generate range of numbers
  const options = [];
  for (let i = min; i <= max; i++) {
    options.push(i);
  }

  // Handle initial scroll on mount or value change
  useEffect(() => {
    if (containerRef.current) {
      const parsedVal = Number(value);
      const index = options.indexOf(parsedVal);
      if (index !== -1) {
        const targetScrollTop = index * ITEM_HEIGHT;
        // Avoid scrolling if already close to target
        if (Math.abs(containerRef.current.scrollTop - targetScrollTop) > 2) {
          containerRef.current.scrollTop = targetScrollTop;
          setActiveValue(parsedVal);
        }
      }
    }
  }, [value]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const scrollTop = containerRef.current.scrollTop;
    
    // Calculate which item index is closest to center
    const rawIndex = scrollTop / ITEM_HEIGHT;
    const index = Math.round(rawIndex);
    
    if (index >= 0 && index < options.length) {
      const selectedVal = options[index];
      if (selectedVal !== activeValue) {
        setActiveValue(selectedVal);
        onChange(selectedVal);
      }
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', my: 2, width: '100%' }}>
      <Box
        sx={{
          position: 'relative',
          height: '200px',
          width: '100%',
          maxWidth: '280px',
          bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(30, 41, 59, 0.5)' : 'rgba(240, 244, 255, 0.8)',
          borderRadius: 4,
          border: (theme) => `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        }}
      >
        {/* Transparent Overlay Highlight Indicator in the center (row 3 of 5) */}
        <Box
          sx={{
            position: 'absolute',
            top: '80px',
            left: 0,
            right: 0,
            height: '40px',
            borderTop: '2px solid',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(21, 101, 192, 0.15)' : 'rgba(21, 101, 192, 0.08)',
            pointerEvents: 'none',
            zIndex: 2,
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
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE 10+
            paddingTop: '80px', // Top spacer for centering
            paddingBottom: '80px', // Bottom spacer for centering
            boxSizing: 'border-box',
          }}
          className="hide-scrollbar"
        >
          {options.map((val) => {
            const isActive = val === activeValue;
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
                }}
                onClick={() => {
                  const idx = options.indexOf(val);
                  if (containerRef.current) {
                    containerRef.current.scrollTo({
                      top: idx * ITEM_HEIGHT,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isActive ? 800 : 500,
                    fontSize: isActive ? '1.25rem' : '0.95rem',
                    color: isActive ? 'primary.main' : 'text.secondary',
                    opacity: isActive ? 1 : 0.45,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {val} {unit}
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
