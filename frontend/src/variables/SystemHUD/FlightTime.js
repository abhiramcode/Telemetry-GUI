import React from "react";
import { Box, Typography } from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useFlight } from "../../contexts/FlightContext";

const FlightTime = () => {
  const { formattedTime } = useFlight();

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        color: "#bbb",
        whiteSpace: "nowrap",
      }}
    >
      <AccessTimeIcon sx={{ fontSize: 18, mr: 0.5 }} />
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {formattedTime}
      </Typography>
    </Box>
  );
};

export default FlightTime;