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
import socket from "socket.js";

// reactstrap components
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
  Progress
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";



function Dashboard(props) {
  
  const [bigChartData, setbigChartData] = React.useState("data1");
  const setBgChartData = (name) => {
    setbigChartData(name);
  };
  
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

  const [rc, setRc] = useState({});

  const [logMessages, setLogMessages] = useState([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("[Socket] Connected to backend 🚀");
    }); // DEBUG
    
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
    })
              
  }, []);
  return (
    <>
      <div className="content">
        {/* <Row>
          <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Total Shipments</h5>
                    <CardTitle tag="h2">Performance</CardTitle>
                  </Col>
                  <Col sm="6">
                    <ButtonGroup
                      className="btn-group-toggle float-right"
                      data-toggle="buttons"
                    >
                      <Button
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data1",
                        })}
                        color="info"
                        id="0"
                        size="sm"
                        onClick={() => setBgChartData("data1")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Accounts
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-single-02" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="1"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data2",
                        })}
                        onClick={() => setBgChartData("data2")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Purchases
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-gift-2" />
                        </span>
                      </Button>
                      <Button
                        color="info"
                        id="2"
                        size="sm"
                        tag="label"
                        className={classNames("btn-simple", {
                          active: bigChartData === "data3",
                        })}
                        onClick={() => setBgChartData("data3")}
                      >
                        <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                          Sessions
                        </span>
                        <span className="d-block d-sm-none">
                          <i className="tim-icons icon-tap-02" />
                        </span>
                      </Button>
                    </ButtonGroup>
                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample1[bigChartData]}
                    options={chartExample1.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
        {/* <Row>
          <Col lg="4" md="6" sm="12">
            <Card className="h-100">
              <CardHeader>
                <h5 className="title">Roll</h5>
              </CardHeader>
              <CardBody>
                <h3 className="mb-3">{attitude.roll.toFixed(2)}°</h3>
                <Line
                  data={{
                    labels: attitudeHistory.labels,
                    datasets: [
                      {
                        data: attitudeHistory.roll,
                        borderColor: "#36A2EB",
                        backgroundColor: "transparent",
                        tension: 0.3,
                        fill: false,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: {
                        min: -1,
                        max: 1,
                        ticks: { stepSize: 0.2 },
                        display: false
                      },
                      x: { display: false },
                    },
                    elements: { line: { borderWidth: 2 } },
                    plugins: { legend: { display: false } },
                  }}
                />
              </CardBody>
            </Card>
          </Col>

          <Col lg="4" md="6" sm="12">
            <Card className="h-100">
              <CardHeader>
                <h5 className="title">Pitch</h5>
              </CardHeader>
              <CardBody>
                <h3 className="mb-3">{attitude.pitch.toFixed(2)}°</h3>
                <Line
                  data={{
                    labels: attitudeHistory.labels,
                    datasets: [
                      {
                        data: attitudeHistory.pitch,
                        borderColor: "#4CAF50",
                        backgroundColor: "transparent",
                        tension: 0.3,
                        fill: false,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: { min: -1, max: 1, display: false },
                      x: { display: false },
                    },
                    elements: { line: { borderWidth: 2 } },
                    plugins: { legend: { display: false } },
                  }}
                />
              </CardBody>
            </Card>
          </Col>

          <Col lg="4" md="6" sm="12">
            <Card className="h-100">
              <CardHeader>
                <h5 className="title">Yaw</h5>
              </CardHeader>
              <CardBody>
                <h3 className="mb-3">{attitude.yaw.toFixed(2)}°</h3>
                <Line
                  data={{
                    labels: attitudeHistory.labels,
                    datasets: [
                      {
                        data: attitudeHistory.yaw,
                        borderColor: "#FF6384",
                        backgroundColor: "transparent",
                        tension: 0.3,
                        fill: false,
                        pointRadius: 0,
                      },
                    ],
                  }}
                  options={{
                    responsive: true,
                    scales: {
                      y: { min: -1, max: 1, display: false },
                      x: { display: false },
                    },
                    elements: { line: { borderWidth: 2 } },
                    plugins: { legend: { display: false } },
                  }}
                />
              </CardBody>
            </Card>
          </Col>
        </Row> */}
        <Row>
          {["roll", "pitch", "yaw"].map((axis, i) => (
            <Col lg="4" md="6" sm="12" key={axis}>
              <Card className="card-chart" style={{ height: "200px" }}>
                <CardBody className="text-center">
                  <h6 className="card-category text-gray text-uppercase mb-1">
                    {axis.toUpperCase()}
                  </h6>

                  <h3 className="card-title mb-2" style={{ fontSize: "26px" }}>
                    {attitude[axis] !== undefined
                      ? attitude[axis].toFixed(2)
                      : "0.00"}
                    °
                  </h3>

                  <div style={{ height: "60px", width: "100%", position: "relative" }}>
                    <Line
                      data={{
                        labels: attitudeHistory.labels,
                        datasets: [
                          {
                            data: attitudeHistory[axis],
                            borderColor:
                              axis === "roll"
                                ? "#36A2EB"
                                : axis === "pitch"
                                ? "#4CAF50"
                                : "#FF6384",
                            backgroundColor: "transparent",
                            tension: 0.4,
                            fill: false,
                            pointRadius: 0,
                          },
                        ],
                      }}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        animation: false,
                        elements: { line: { borderWidth: 2 } },
                        plugins: {
                          legend: { display: false },
                        },
                        scales: {
                          x: { display: false },
                          y: {
                            display: false,
                            min: -1,
                            max: 1,
                          },
                        },
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
        {/* <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total Shipments</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> 763,215
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Daily Sales</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  3,500€
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={chartExample3.data}
                    options={chartExample3.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Completed Tasks</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> 12,100K
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row> */}
        <Row>
          <Col lg="6" md="12">
            {/* <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Tasks(5)</h6>
                <p className="card-category d-inline"> today</p>
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Another action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Something else
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Update the Documentation</p>
                          <p className="text-muted">
                            Dwuamish Head, Seattle, WA 8:47 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip636901683"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip636901683"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input
                                defaultChecked
                                defaultValue=""
                                type="checkbox"
                              />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">GDPR Compliance</p>
                          <p className="text-muted">
                            The GDPR is a regulation that requires businesses to
                            protect the personal data and privacy of Europe
                            citizens for transactions that occur within EU
                            member states.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip457194718"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip457194718"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Solve the issues</p>
                          <p className="text-muted">
                            Fifty percent of all respondents said they would be
                            more likely to shop at a company
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip362404923"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip362404923"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Release v2.0.0</p>
                          <p className="text-muted">
                            Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip818217463"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip818217463"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Export the processed files</p>
                          <p className="text-muted">
                            The report also shows that consumers will not easily
                            forgive a company once a breach exposing their
                            personal data occurs.
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip831835125"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip831835125"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Arival at export process</p>
                          <p className="text-muted">
                            Capitol Hill, Seattle, WA 12:34 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip217595172"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip217595172"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card> */}
            <Card>
              <CardHeader>
                <h5 className="title">Live Telemetry</h5>
              </CardHeader>
              <CardBody>
                <p><strong>Roll:</strong> {attitude.roll.toFixed(2)}</p>
                <p><strong>Pitch:</strong> {attitude.pitch.toFixed(2)}</p>
                <p><strong>Yaw:</strong> {attitude.yaw.toFixed(2)}</p>
                <p><strong>Lat:</strong> {position.lat.toFixed(5)}</p>
                <p><strong>Lon:</strong> {position.lon.toFixed(5)}</p>
                <p><strong>Alt:</strong> {position.alt.toFixed(2)} m</p>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="12">
            {/* <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-center">$23,789</td>
                    </tr>
                    <tr>
                      <td>Sage Rodriguez</td>
                      <td>Netherlands</td>
                      <td>Baileux</td>
                      <td className="text-center">$56,142</td>
                    </tr>
                    <tr>
                      <td>Philip Chaney</td>
                      <td>Korea, South</td>
                      <td>Overland Park</td>
                      <td className="text-center">$38,735</td>
                    </tr>
                    <tr>
                      <td>Doris Greene</td>
                      <td>Malawi</td>
                      <td>Feldkirchen in Kärnten</td>
                      <td className="text-center">$63,542</td>
                    </tr>
                    <tr>
                      <td>Mason Porter</td>
                      <td>Chile</td>
                      <td>Gloucester</td>
                      <td className="text-center">$78,615</td>
                    </tr>
                    <tr>
                      <td>Jon Porter</td>
                      <td>Portugal</td>
                      <td>Gloucester</td>
                      <td className="text-center">$98,615</td>
                    </tr>
                  </tbody>
                </Table>
              </CardBody>
            </Card> */}
          </Col>
        </Row>
        <Row>
          {/* Battery Card */}
          <Col lg="4" md="6">
            <Card>
              <CardHeader>
                <h5 className="title">Battery</h5>
              </CardHeader>
              <CardBody>
                <p><b>Voltage:</b> {battery.voltage_battery} V</p>
                <p><b>Current:</b> {battery.current_battery} A</p>
                <p><b>Remaining:</b></p>
                <Progress value={battery.battery_remaining} color="success">
                  {battery.battery_remaining}%
                </Progress>
                <p><b>{battery.battery_remaining}</b></p>
              </CardBody>
            </Card>
          </Col>

          {/* HUD Info */}
          <Col lg="4" md="6">
            <Card>
              <CardHeader>
                <h5 className="title">Flight HUD</h5>
              </CardHeader>
              <CardBody>
                <p><b>Airspeed:</b> {hud.airspeed} m/s</p>
                <p><b>Groundspeed:</b> {hud.groundspeed} m/s</p>
                <p><b>Throttle:</b> {hud.throttle}%</p>
                <p><b>Altitude:</b> {hud.alt.toFixed(1)} m</p>
                <p><b>Climb:</b> {hud.climb} m/s</p>
              </CardBody>
            </Card>
          </Col>

          {/* GPS Card */}
          <Col lg="4" md="6">
            <Card>
              <CardHeader>
                <h5 className="title">GPS Status</h5>
              </CardHeader>
              <CardBody>
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
        </Row>
        <Row>
          {/* Mission Card */}
          <Col lg="4" md="6">
            <Card>
              <CardHeader>
                <h5 className="title">Mission Status</h5>
              </CardHeader>
              <CardBody>
                <p><b>Current Waypoint:</b> {mission.current}</p>
              </CardBody>
            </Card>
          </Col>

          {/* RC Channel Raw */}
          <Col lg="8" md="6">
            <Card>
              <CardHeader>
                <h5 className="title">RC Channels</h5>
              </CardHeader>
              <CardBody>
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
          <Col lg="12">
            <Card>
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
