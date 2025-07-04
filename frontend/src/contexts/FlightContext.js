import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flightStarted, setFlightStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);
  const [formattedTime, setFormattedTime] = useState("00m : 00s");

  const timerInterval = useRef(null);
  const watchdogTimeout = useRef(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataTime, setLastDataTime] = useState(null);

  // Helper to update display time from delta
  const updateFormattedTime = (from, to = Date.now()) => {
    const elapsed = Math.floor((to - from) / 1000);
    const min = String(Math.floor(elapsed / 60)).padStart(2, "0");
    const sec = String(elapsed % 60).padStart(2, "0");
    setFormattedTime(`${min}m : ${sec}s`);
  };

  const stopTimer = () => {
    if (timerInterval.current) clearInterval(timerInterval.current);
    timerInterval.current = null;
  };

  const startTimer = (ts) => {
    stopTimer(); // clear any previous
    timerInterval.current = setInterval(() => {
      updateFormattedTime(ts);
    }, 1000);
  };

  const startFlight = useCallback(() => {
    if (!flightStarted) {
      const now = Date.now();
      console.log("🟢 Flight started", now);
      setFlightStarted(true);
      setStartTime(now);
      setStopTime(null);
      updateFormattedTime(now);
      startTimer(now);
    }
  }, [flightStarted]);

  const stopFlight = useCallback(() => {
    if (flightStarted && startTime) {
      const now = Date.now();
      console.log("🔴 Flight stopped", now);
      const elapsedEnd = now;
      setFlightStarted(false);
      setStopTime(elapsedEnd);
      stopTimer();
      updateFormattedTime(startTime, elapsedEnd);
    }
  }, [flightStarted, startTime]);

  // Watchdog for no telemetry
  useEffect(() => {
    if (isConnected) {
      watchdogTimeout.current && clearTimeout(watchdogTimeout.current);
      watchdogTimeout.current = setTimeout(() => {
        const now = Date.now();
        const inactive = now - lastDataTime;
        if (inactive > 3000) {
          console.warn("🚨 Data timeout, stopping flight");
          setIsReceivingData(false);
          stopFlight();
        }
      }, 6000);
    }
    return () => clearTimeout(watchdogTimeout.current);
  }, [lastDataTime, isConnected]);

  return (
    <FlightContext.Provider
      value={{
        flightStarted,
        startTime,
        stopTime,
        startFlight,
        stopFlight,
        isConnected,
        setIsConnected,
        isReceivingData,
        setIsReceivingData,
        setLastDataTime,
        formattedTime,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => useContext(FlightContext);