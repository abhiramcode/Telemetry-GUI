# backend/mavlink_listener.py

from pymavlink import mavutil
from threading import Thread
import time

class MavLinkListener:
    def __init__(self, emit_cb):
        # Connect to MAVLink stream from udp port (same as simulator)
        self.master = mavutil.mavlink_connection('udp:127.0.0.1:14550')
        self.emit_cb = emit_cb
        self.running = False

    def start(self):
        self.running = True
        Thread(target=self.run, daemon=True).start()

    def run(self):
        while self.running:
            msg = self.master.recv_match(blocking=False)
            if msg is not None:
                msg_type = msg.get_type()
                # print(f"[Backend] MAVLink Msg: {msg_type}\n")
                
                if msg_type == 'ATTITUDE':
                    self.emit_cb('attitude', {
                        'roll': msg.roll,
                        'pitch': msg.pitch,
                        'yaw': msg.yaw
                    })
                elif msg_type == 'GLOBAL_POSITION_INT':
                    self.emit_cb('position', {
                        'lat': msg.lat / 1e7,
                        'lon': msg.lon / 1e7,
                        'alt': msg.alt / 1000
                    })
                elif msg_type == "SYS_STATUS":
                    self.emit_cb('battery', {
                        "battery_remaining": msg.battery_remaining,
                        "voltage_battery": msg.voltage_battery / 1000.0,  # volts
                        "current_battery": msg.current_battery / 1000.0,  # amps
                    })

                elif msg_type == "VFR_HUD":
                    self.emit_cb('hud', {
                        "airspeed": msg.airspeed,
                        "groundspeed": msg.groundspeed,
                        "throttle": msg.throttle,
                        "alt": msg.alt,
                        "climb": msg.climb,
                    })

                elif msg_type == "GPS_RAW_INT":
                    self.emit_cb('gps_status', {
                        "satellites_visible": msg.satellites_visible,
                        "fix_type": msg.fix_type,
                    })

                elif msg_type == "STATUSTEXT":
                    self.emit_cb("log", {
                        "text": msg.text,
                        "severity": msg.severity
                    })

                elif msg_type == "MISSION_CURRENT":
                    self.emit_cb("mission", {
                        "current": msg.seq
                    })

                elif msg_type == "RC_CHANNELS_RAW":
                    self.emit_cb("rc_channels", {
                        "ch1": msg.chan1_raw,
                        "ch2": msg.chan2_raw,
                        "ch3": msg.chan3_raw,
                        "ch4": msg.chan4_raw,
                        "ch5": msg.chan5_raw,
                        "ch6": msg.chan6_raw,
                        "ch7": msg.chan7_raw,
                        "ch8": msg.chan8_raw,
                    })
            time.sleep(1)