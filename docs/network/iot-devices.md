# IoT Device Categories and Network Assignments

## Overview

This document catalogs all IoT device types deployed in the property management network, their network assignments, communication requirements, and integration specifications.

## Device Categories

### 1. HVAC and Climate Control (VLAN 10)

#### 1.1 Smart Thermostats
**Example Models**: Nest, Ecobee, Honeywell Home
- **Network**: 10.X.10.Y (VLAN 10)
- **Protocols**: WiFi (2.4/5 GHz), Matter, Thread
- **Communication**:
  - Cloud API (manufacturer servers)
  - Local MQTT for monitoring
  - API polling every 5 minutes
- **Ports Required**:
  - Outbound: 443 (HTTPS), 8883 (MQTT/TLS)
- **Power**: 24VAC from HVAC system or batteries
- **Data Points**:
  - Current temperature
  - Target temperature
  - Humidity
  - Mode (heat/cool/auto)
  - Fan status
  - Schedule

#### 1.2 HVAC Controllers
**Example Models**: Venstar, Trane, Carrier
- **Network**: 10.X.10.Y (VLAN 10)
- **Protocols**: BACnet/IP, Modbus TCP, proprietary
- **Communication**:
  - Direct HVAC unit control
  - Monitoring to management VLAN
  - Alarm notifications
- **Ports Required**:
  - BACnet: UDP 47808
  - Modbus: TCP 502
- **Power**: 24VAC or 120VAC
- **Data Points**:
  - Operating status
  - Run time hours
  - Fault codes
  - Energy consumption
  - Filter status

#### 1.3 Air Quality Sensors
**Example Models**: Awair, Airthings, Foobot
- **Network**: 10.X.10.Y (VLAN 10)
- **Protocols**: WiFi, Zigbee, Z-Wave
- **Communication**:
  - Cloud API or local hub
  - Data push every 5-15 minutes
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: USB 5V or batteries
- **Data Points**:
  - CO2 levels
  - VOC (volatile organic compounds)
  - PM2.5 particulates
  - Temperature
  - Humidity

#### 1.4 Window/Door Sensors (for HVAC efficiency)
**Example Models**: Aqara, Fibaro, Sensibo
- **Network**: 10.X.10.Y via Zigbee/Z-Wave hub
- **Protocols**: Zigbee, Z-Wave, WiFi
- **Communication**:
  - Event-based (open/close)
  - Battery status reports
- **Power**: CR2032 batteries (2+ year life)
- **Integration**: Trigger HVAC adjustments when windows open

---

### 2. Kitchen Appliances (VLAN 20)

#### 2.1 Smart Refrigerators
**Example Models**: Samsung Family Hub, LG ThinQ, GE Profile
- **Network**: 10.X.20.Y (VLAN 20)
- **Protocols**: WiFi (2.4/5 GHz), SmartThings, LG ThinQ API
- **Communication**:
  - Cloud API for monitoring
  - Push notifications for alerts
  - Remote control (temperature adjustment)
- **Ports Required**:
  - Outbound: 443 (HTTPS), 8001 (SmartThings)
- **Power**: 120VAC standard outlet
- **Data Points**:
  - Internal temperature
  - Door open/close events
  - Filter status
  - Energy consumption
  - Diagnostic codes

#### 2.2 Smart Ovens/Ranges
**Example Models**: GE, Whirlpool, Bosch
- **Network**: 10.X.20.Y (VLAN 20)
- **Protocols**: WiFi, proprietary apps
- **Communication**:
  - Cloud API
  - Safety alerts (gas leak, overheating)
  - Remote monitoring only (no remote start for safety)
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: 240VAC (electric) or 120VAC (gas)
- **Data Points**:
  - Operating status
  - Temperature
  - Timer status
  - Self-clean cycle
  - Error codes

#### 2.3 Smart Dishwashers
**Example Models**: Bosch, Miele, GE
- **Network**: 10.X.20.Y (VLAN 20)
- **Protocols**: WiFi
- **Communication**:
  - Cycle status updates
  - Maintenance alerts
  - Detergent level (some models)
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: 120VAC
- **Data Points**:
  - Cycle status
  - Time remaining
  - Energy/water usage
  - Filter status

#### 2.4 Garbage Disposals (Smart)
**Example Models**: InSinkErator Evolution, Moen GX
- **Network**: 10.X.20.Y (VLAN 20)
- **Protocols**: WiFi, Bluetooth
- **Communication**:
  - Operational status
  - Jam detection
  - Usage statistics
- **Power**: 120VAC hardwired
- **Data Points**:
  - Run time
  - Current draw
  - Fault detection

---

### 3. Laundry Systems (VLAN 30)

#### 3.1 Commercial Washers
**Example Models**: Speed Queen, Electrolux, Maytag Commercial
- **Network**: 10.X.30.1-50 (VLAN 30)
- **Protocols**: Modbus TCP, proprietary APIs, cellular (some models)
- **Communication**:
  - Cycle status and availability
  - Payment system integration
  - Maintenance alerts
  - Energy monitoring
- **Ports Required**:
  - Modbus: TCP 502
  - HTTPS: 443
- **Power**: 120V or 240V depending on model
- **Data Points**:
  - Available/in-use status
  - Cycle time remaining
  - Coin/card payment status
  - Error codes
  - Water/energy consumption

#### 3.2 Commercial Dryers
**Example Models**: Speed Queen, Electrolux, Huebsch
- **Network**: 10.X.30.51-100 (VLAN 30)
- **Protocols**: Modbus TCP, proprietary APIs
- **Communication**:
  - Same as washers
  - Lint trap alerts
  - Temperature monitoring
- **Ports Required**:
  - Modbus: TCP 502
  - HTTPS: 443
- **Power**: 240V (electric) or 120V (gas)
- **Data Points**:
  - Available/in-use status
  - Cycle time remaining
  - Temperature
  - Lint sensor status
  - Energy consumption

#### 3.3 Payment Terminals
**Example Models**: FasCard, LaundryCard, CCI
- **Network**: 10.X.30.101-120 (VLAN 30)
- **Protocols**: Ethernet, WiFi, cellular backup
- **Communication**:
  - Payment processing (PCI DSS compliant)
  - Transaction logging
  - Account management
  - Remote balance inquiry
- **Ports Required**:
  - Outbound: 443 (HTTPS), payment gateway specific
- **Security**:
  - Isolated payment network segment
  - Encrypted transactions
  - No inbound connections
- **Power**: 120VAC with battery backup
- **Data Points**:
  - Transaction history
  - Card/account balances
  - Machine assignment
  - Revenue reporting

#### 3.4 Laundry Room Sensors
**Example Models**: Occupancy sensors, humidity monitors
- **Network**: 10.X.30.121-130 (VLAN 30)
- **Protocols**: Zigbee, Z-Wave via hub
- **Communication**:
  - Occupancy detection (for mobile app notifications)
  - Humidity levels (ventilation control)
  - Temperature monitoring
- **Power**: Battery or PoE
- **Data Points**:
  - Room occupancy
  - Relative humidity
  - Temperature

---

### 4. Security and Access Control (VLAN 40)

#### 4.1 Smart Door Locks
**Example Models**: August, Schlage Encode, Yale Assure
- **Network**: 10.X.40.201+ (VLAN 40)
- **Protocols**: WiFi, Z-Wave Plus, Zigbee
- **Communication**:
  - Lock/unlock events
  - Access code management
  - Battery status
  - Tamper alerts
- **Ports Required**:
  - Outbound: 443 (HTTPS), 8883 (MQTT/TLS)
- **Power**: 4x AA batteries (6-12 month life)
- **Data Points**:
  - Lock state (locked/unlocked)
  - Access logs (who, when)
  - Battery level
  - Auto-lock status

#### 4.2 IP Security Cameras
**Example Models**: Hikvision, Dahua, Axis, Ubiquiti
- **Network**: 10.X.40.50-199 (VLAN 40)
- **Protocols**: ONVIF, RTSP, proprietary
- **Communication**:
  - Video streams to NVR
  - Motion detection events
  - Audio (two-way on some models)
  - PTZ control
- **Ports Required**:
  - RTSP: TCP 554
  - ONVIF: TCP 80, 8000
  - HTTPS: 443
- **Power**: PoE (802.3af/at), 12V DC
- **Bandwidth**:
  - 1080p: 2-4 Mbps per camera
  - 4K: 8-12 Mbps per camera
- **Storage**: Centralized NVR with 30-90 day retention

#### 4.3 Network Video Recorder (NVR)
**Network**: 10.X.40.200 (VLAN 40)
- **Protocols**: ONVIF, RTSP client
- **Communication**:
  - Receives streams from all cameras
  - Web interface for viewing (HTTPS)
  - Mobile app access
  - Cloud backup (optional)
- **Storage**:
  - RAID configuration
  - 8-64 TB depending on camera count
  - H.265 compression
- **Power**: 120VAC with UPS backup

#### 4.4 Access Control Panels
**Example Models**: HID, Salto, Brivo
- **Network**: 10.X.40.1-30 (VLAN 40)
- **Protocols**: Wiegand (to readers), Ethernet to controller
- **Communication**:
  - Badge/credential validation
  - Door status monitoring
  - Access logs
  - Remote unlock/lock
- **Ports Required**:
  - Proprietary TCP ports (varies by manufacturer)
- **Power**: 12V DC with battery backup

#### 4.5 Intercom Systems
**Example Models**: Aiphone, ButterflyMX, 2N
- **Network**: 10.X.40.31-40 (VLAN 40)
- **Protocols**: SIP (VoIP), proprietary
- **Communication**:
  - Video/audio calls to tenant mobile apps
  - Remote door unlock
  - Visitor logs with photos
- **Ports Required**:
  - SIP: UDP 5060-5061
  - RTP: UDP 10000-20000
  - HTTPS: 443
- **Power**: PoE or 12V DC

---

### 5. Environmental Sensors (VLAN 50)

#### 5.1 Motion Sensors
**Example Models**: Philips Hue Motion, Aqara, SmartThings
- **Network**: 10.X.50.Y via hub (VLAN 50)
- **Protocols**: Zigbee, Z-Wave
- **Communication**:
  - Motion events (immediate)
  - No motion timeout
  - Light level sensing
- **Power**: CR2450 batteries (2 year life)
- **Use Cases**:
  - Common area lighting automation
  - Occupancy detection
  - Security integration

#### 5.2 Temperature/Humidity Sensors
**Example Models**: SensorPush, Govee, Aqara
- **Network**: 10.X.50.Y (VLAN 50)
- **Protocols**: WiFi, Bluetooth, Zigbee
- **Communication**:
  - Periodic readings (5-30 min)
  - Threshold alerts
  - Historical data logging
- **Power**: CR2032 or AAA batteries
- **Data Points**:
  - Temperature (°F/°C)
  - Relative humidity (%)
  - Dew point (calculated)

#### 5.3 Light Sensors
**Example Models**: Philips Hue, Lutron, Leviton
- **Network**: 10.X.50.Y via hub (VLAN 50)
- **Protocols**: Zigbee, DALI
- **Communication**:
  - Ambient light levels
  - Daylight harvesting
  - Occupancy integration
- **Power**: Hardwired or battery
- **Use Cases**:
  - Automatic blind control
  - Lighting scene adjustments
  - Energy savings

#### 5.4 Smoke and CO Detectors (Networked)
**Example Models**: Nest Protect, First Alert Onelink
- **Network**: 10.X.50.Y (VLAN 50)
- **Protocols**: WiFi, proprietary mesh
- **Communication**:
  - Alarm events (immediate, high priority)
  - Self-test results
  - Battery status
  - End of life warnings
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: Hardwired 120VAC with battery backup
- **Critical**:
  - QoS priority traffic
  - Redundant alerting (local siren + cloud + property management)
  - Regular testing schedule

---

### 6. Water Management (VLAN 60)

#### 6.1 Leak Detection Sensors
**Example Models**: Flo by Moen, Phyn, LeakSmart
- **Network**: 10.X.60.Y (VLAN 60)
- **Protocols**: WiFi, Zigbee
- **Communication**:
  - Immediate leak alerts
  - Moisture level reporting
  - Battery status
- **Power**: CR123A batteries (1-2 year life)
- **Placement**:
  - Under sinks
  - Near water heaters
  - Washing machine areas
  - Bathrooms
- **Integration**: Trigger water shutoff valves on detection

#### 6.2 Smart Water Shutoff Valves
**Example Models**: Flo by Moen, Dome, Aqara
- **Network**: 10.X.60.240+ (VLAN 60)
- **Protocols**: WiFi, Z-Wave
- **Communication**:
  - Remote open/close control
  - Position feedback
  - Flow rate monitoring
  - Leak detection integration
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: 120VAC or battery backup
- **Critical Features**:
  - Manual override capability
  - Fail-safe positioning (normally open)
  - Anti-freeze protection

#### 6.3 Water Flow Meters
**Example Models**: Flume, StreamLabs
- **Network**: 10.X.60.245+ (VLAN 60)
- **Protocols**: WiFi, LoRaWAN
- **Communication**:
  - Real-time flow data
  - Abnormal usage alerts
  - Leak detection algorithms
  - Usage analytics
- **Installation**: Main water line or per-unit submeter
- **Power**: Batteries (ultrasonic) or PoE (inline)
- **Data Points**:
  - Gallons per minute (GPM)
  - Total usage (daily, monthly)
  - Pressure (some models)

#### 6.4 Sump Pump Monitors
**Example Models**: Zoeller, Wayne, PumpSpy
- **Network**: 10.X.60.242+ (VLAN 60)
- **Protocols**: WiFi, cellular
- **Communication**:
  - Pump run cycles
  - Water level in sump
  - Pump failure alerts
  - Battery backup status
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: 120VAC
- **Critical Alerts**:
  - High water level
  - Pump not running when needed
  - Power failure

#### 6.5 Hot Water Heater Monitors
**Example Models**: Rheem EcoNet, Bradford White AeroTherm
- **Network**: 10.X.60.Y (VLAN 60)
- **Protocols**: WiFi
- **Communication**:
  - Temperature monitoring
  - Energy usage tracking
  - Maintenance alerts
  - Remote temperature adjustment
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: 120VAC (electric heater) or battery (monitoring only)

---

### 7. Lighting and Energy (VLAN 70)

#### 7.1 Smart Light Bulbs/Strips
**Example Models**: Philips Hue, LIFX, Nanoleaf
- **Network**: 10.X.70.Y via bridge (VLAN 70)
- **Protocols**: Zigbee, WiFi
- **Communication**:
  - On/off, dimming, color control
  - Scheduling and scenes
  - Energy usage
- **Power**: Standard light fixtures (9-15W per bulb)
- **Use Cases**:
  - Common area ambiance
  - Hallway safety lighting
  - Outdoor area lighting

#### 7.2 Smart Switches and Dimmers
**Example Models**: Lutron Caseta, Leviton Decora, TP-Link Kasa
- **Network**: 10.X.70.Y (VLAN 70)
- **Protocols**: WiFi, Zigbee, proprietary (Lutron Clear Connect)
- **Communication**:
  - Switch state
  - Dimmer level
  - Scheduling
  - Scene control
- **Power**: Hardwired (requires neutral wire in most cases)
- **Installation**: Replaces traditional wall switches

#### 7.3 Smart Plugs (Energy Monitoring)
**Example Models**: TP-Link Kasa, Belkin Wemo, Aqara
- **Network**: 10.X.70.Y (VLAN 70)
- **Protocols**: WiFi, Zigbee
- **Communication**:
  - On/off control
  - Energy consumption (W, kWh)
  - Scheduling
  - Away mode
- **Power**: Standard 120VAC outlets (15A max)
- **Use Cases**:
  - Common area appliances
  - Holiday lighting
  - Equipment monitoring

#### 7.4 Whole-Home Energy Monitors
**Example Models**: Sense, Emporia Vue, Neurio
- **Network**: 10.X.70.250+ (VLAN 70)
- **Protocols**: WiFi
- **Communication**:
  - Real-time power usage
  - Circuit-level monitoring
  - Device detection (AI-based)
  - Solar production (if applicable)
- **Installation**: Electrical panel with CT clamps
- **Ports Required**:
  - Outbound: 443 (HTTPS)
- **Power**: 120VAC circuit
- **Data Points**:
  - Total consumption (W, kWh)
  - Per-circuit usage
  - Power factor
  - Voltage

---

## Device Integration Architecture

### Communication Protocols Summary

| Protocol | Layer | Use Case | Devices |
|----------|-------|----------|---------|
| WiFi (2.4/5GHz) | Physical | Primary connectivity | Most smart devices |
| Zigbee | Physical | Low-power mesh | Sensors, lights, locks |
| Z-Wave | Physical | Low-power mesh | Locks, sensors, switches |
| Thread | Physical | IPv6 mesh (Matter) | Next-gen IoT |
| BACnet/IP | Application | HVAC/building automation | HVAC controllers |
| Modbus TCP | Application | Industrial equipment | Laundry, energy meters |
| MQTT | Application | IoT messaging | All devices (via hub) |
| ONVIF | Application | Camera/NVR | Security cameras |
| RTSP | Application | Video streaming | Cameras to NVR |
| HTTP/HTTPS | Application | Web APIs | Cloud services |

### Hub/Gateway Requirements

**Zigbee Hub:**
- **Models**: Home Assistant Zigbee, Hubitat, SmartThings
- **Network**: 10.X.1.60 (Management VLAN)
- **Channels**: 11, 15, 20, 25 (avoid WiFi overlap)
- **Max Devices**: 65,000 (theoretical), 100-200 (practical)

**Z-Wave Hub:**
- **Models**: Home Assistant Z-Wave, Hubitat, Aeotec
- **Network**: 10.X.1.61 (Management VLAN)
- **Frequency**: 908.42 MHz (US)
- **Max Devices**: 232 per controller

**MQTT Broker:**
- **Software**: Mosquitto, HiveMQ, EMQX
- **Network**: 10.X.1.50 (Management VLAN)
- **Ports**: 1883 (MQTT), 8883 (MQTT/TLS), 9001 (WebSocket)
- **Authentication**: Username/password per device
- **Topics Structure**:
  ```
  property/{property_id}/{device_type}/{device_id}/{metric}
  property/001/hvac/thermostat-101/temperature
  property/001/security/lock-101/state
  ```

### Cloud Service Dependencies

**Required External Access:**
- Manufacturer cloud platforms (device-specific)
- NTP servers (time synchronization): pool.ntp.org
- Firmware update servers (varies by manufacturer)
- Weather APIs (for smart thermostats)
- Payment processing (laundry systems)

**Optional External Access:**
- Voice assistants (Alexa, Google Home) - tenant choice
- IFTTT/automation platforms
- Remote access services

**Security Measures:**
- Whitelist manufacturer domains
- Block outbound to unknown destinations
- Monitor for unusual traffic patterns
- Regular firmware updates

---

## Device Provisioning Workflow

### Standard Installation Process

1. **Physical Installation**
   - Mount/connect device
   - Power on and verify operation

2. **Network Configuration**
   - Assign static IP from appropriate subnet
   - Configure VLAN if hardwired
   - Connect to property WiFi (IoT SSID) or hub

3. **Device Registration**
   - Add to IPAM (IP Address Management) system
   - Record MAC address, serial number, location
   - Create DNS entry (if applicable)

4. **Integration**
   - Configure MQTT/cloud connection
   - Set up monitoring alerts
   - Add to automation rules
   - Test functionality

5. **Documentation**
   - Update network diagram
   - Record credentials securely
   - Note warranty/support information
   - Schedule maintenance

### Decommissioning Process

1. Remove from automation rules
2. Disconnect from network/hub
3. Factory reset device
4. Update IPAM and documentation
5. Archive configuration/logs
6. Recycle or dispose properly

---

## Monitoring and Maintenance

### Health Monitoring

**Per-Device Metrics:**
- Online/offline status
- Last communication timestamp
- Battery level (if applicable)
- Signal strength (WiFi/Zigbee/Z-Wave)
- Firmware version
- Error/warning flags

**Aggregate Metrics:**
- Devices by type and status
- Network bandwidth usage per VLAN
- Alert frequency and resolution time
- Energy consumption trends
- Maintenance request patterns

### Alerting Priorities

**Critical (Immediate Response):**
- Smoke/CO detector alarms
- Water leak detection
- Security breach (forced entry)
- HVAC failure (extreme temperatures)
- Power failure

**High (< 4 hours):**
- Camera offline
- Access control system failure
- Multiple devices offline
- Payment system down

**Medium (< 24 hours):**
- Low battery warnings
- Single device offline
- Unusual energy consumption
- Firmware updates available

**Low (Weekly Review):**
- Preventive maintenance due
- Usage statistics
- Optimization recommendations

---

## Vendor Integration Examples

### Nest Thermostat Integration

**API**: Nest Device Access / Google Smart Home API
**Authentication**: OAuth 2.0
**Rate Limits**: 500 requests per account per hour
**Webhook Events**: Temperature changes, mode changes, online/offline

**Sample API Call:**
```http
GET https://smartdevicemanagement.googleapis.com/v1/enterprises/{project_id}/devices
Authorization: Bearer {access_token}
```

### Ring/SimpliSafe Security Integration

**API**: REST APIs with webhook support
**Authentication**: API key + OAuth
**Video Access**: Limited (privacy considerations)
**Events**: Motion detected, door unlock, alarm trigger

### Samsung SmartThings Integration

**Platform**: SmartThings Cloud / Local
**Protocols**: Zigbee, Z-Wave, WiFi, LAN
**Integration**: REST API, SmartApp webhooks
**Automation**: Rules and scenes via API

---

## Compliance and Privacy

### Data Collection Guidelines

**Tenant-Occupied Units:**
- No video/audio recording inside units
- No granular appliance usage without consent
- Aggregate energy/water data only
- Opt-in for advanced features

**Common Areas:**
- Video surveillance with posted notices
- Audio recording prohibited (except intercoms)
- Motion detection allowed
- Access logs for security purposes

### Data Retention

- **Security video**: 30-90 days
- **Access logs**: 1 year
- **Energy/water usage**: 3 years
- **Maintenance records**: Life of device
- **Incident reports**: 7 years

### GDPR/CCPA Considerations

- Right to access collected data
- Right to deletion (where applicable)
- Purpose limitation (use data only as disclosed)
- Security safeguards (encryption, access control)
- Data breach notification procedures

---

## Future Device Categories

### Planned Additions

**EV Charging Stations:**
- Network: VLAN 80 (new)
- Load management and billing
- Reservation system integration

**Window Automation:**
- Smart blinds/shades
- Emergency open for fire (if code requires)
- Energy efficiency optimization

**Waste Management:**
- Chute sensors (level detection)
- Compactor monitoring
- Recycling compliance tracking

**Fitness/Amenity Spaces:**
- Equipment usage tracking
- Room reservation integration
- Access control

**Package Lockers:**
- Smart parcel boxes
- Notification integration
- Access via mobile app
