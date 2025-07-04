import React, { createContext, useContext, useCallback, useState } from "react";

const FlightContext = createContext();

export const FlightProvider = ({ children }) => {
  const [flightStarted, setFlightStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [stopTime, setStopTime] = useState(null);

  const [isConnected, setIsConnected] = useState(false);
  const [isReceivingData, setIsReceivingData] = useState(false);
  const [lastDataTime, setLastDataTime] = useState(null);

  const startFlight = useCallback(() => {
    setFlightStarted((prev) => {
      if (!prev) {
        console.log("🟢 Flight started");
        setStartTime(Date.now());
        setStopTime(null);
        return true;
      }
      return prev;
    });
  }, []);

  const stopFlight = useCallback(() => {
    if (flightStarted) {
      setFlightStarted(false);
      console.log("🔴 Flight stopped");
      setStopTime(Date.now());
    }
  }, [flightStarted]);

  return (
    <FlightContext.Provider
      value={{
        flightStarted,
        startTime,
        stopTime,
        startFlight,
        stopFlight,
        isConnected,
        isReceivingData,
        lastDataTime,
        setIsConnected,
        setIsReceivingData,
        setLastDataTime,
      }}
    >
      {children}
    </FlightContext.Provider>
  );
};

export const useFlight = () => useContext(FlightContext);