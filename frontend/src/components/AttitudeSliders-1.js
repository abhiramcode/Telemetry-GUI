import React from 'react';
import { Slider, Typography, Box } from '@mui/material';

const toDegrees = (radians) => radians * (180 / Math.PI);

const AxisSlider = ({ label, value, min, max, orientation = 'horizontal', color = '#4CAF50' }) => {
  const isVertical = orientation === 'vertical';

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isVertical ? 'column' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: 2,
        py: 1,
        width: isVertical ? '70px' : '100%',
        height: isVertical ? '200px' : 'auto',
        boxSizing: 'border-box',
      }}
    >
      {/* <Typography
        variant="subtitle2"
        sx={{ mb: isVertical ? 1 : 0.5, textAlign: 'center', color: '#ccc' }}
      >
        {label}: {toDegrees(value).toFixed(1)}°
      </Typography> */}

      <Slider
        orientation={orientation}
        value={value}
        min={min}
        max={max}
        step={0.01}
        disabled
        track={false}
        sx={{
          color: color,
          width: isVertical ? '200px' : '100%', // For visual rotation
          height: isVertical ? '100%' : 8,
          transform: isVertical ? 'rotate(-90deg)' : 'none',
          '& .MuiSlider-rail': {
            backgroundColor: '#333',
            transform: label === 'Roll' ? 'rotate(80deg)' : 'none',
            opacity: 1
          },
        //   '& .MuiSlider-track': {
        //     backgroundColor: color,
        //   },
        //   '& .MuiSlider-thumb': {
        //     display: 'none'
        //   },
        }}
        // sx={{
        //   color: label === 'Roll' ? '#36A2EB' : label === 'Pitch' ? '#4CAF50' : '#FF6384',
        // }}
      />
      {/* Optional curved hint */}
      {label === "Roll" && (
        <Typography
          variant="caption"
          sx={{
            color: '#888',
            mt: 1,
            fontStyle: 'italic',
            userSelect: 'none',
          }}
        >
          ← Bank L / Bank R →
        </Typography>
      )}
    </Box>
  );
};

export default AxisSlider;