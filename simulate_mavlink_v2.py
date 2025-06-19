# simulate_mavlink_v2.py
import math
import time

from pymavlink import mavutil

master = mavutil.mavlink_connection('udpout:127.0.0.1:14550')

start_time = time.time()
t = 0
battery_percentage = 100
waypoint = 0

def send_heartbeat():
    master.mav.heartbeat_send(
        type=mavutil.mavlink.MAV_TYPE_QUADROTOR,
        autopilot=mavutil.mavlink.MAV_AUTOPILOT_ARDUPILOTMEGA,
        base_mode=0,
        custom_mode=0,
        system_status=mavutil.mavlink.MAV_STATE_ACTIVE
    )

def send_sys_status():
    global battery_percentage
    battery_percentage = max(battery_percentage - 0.05, 0)  # simulate slow battery drain

    master.mav.sys_status_send(
        onboard_control_sensors_present=0b111111111,
        onboard_control_sensors_enabled=0b111111111,
        onboard_control_sensors_health=0b111111111,
        load=500,  # 50%
        voltage_battery=12000,  # 12V (in mV)
        current_battery=3000,  # 3A (in mA)
        battery_remaining=int(battery_percentage),
        drop_rate_comm=0,
        errors_comm=0,
        errors_count1=0,
        errors_count2=0,
        errors_count3=0,
        errors_count4=0
    )

def send_gps_raw_int(satellites_visible):
    master.mav.gps_raw_int_send(
        time_usec=int((time.time() - start_time) * 1e6),
        fix_type=3,
        lat=int((37.7749 + math.sin(t / 20) * 0.001) * 1e7),
        lon=int((-122.4194 + math.cos(t / 20) * 0.001) * 1e7),
        alt=int((10 + math.sin(t / 5) * 2) * 1000),
        eph=100,
        epv=100,
        vel=200,
        cog=0,
        satellites_visible=satellites_visible,
        alt_ellipsoid=0,
        h_acc=0,
        v_acc=0,
        vel_acc=0,
        hdg_acc=0
    )

def send_attitude(roll, pitch, yaw):
    master.mav.attitude_send(
        int((time.time() - start_time) * 1000),
        roll, pitch, yaw,
        0.01, 0.01, 0.01
    )

def send_vfr_hud(airspeed, groundspeed, climb_rate):
    master.mav.vfr_hud_send(
        airspeed=airspeed,
        groundspeed=groundspeed,
        heading=90,
        throttle=75,
        alt=10 + math.sin(t / 5) * 2,
        climb=climb_rate
    )

def send_position():
    master.mav.global_position_int_send(
        int((time.time() - start_time) * 1000),
        int((37.7749 + math.sin(t / 10) * 0.001) * 1e7),
        int((-122.4194 + math.cos(t / 10) * 0.001) * 1e7),
        int((10 + math.sin(t / 5) * 2) * 1000),
        int((10 + math.sin(t / 5) * 2) * 1000),
        0, 0, 0, 0
    )

def send_mission_current(current):
    master.mav.mission_current_send(current)

def send_rc_channels():
    master.mav.rc_channels_raw_send(
        time_boot_ms=int((time.time() - start_time) * 1000),
        port=0,
        chan1_raw=1500,
        chan2_raw=1500,
        chan3_raw=1600,
        chan4_raw=1400,
        chan5_raw=1300,
        chan6_raw=1200,
        chan7_raw=1100,
        chan8_raw=1000,
        rssi=255
    )

def send_statustext(text):
    master.mav.statustext_send(
        severity=4,  # INFO
        text=text.encode("utf-8")
    )

# Start loop
sat_counter = 10
while True:
    t += 0.2
    send_heartbeat()
    send_sys_status()
    # send_gps_raw_int(satellites_visible=int(8 + 2 * math.sin(t)))
    send_attitude(math.sin(t) * 0.1, math.cos(t) * 0.1, math.sin(t / 2) * 0.2)
    send_vfr_hud(airspeed=10, groundspeed=8, climb_rate=0.5)
    send_position()
    send_mission_current(waypoint)

    if int(t) % 30 == 0:
        waypoint += 1
        send_statustext(f"Reached WP{waypoint}")

    send_rc_channels()

    time.sleep(0.2)