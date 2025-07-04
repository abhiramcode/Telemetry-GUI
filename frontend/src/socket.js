// src/socket.js
import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  autoConnect: false,
  transports: ["websocket"],
  reconnectionAttempts: 2,
});

socket.on("connect_error", (err) => {
  // Ignore or log once...
});


export default socket;
