import React from 'react';
import { Box, Typography, Slider } from '@mui/material';

const AttitudeDisplay = ({ label, value, min, max, orientation = 'horizontal', curve = false, color = '#2196F3' }) => {
  const toDegrees = (rad) => (rad * 180 / Math.PI);

  return (
    <Box
      sx={{
        width: orientation === 'vertical' ? '60px' : '100%',
        height: orientation === 'vertical' ? '200px' : 'auto',
        p: 2,
        textAlign: 'center',
        border: '1px solid #444',
        borderRadius: 2,
        backgroundColor: '#1F1F2E',
        color: 'white'
      }}
    >
      <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}: {toDegrees(value).toFixed(1)}°
      </Typography>
      
      {/* Show Semi-Circle Label for Roll */}
      {curve && (
        <Typography
          variant="caption"
          sx={{ mb: 1, color: '#aaa', fontStyle: 'italic' }}
        >
          ← Left &emsp;&emsp;|&emsp;&emsp; Right →
        </Typography>
      )}

      <Slider
        orientation={orientation}
        value={value}
        min={min}
        max={max}
        step={0.01}
        disabled
        marks
        sx={{
          mt: 2,
          color: color,
          // '& .MuiSlider-thumb': {
          //   display: 'none',
          // },
          // '& .MuiSlider-rail': {
          //   opacity: 0.3,
          //   backgroundColor: '#aaa'
          // },
          // '& .MuiSlider-track': {
          //   backgroundColor: color
          // }
        }}
      />
    </Box>
  );
};

export default AttitudeDisplay;