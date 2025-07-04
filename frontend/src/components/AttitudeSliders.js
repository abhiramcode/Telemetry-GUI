import React from 'react';
import { Slider, Typography, Box } from '@mui/material';

const AxisSlider = ({ label, value, min, max }) => {
  const cv = value
  const marks = [
  {
    value: 0,
    label: '0°',
  },
  {
    value: 45,
    label: '45°',
  },
  {
    value: -45,
    label: '-45°',
  },
  {
    value: 90,
    label: '90°',
  },
  {
    value: -90,
    label: '-90°',
  },
];

  return (
    <Box sx={{ m: 2, width: "90%" }}>
      {/* <Typography variant="subtitle2" sx={{ mb: 1 }}>
        {label}: {value.toFixed(2)}°
      </Typography> */}
      <Slider
        value={cv}
        min={min}
        max={max}
        step={0.01}
        disabled
        track={false}
        marks={marks}
        sx={{
          color: label === 'Roll' ? '#36A2EB' : label === 'Pitch' ? '#4CAF50' : '#FF6384',
        }}
      />
    </Box>
  );
};

export default AxisSlider;