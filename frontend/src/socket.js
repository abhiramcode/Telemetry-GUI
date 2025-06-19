// src/socket.js
import { io } from "socket.io-client";

// const socket = io("http://localhost:5000");
const socket = io("https://095d13ce-0aee-410b-9889-b1e763ce20d8-00-12koz8gda9m40.riker.replit.dev/", {
  transports: ["websocket"],
});
export default socket;
