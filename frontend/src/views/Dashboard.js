/*!

=========================================================
* Black Dashboard React v1.2.2
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2023 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useEffect, useState } from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
// Socket.io client
import socket from "./../socket.js";

// reactstrap components
import {
  Badge,
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Progress
} from "reactstrap";


import CurvedSliderD1 from "components/SliderDemo-1.js";

import { useFlight } from "../contexts/FlightContext.js";


function Dashboard(props) {
  
  const [attitude, setAttitude] = useState({
    roll: 0,
    pitch: 0,
    yaw: 0
  });
  
  const [attitudeHistory, setAttitudeHistory] = useState({
    roll: [],
    pitch: [],
    yaw: [],
    labels: []
  });
  
  const [position, setPosition] = useState({
    lat: 0,
    lon: 0,
    alt: 0
  });
  
  const [battery, setBattery] = useState({
    battery_remaining: 100,
    voltage_battery: 12,
    current_battery: 3
  });

  const [hud, setHud] = useState({
    airspeed: 0,
    groundspeed: 0,
    throttle: 0,
    alt: 0,
    climb: 0
  });

  const [gpsStatus, setGpsStatus] = useState({
    satellites_visible: 0,
    fix_type: 0,
  });

  const [mission, setMission] = useState({ current: 0 });

  const [rc, setRc] = useState({
    "ch1": 0,
    "ch2": 0,
    "ch3": 0,
    "ch4": 0,
    "ch5": 0,
    "ch6": 0,
    "ch7": 0,
    "ch8": 0,
  });

  const [logMessages, setLogMessages] = useState([]);

  
  const {
    startFlight,
    stopFlight,
    setIsConnected,
    setIsReceivingData,
    setLastDataTime,
  } = useFlight();

  useEffect(() => {

    socket.on("connect", () => {
      console.log("[Socket] Connected to backend 🚀");
      setIsConnected(true);
      // startFlight();
    }); // DEBUG

    let hasWarned = false;

    socket.io.on("reconnect_attempt", () => {
      if (!hasWarned) {
        console.warn("⚠️ Waiting to connect to Socket.IO backend...");
        hasWarned = true;
      }
    });

    let hasStarted = false;

    socket.onAny((event) => {
      if (!hasStarted && event === "attitude") {
        hasStarted = true;
        startFlight(); // only on first telemetry
      }
      const now = Date.now();
      setIsReceivingData(true);
      setLastDataTime(now);
      // startFlight();
    });
    
    socket.on("attitude", (data) => {
      // console.log("[Socket] Attitude received:", data);  // DEBUG
      
      setAttitude(data);
      setAttitudeHistory((prev) => {
        const maxLength = 30;
        const newLabels = [...prev.labels, ""].slice(-maxLength);

        return {
          roll: [...prev.roll, data.roll].slice(-maxLength),
          pitch: [...prev.pitch, data.pitch].slice(-maxLength),
          yaw: [...prev.yaw, data.yaw].slice(-maxLength),
          labels: newLabels,
        };
      });
    });

    socket.on("position", (data) => {
      // console.log("[Socket] Position received:", data);  // DEBUG
      setPosition(data);
    });

    socket.on("battery", setBattery);
    socket.on("hud", setHud);
    socket.on("gps_status", setGpsStatus);
    socket.on("mission", setMission);
    socket.on("rc_channels", setRc);
    socket.on("log", (data) => {
      setLogMessages((prev) => [data, ...prev.slice(0, 20)]); // show latest 20 logs
    });
    
    socket.on("disconnect", () => {
      console.log("[Socket] Disconnected from backend 😢");
      setIsConnected(false);
      setIsReceivingData(false);
      stopFlight(); // Stop flight
    })

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.offAny();
    };
              
  }, []);


  return (
    <>
      <div className="content">
        <Row>
            <Col lg="4" md="6" sm="4">
              <Card className="card-chart" style={{ height: "200px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    ROLL
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {attitude.roll !== undefined
                      ? attitude.roll.toFixed(2)
                      : "0.00"}
                    °
                  </h3>

                  <div style={{ height: "100%", width: "100%", position: "absolute" }}>
                    <CurvedSliderD1 
                      sliderType="curved"
                      width={300}
                      height={150}
                      position={{ x: 0, y: 0 }}
                      strokeWidth={7}
                      thumbRadius={11}
                      activeColor="#4a90e2"
                      value={attitude.roll}
                      // onChange={setCurvedValue}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" md="6" sm="15">
              <Card className="card-chart" style={{ height: "200px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    PITCH
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {attitude.pitch !== undefined
                      ? attitude.pitch.toFixed(2)
                      : "0.00"}
                    °
                  </h3>

                  <div style={{ height: "100%", width: "100%", position: "absolute"}}>
                    <CurvedSliderD1 
                      sliderType="vertical"
                      width={25}
                      height={250}
                      position={{ x: 0, y: 0 }}
                      strokeWidth={12}
                      thumbRadius={14.5}
                      thumbStrokeWidth={6}
                      activeColor="#4a90e2"
                      value={attitude.pitch}
                      // onChange={setCurvedValue}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" md="6" sm="15">
              <Card className="card-chart" style={{ height: "200px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    YAW
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {attitude.yaw !== undefined
                      ? attitude.yaw.toFixed(2)
                      : "0.00"}
                    °
                  </h3>

                  <div style={{ height: "100%", width: "100%", position: "absolute" }}>
                    <CurvedSliderD1 
                      sliderType="horizontal"
                      width={150}
                      height={25}
                      position={{ x: 0, y: 0 }}
                      strokeWidth={2}
                      thumbRadius={2.5}
                      thumbStrokeWidth={1}
                      activeColor="#4a90e2"
                      value={attitude.yaw}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
        </Row>

        <Row>
            <Col lg="4" md="6" sm="4">
              <Card className="card-chart" style={{ height: "100px", display:"flex", alignItems:"center", justifyContent:'center', borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    LATTITUDE
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {position.lat !== undefined
                      ? position.lat.toFixed(2)
                      : "0.00"}
                    °
                  </h3>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" md="6" sm="15">
              <Card className="card-chart" style={{ height: "100px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    LONGITUDE
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {position.lon !== undefined
                      ? position.lon.toFixed(2)
                      : "0.00"}
                    °
                  </h3>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" md="6" sm="15">
              <Card className="card-chart" style={{ height: "100px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    ALTITUDE
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {position.alt !== undefined
                      ? position.alt.toFixed(2)
                      : "0.00"}
                    
                  </h3>
                </CardBody>
              </Card>
            </Col>
        </Row>

        <Row>
            <Col lg="4" md="6" sm="4">
              <Card className="card-chart" style={{ height: "100px", display:"flex", alignItems:"center", justifyContent:'center', borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    AIR SPEED
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {hud.airspeed !== undefined
                      ? hud.airspeed.toFixed(2)
                      : "0.00"} m/s
                  </h3>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" md="6" sm="15">
              <Card className="card-chart" style={{ height: "100px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    GROUND SPEED
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {hud.groundspeed !== undefined
                      ? hud.groundspeed.toFixed(2)
                      : "0.00"} m/s
                  </h3>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4" md="6" sm="15">
              <Card className="card-chart" style={{ height: "100px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    THROTTLE
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {hud.throttle !== undefined
                      ? hud.throttle.toFixed(2)
                      : "0.00"} %
                  </h3>
                </CardBody>
              </Card>
            </Col>
        </Row>
        
        <Row>
          {/* Mission Card */}
          <Col lg="4" md="6">
            <Card className="card-chart" style={{ height: "150px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <CardHeader>
                <h5 className="title">MISSION STATUS</h5>
              </CardHeader>
              <CardBody className="text-center">
                <h6 className="card-category text-gray text-uppercase mb-1">
                  Current Waypoint
                </h6>

                <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                  {mission.current}
                </h3>
              </CardBody>
            </Card>
          </Col>

          {/* RC Channel Raw */}
          <Col lg="8" md="6">
            <Card style={{ height: "150px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <CardHeader>
                <h5 className="title">RC Channels</h5>
              </CardHeader>
              <CardBody className="text-center">
                <Row>
                  {Object.entries(rc).map(([key, val], idx) => (
                    <Col xs="6" sm="4" md="3" key={idx}>
                      <p><b>{key.toUpperCase()}</b>: {val}</p>
                    </Col>
                  ))}
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Row>
          {/* GPS Card */}
          <Col lg="4" md="6">
            <Card style={{ height: "150px", borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <CardHeader>
                <h5 className="title">GPS Status</h5>
              </CardHeader>
              <CardBody  className="text-center">
                <p><b>Satellites:</b> {gpsStatus.satellites_visible}</p>
                <p><b>Fix Type:</b> 
                  {" "}{gpsStatus.fix_type === 3 ? (
                    <Badge color="success">3D Fix</Badge>
                  ) : (
                    <Badge color="warning">No Fix</Badge>
                  )}
                </p>
              </CardBody>
            </Card>
          </Col>

          <Col lg="8">
            <Card style={{ borderRadius: "16px", boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
              <CardHeader>
                <h5 className="title">Autopilot Log</h5>
              </CardHeader>
              <CardBody style={{ maxHeight: "200px", overflowY: "auto" }}>
                {logMessages.length === 0 ? (
                  <p>No messages.</p>
                ) : (
                  logMessages.map((msg, i) => (
                    <p key={i} style={{ marginBottom: "4px" }}>
                      <Badge color={msg.severity < 3 ? "danger" : msg.severity === 4 ? "info" : "secondary"}>
                        {msg.severity}
                      </Badge>{" "}
                      {msg.text}
                    </p>
                  ))
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
