import React from "react";
import { useFlight } from "../../contexts/FlightContext";
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, Typography, Tooltip } from '@mui/material';

const ConnectionStatus = () => {
  const { isConnected, isReceivingData } = useFlight();

  let color = "red";
  let label = "Disconnected";

  if (isConnected && isReceivingData) {
    color = "green";
    label = "Connected and Receiving";
  } else if (isConnected && !isReceivingData) {
    color = "blue";
    label = "Connected but No Data";
  }

  return (
    <Tooltip title={label}>
      <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
        <FiberManualRecordIcon sx={{ color, fontSize: 20 }} />
        {/* <Typography variant="body2" color="#bbb">{label}</Typography> */}
      </Box>
    </Tooltip>
  );
};

export default ConnectionStatus;