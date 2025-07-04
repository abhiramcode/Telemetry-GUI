import React from 'react';
import { Tooltip, Box, Typography, CircularProgress, CircularProgressLabel } from '@mui/material';

const BatteryStatus = ({ voltage = 11.7, percent = 87, current = 2.1 }) => {
  const color = percent > 50 ? "green" : percent > 20 ? "orange" : "red";

  return (
    <Tooltip
      title={
        <Box p={1}>
          <Typography variant="caption">Voltage: {voltage.toFixed(2)}V</Typography><br />
          <Typography variant="caption">Current: {current} A</Typography><br />
          <Typography variant="caption">Battery %: {percent}%</Typography>
        </Box>
      }
      arrow
    >
      <Box
        sx={{
          width: 35,
          height: 35,
          borderRadius: "50%",
          border: `3px solid ${color}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color,
          mr:-1
        }}
      >
        <Typography variant="caption" sx={{fontSize:"10px"}}>{percent}%</Typography>
      </Box>
    </Tooltip>
  );
};

export default BatteryStatus;