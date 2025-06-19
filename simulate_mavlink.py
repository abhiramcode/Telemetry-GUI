# simulate_mavlink.py
import math
import time

from pymavlink import mavutil

# Connect to UDP port (same as MAVProxy or your dashboard listens to)
master = mavutil.mavlink_connection('udpout:127.0.0.1:14550')
start_time = time.time()


def send_heartbeat():
    master.mav.heartbeat_send(
        type=mavutil.mavlink.MAV_TYPE_QUADROTOR,
        autopilot=mavutil.mavlink.MAV_AUTOPILOT_ARDUPILOTMEGA,
        base_mode=0,
        custom_mode=0,
        system_status=mavutil.mavlink.MAV_STATE_ACTIVE)


def send_attitude(time_boot_ms, roll, pitch, yaw):
    master.mav.attitude_send(
        time_boot_ms,  # time_boot_ms
        roll,
        pitch,
        yaw,
        0.01,
        0.01,
        0.01  # angular speeds
    )


def send_global_position(time_boot_ms, lat, lon, alt):
    master.mav.global_position_int_send(
        time_boot_ms,  # time_boot_ms
        int(lat * 1e7),
        int(lon * 1e7),
        int(alt * 1000),  # mm
        int(alt * 1000),  # relative alt
        0,
        0,
        0,
        0)


# Simulate changing values
t = 0
last_update = time.time()

while True:
    current_time = time.time()
    time_since_boot_ms = int((current_time - start_time) * 1000) % (2**32)

    send_heartbeat()
    # print("Heartbeat sent")

    # Update t based on real elapsed time for consistent motion
    dt = current_time - last_update
    last_update = current_time
    t += dt

    roll = math.sin(t) * 0.1
    pitch = math.cos(t) * 0.1
    yaw = math.sin(t / 2) * 0.2
    send_attitude(time_since_boot_ms, roll, pitch, yaw)
    # print("Attitude sent")
    # print("[Simulator] Attitude:", roll, pitch, yaw)

    lat = 37.7749 + math.sin(t / 10) * 0.001
    lon = -122.4194 + math.cos(t / 10) * 0.001
    alt = 10 + math.sin(t / 5) * 2
    send_global_position(time_since_boot_ms, lat, lon, alt)
    # print("Position sent")

    time.sleep(6)
