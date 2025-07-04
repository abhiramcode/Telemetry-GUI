# socketio_emitter_async.py
import socketio
import asyncio
import sys, signal
from aiohttp import web
from pymavlink import mavutil

# Create async server
sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

# MAVLink connection
master = mavutil.mavlink_connection('udp:127.0.0.1:14550')

# Global flag and task ref
should_stream = True
background_task = None

# Emit loop
async def emit_loop():
    while should_stream:
        try:
            # print("🚀 Starting to Emit")
            msg = master.recv_match(blocking=False)
            if msg is not None:
                msg_type = msg.get_type()

                if msg_type == 'ATTITUDE':
                    # print("[EMIT]", data)
                    await sio.emit('attitude', {
                        'roll': msg.roll,
                        'pitch': msg.pitch,
                        'yaw': msg.yaw
                    })

                elif msg_type == 'GLOBAL_POSITION_INT':
                    await sio.emit('position', {
                            'lat': msg.lat / 1e7,
                            'lon': msg.lon / 1e7,
                            'alt': msg.alt / 1000
                    })
                
                elif msg_type == 'SYS_STATUS':
                    await sio.emit('battery', {
                            "battery_remaining": msg.battery_remaining,
                            "voltage_battery": msg.voltage_battery / 1000.0,  # volts
                            "current_battery": msg.current_battery / 1000.0,  # amps
                        })
                
                elif msg_type == 'VFR_HUD':
                    await sio.emit('hud', {
                            "airspeed": msg.airspeed,
                            "groundspeed": msg.groundspeed,
                            "throttle": msg.throttle,
                            "alt": msg.alt,
                            "climb": msg.climb,
                        })
                
                elif msg_type == 'GPS_RAW_INT':
                    await sio.emit('gps_status', {
                            "satellites_visible": msg.satellites_visible,
                            "fix_type": msg.fix_type,
                        })

                elif msg_type == 'STATUSTEXT':
                    await sio.emit("log", {
                            "text": msg.text,
                            "severity": msg.severity
                        })

                elif msg_type == 'MISSION_CURRENT':
                    await sio.emit("mission", {
                            "current": msg.seq
                        })

                elif msg_type == 'RC_CHANNELS_RAW':
                    await sio.emit("rc_channels", {
                            "ch1": msg.chan1_raw,
                            "ch2": msg.chan2_raw,
                            "ch3": msg.chan3_raw,
                            "ch4": msg.chan4_raw,
                            "ch5": msg.chan5_raw,
                            "ch6": msg.chan6_raw,
                            "ch7": msg.chan7_raw,
                            "ch8": msg.chan8_raw,
                        })

            await asyncio.sleep(0.05)

        except asyncio.CancelledError:
            print("🛑 emit_loop cancelled")
            break
        except Exception as e:
            print("⚠️ Exception in loop:", e)
            await asyncio.sleep(1)

@sio.event
async def connect(sid, environ): #environ
    print("✅ Client connected:", sid)

@sio.event
async def disconnect(sid):
    print("🛑 Client disconnected:", sid)

async def start_background_tasks(app):
    global background_task
    # app['emit_loop'] = asyncio.create_task(emit_loop())
    background_task = asyncio.create_task(emit_loop())

async def cleanup_background_tasks(app):
    global background_task
    if background_task:
        background_task.cancel()
        try:
            await background_task
        except asyncio.CancelledError:
            print("✅ Background task ended cleanly")

app.on_startup.append(start_background_tasks)
app.on_cleanup.append(cleanup_background_tasks)

# Handle SIGINT (Ctrl+C)
def handle_shutdown(signal_received, frame):
    print("\n👋 Ctrl+C received. Shutting down gracefully...")
    loop = asyncio.get_event_loop()
    loop.create_task(app.shutdown())
    loop.create_task(app.cleanup())
    loop.stop()
    sys.exit(0)

signal.signal(signal.SIGINT, handle_shutdown)

if __name__ == '__main__':
    try:
        print("🚀 Starting Socket.IO Server on Port 5000")
        web.run_app(app, host='0.0.0.0', port=5000)
    except (KeyboardInterrupt, SystemExit):
        print("🛑 Keyboard Exit")