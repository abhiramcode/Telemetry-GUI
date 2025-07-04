import React, { useState, useEffect } from "react";
import { Box, InputAdornment, TextField, Button } from "@mui/material";
import { Typography } from "@mui/material";
import socket from "../../socket";
import { useFlight } from "../../contexts/FlightContext";
import SensorsIcon from '@mui/icons-material/Sensors';

const ConnectionControl = () => {
  const [port, setPort] = useState("14550");
  const [attempted, setAttempted] = useState(false);
  const [connected, setConnected] = useState(false);

  const { setIsConnected, stopFlight, startFlight } = useFlight();

  // 🎯 Step 1: Listen to connection/disconnection
  useEffect(() => {
    const handleConnect = () => {
      console.log("✅ Socket connected");
      setConnected(true);
      setIsConnected(true);
      startFlight();
    };

    const handleDisconnect = () => {
      console.log("🔌 Socket disconnected");
      setConnected(false);
      setIsConnected(false);
      stopFlight(); // optional: stop timer/logs
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [setIsConnected, stopFlight]);

  // 🎯 Step 2: Connect/Disconnect toggle
  const handleConnectToggle = () => {
    if (!port) {
      setAttempted(true);
      return alert("Please enter a valid UDP output port.");
    }

    if (!connected) {
      // ⚡ CONNECTING
      socket.connect();
    } else {
      // 🚫 DISCONNECTING
      socket.disconnect();
    }
  };

  return (
    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
            // label="UDP Port"
            size="small"
            variant="outlined"
            placeholder="14550"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            error={attempted && !port}
            InputProps={{
                startAdornment: 
                    <InputAdornment position="start">
                    <SensorsIcon color="primary" />
                    <Typography sx={{ color: "#90caf9", fontSize: 14 }}>
                        udpout:
                    </Typography>
                    </InputAdornment>,
                sx: { backgroundColor: "#2a2a3c", color: "#fff" },
            }}
            sx={{
            width: "160px",
            '& .MuiOutlinedInput-root': {
                borderRadius: '30px',
                '&:hover fieldset': {
                borderColor: '#90caf9',
                },
                '&:hover .MuiInputAdornment-positionStart': {
                color: '#90caf9',
                },
            },
            }}
        />
        {/* <TextField
            // label="UDP Port"
            size="small"
            variant="outlined"
            placeholder="14550"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            error={attempted && !port}
            InputProps={{
                startAdornment: <InputAdornment position="start">
                
                </InputAdornment>,
                sx: { backgroundColor: "#2a2a3c", color: "#fff" },
            }}
            sx={{ width: "140px" }}
        /> */}

        <Button
            variant={connected ? "contained" : "outlined"}
            color={connected ? "error" : "success"}
            size="small"
            onClick={handleConnectToggle}
        >
            {connected ? "Disconnect" : "Connect"}
        </Button>
        </Box>
  );
};

export default ConnectionControl;