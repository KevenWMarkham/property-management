# VLAN Configuration and Security Policies

## Overview

This document provides detailed VLAN configuration specifications, inter-VLAN routing policies, and security rules for the property management network infrastructure.

## VLAN Design Summary

| VLAN ID | Name | Subnet | Purpose | Security Level |
|---------|------|--------|---------|----------------|
| 1 | Management | 10.X.1.0/24 | Network infrastructure, servers | High |
| 10 | HVAC | 10.X.10.0/23 | Climate control systems | Medium-High |
| 20 | Kitchen | 10.X.20.0/23 | Kitchen appliances | Medium |
| 30 | Laundry | 10.X.30.0/24 | Washers, dryers, payment | Medium-High |
| 40 | Security | 10.X.40.0/24 | Cameras, locks, access control | High |
| 50 | Environmental | 10.X.50.0/23 | Sensors (motion, temp, etc.) | Medium |
| 60 | Water | 10.X.60.0/24 | Leak sensors, valves, meters | High |
| 70 | Lighting | 10.X.70.0/24 | Smart lights, energy monitors | Low-Medium |
| 80 | Reserved | 10.X.80.0/21 | Future IoT categories | - |
| 100 | Tenant-WiFi | 10.X.100.0/22 | Tenant wireless devices | Low |
| 200 | Guest-WiFi | 10.X.200.0/22 | Guest/visitor wireless | Low (Isolated) |

---

## VLAN 1: Management Network

### Purpose
Network infrastructure management, servers, controllers, and administrative access.

### Configuration

**IP Addressing:**
- Network: 10.X.1.0/24
- Gateway: 10.X.1.1
- DHCP Range: 10.X.1.100-199 (optional, prefer static)
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- SSH (TCP 22) - encrypted management
- HTTPS (TCP 443) - web interfaces
- SNMP (UDP 161) - monitoring (SNMPv3 only)
- NTP (UDP 123) - time sync
- Syslog (UDP 514) - logging
- MQTT (TCP 1883, 8883) - IoT messaging

**Access Control:**
- Source: Administrator workstations only (via VPN or physical access)
- Authentication: Multi-factor required
- Logging: All access attempts logged

**Security Features:**
- Port security (MAC limiting)
- DHCP snooping
- Dynamic ARP inspection
- IP source guard
- Private VLAN (if supported)

**Switch Port Configuration (Cisco IOS Example):**
```
interface GigabitEthernet0/1
 description Core Switch Management
 switchport mode access
 switchport access vlan 1
 spanning-tree portfast
 spanning-tree bpduguard enable
```

---

## VLAN 10: HVAC and Climate Control

### Purpose
Heating, ventilation, air conditioning systems, thermostats, and air quality sensors.

### Configuration

**IP Addressing:**
- Network: 10.X.10.0/23 (includes 10.X.10.0/24 and 10.X.11.0/24)
- Gateway: 10.X.1.1
- DHCP: Disabled (static assignments only)
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- HTTPS (TCP 443) - cloud APIs
- MQTT (TCP 1883, 8883) - local messaging
- BACnet/IP (UDP 47808) - building automation
- NTP (UDP 123) - time synchronization

**Inter-VLAN Access:**
- **To Management (VLAN 1)**: Limited - monitoring queries only
- **To Environmental (VLAN 50)**: Read-only - temperature correlation
- **To Internet**: Whitelist only - manufacturer cloud services
- **From Tenant/Guest**: Blocked

**QoS Settings:**
- Priority: Medium
- Bandwidth: No specific limit

**Firewall Rules (pfSense/OPNsense Example):**
```
# Allow HVAC to manufacturer cloud (example: Nest, Ecobee)
allow VLAN10 -> WAN proto tcp port 443 dst nest.com, ecobee.com

# Allow HVAC to Management for monitoring
allow VLAN10 -> VLAN1 proto tcp port 1883 dst 10.X.1.50

# Allow HVAC to read Environmental sensors
allow VLAN10 -> VLAN50 proto tcp port 1883

# Block all other inter-VLAN
deny VLAN10 -> VLAN20,30,40,60,70,100,200
```

**Switch Port Configuration:**
```
interface range GigabitEthernet0/10-15
 description HVAC Controllers
 switchport mode access
 switchport access vlan 10
 spanning-tree portfast
```

---

## VLAN 20: Kitchen Appliances

### Purpose
Smart refrigerators, ovens, dishwashers, and other kitchen IoT devices.

### Configuration

**IP Addressing:**
- Network: 10.X.20.0/23
- Gateway: 10.X.1.1
- DHCP: Disabled
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- HTTPS (TCP 443) - cloud APIs
- MQTT (TCP 1883) - local messaging
- NTP (UDP 123)

**Inter-VLAN Access:**
- **To Management (VLAN 1)**: Limited - alerts and monitoring
- **To Internet**: Whitelist only - manufacturer domains
- **All others**: Blocked

**Security Considerations:**
- Appliances often have poor security
- Limit internet access to essential services
- Monitor for unusual traffic patterns
- Isolate from critical systems

**Firewall Rules:**
```
# Allow kitchen devices to manufacturer clouds
allow VLAN20 -> WAN proto tcp port 443 dst samsung.com, lg.com, ge.com

# Allow kitchen to Management for alerts
allow VLAN20 -> VLAN1 proto tcp port 1883 dst 10.X.1.50

# Block everything else
deny VLAN20 -> VLAN10,30,40,50,60,70,100,200
```

---

## VLAN 30: Laundry and Utility

### Purpose
Commercial washers, dryers, payment systems, and laundry room monitoring.

### Configuration

**IP Addressing:**
- Network: 10.X.30.0/24
- Gateway: 10.X.1.1
- DHCP: Disabled
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- HTTPS (TCP 443) - cloud APIs, payment processing
- Modbus TCP (TCP 502) - industrial equipment
- MQTT (TCP 1883, 8883)
- NTP (UDP 123)

**Inter-VLAN Access:**
- **To Management (VLAN 1)**: Full - payment and status monitoring
- **To Internet**: Whitelist only - payment gateways, manufacturer clouds
- **All others**: Blocked

**Payment Security:**
- Separate micro-segmentation for payment terminals
- PCI DSS compliance required
- No inbound connections
- Encrypted payment data only
- Regular security audits

**Firewall Rules:**
```
# Payment terminals to payment gateway (PCI DSS segment)
allow VLAN30 src 10.X.30.101-120 -> WAN proto tcp port 443 dst paymentgateway.com

# Laundry equipment to manufacturer cloud
allow VLAN30 src 10.X.30.1-100 -> WAN proto tcp port 443,502 dst speedqueen.com

# Laundry to Management
allow VLAN30 -> VLAN1 proto tcp port 1883 dst 10.X.1.50

# Block inter-VLAN
deny VLAN30 -> VLAN10,20,40,50,60,70,100,200
```

**Additional Payment Terminal Rules:**
```
# Strict egress filtering for payment devices
allow VLAN30 src 10.X.30.101-120 -> WAN proto tcp port 443 dst <payment-processor-IPs>
deny VLAN30 src 10.X.30.101-120 -> any
log all denied traffic from payment terminals
```

---

## VLAN 40: Security and Access Control

### Purpose
IP cameras, NVR, smart locks, access control panels, intercoms.

### Configuration

**IP Addressing:**
- Network: 10.X.40.0/24
- Gateway: 10.X.1.1
- DHCP: Disabled
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- HTTPS (TCP 443) - cloud services, web interfaces
- RTSP (TCP 554) - camera streams to NVR
- ONVIF (TCP 80, 8000) - camera discovery/control
- SIP (UDP 5060-5061) - intercom VoIP
- RTP (UDP 10000-20000) - audio/video streams
- MQTT (TCP 1883, 8883)

**Inter-VLAN Access:**
- **To Management (VLAN 1)**: Full - NVR storage, monitoring
- **To Internet**: Limited - cloud backup (optional), firmware updates
- **To all IoT VLANs**: Blocked (security isolation)
- **From Tenant/Guest**: Blocked (no direct access to cameras/locks)

**QoS Settings:**
- Priority: High (for camera streams and access control)
- Bandwidth reservation: 50% of uplink for camera traffic

**Security Hardening:**
- Change default passwords immediately
- Disable unnecessary services (UPnP, Telnet)
- Firmware updates on regular schedule
- Certificate-based authentication where possible
- Segment cameras from locks/access control

**Firewall Rules:**
```
# Cameras to NVR
allow VLAN40 src 10.X.40.50-199 -> VLAN40 dst 10.X.40.200 proto tcp port 554,80

# NVR to cameras (ONVIF control)
allow VLAN40 src 10.X.40.200 -> VLAN40 dst 10.X.40.50-199 proto tcp port 80,8000

# Smart locks to cloud (August, Yale, etc.)
allow VLAN40 src 10.X.40.201-250 -> WAN proto tcp port 443,8883 dst <lock-manufacturer-domains>

# Intercoms to SIP server / mobile apps
allow VLAN40 src 10.X.40.31-40 -> WAN proto udp port 5060-5061,10000-20000

# Management access to security devices
allow VLAN1 -> VLAN40 proto tcp port 443,80,22

# Block security VLAN from accessing other IoT
deny VLAN40 -> VLAN10,20,30,50,60,70,100,200

# Block tenants from accessing security directly
deny VLAN100,200 -> VLAN40
```

**Switch Port Configuration:**
```
interface range GigabitEthernet0/20-35
 description IP Cameras
 switchport mode access
 switchport access vlan 40
 power inline auto
 spanning-tree portfast
 storm-control broadcast level 10.00
```

---

## VLAN 50: Environmental Sensors

### Purpose
Motion sensors, temperature/humidity monitors, light sensors, air quality.

### Configuration

**IP Addressing:**
- Network: 10.X.50.0/23
- Gateway: 10.X.1.1
- DHCP: Disabled (static via hub assignment)
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- HTTPS (TCP 443) - cloud services
- MQTT (TCP 1883, 8883) - primary protocol
- Zigbee/Z-Wave (via hub, not IP-based)
- NTP (UDP 123)

**Inter-VLAN Access:**
- **To Management (VLAN 1)**: Full - sensor data aggregation
- **To HVAC (VLAN 10)**: Read-only - temperature correlation
- **To Lighting (VLAN 70)**: Motion triggering lights
- **To Internet**: Whitelist only - limited cloud services
- **All others**: Blocked

**QoS Settings:**
- Priority: Low (non-critical data)
- Exception: Smoke/CO detectors = High priority

**Firewall Rules:**
```
# Sensors to Management MQTT broker
allow VLAN50 -> VLAN1 proto tcp port 1883,8883 dst 10.X.1.50

# Sensors to cloud (limited manufacturers)
allow VLAN50 -> WAN proto tcp port 443 dst aqara.com, smartthings.com

# Allow HVAC to read sensor data
allow VLAN10 -> VLAN50 proto tcp port 1883

# Allow lighting automation from motion sensors
allow VLAN50 -> VLAN70 proto tcp port 1883

# Block all other inter-VLAN
deny VLAN50 -> VLAN20,30,40,60,100,200
```

**Critical Sensor Rules (Smoke/CO):**
```
# High priority QoS for life-safety sensors
qos policy LIFE_SAFETY
 class SMOKE_CO
  priority level 1
  bandwidth percent 10

# Apply to smoke/CO detector traffic (port or DSCP marking)
```

---

## VLAN 60: Water Management

### Purpose
Leak sensors, shutoff valves, water meters, sump pump monitors.

### Configuration

**IP Addressing:**
- Network: 10.X.60.0/24
- Gateway: 10.X.1.1
- DHCP: Disabled
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- HTTPS (TCP 443) - cloud alerts
- MQTT (TCP 1883, 8883) - local control
- NTP (UDP 123)

**Inter-VLAN Access:**
- **To Management (VLAN 1)**: Full - critical alerts and shutoff control
- **To Internet**: Limited - leak alert notifications
- **All others**: Blocked

**QoS Settings:**
- Priority: High (water damage prevention is critical)
- Leak alerts should have minimal latency

**Redundancy:**
- Dual alert paths (MQTT + cloud)
- Local shutoff capability (no internet dependency)
- Battery backup for critical sensors

**Firewall Rules:**
```
# Leak sensors to Management
allow VLAN60 -> VLAN1 proto tcp port 1883,8883 dst 10.X.1.50

# Shutoff valves to Management (control)
allow VLAN1 -> VLAN60 dst 10.X.60.240 proto tcp port 443,1883

# Water devices to cloud (Flo, Phyn, etc.)
allow VLAN60 -> WAN proto tcp port 443,8883 dst flo.com, phyn.com

# Block all other inter-VLAN
deny VLAN60 -> VLAN10,20,30,40,50,70,100,200
```

**Switch Port Configuration:**
```
interface GigabitEthernet0/40
 description Main Water Shutoff Valve
 switchport mode access
 switchport access vlan 60
 spanning-tree portfast
 # Consider UPS backup for this switch port
```

---

## VLAN 70: Lighting and Energy

### Purpose
Smart lights, switches, dimmers, energy monitors.

### Configuration

**IP Addressing:**
- Network: 10.X.70.0/24
- Gateway: 10.X.1.1
- DHCP: Disabled (hub-assigned)
- DNS: 10.X.1.53, 10.X.1.54

**Allowed Protocols:**
- HTTPS (TCP 443) - cloud services
- MQTT (TCP 1883) - local control
- Zigbee/Z-Wave (via hub)
- NTP (UDP 123)

**Inter-VLAN Access:**
- **To Management (VLAN 1)**: Full - energy monitoring data
- **From Environmental (VLAN 50)**: Limited - motion-triggered lighting
- **To Internet**: Whitelist only - manufacturer clouds
- **All others**: Blocked

**QoS Settings:**
- Priority: Low (non-critical)
- Lighting control should be sub-second response

**Firewall Rules:**
```
# Lighting to Management
allow VLAN70 -> VLAN1 proto tcp port 1883 dst 10.X.1.50

# Lighting to cloud (Philips Hue, LIFX, etc.)
allow VLAN70 -> WAN proto tcp port 443 dst meethue.com, lifx.com

# Motion sensors can trigger lights
allow VLAN50 -> VLAN70 proto tcp port 1883

# Block all other inter-VLAN
deny VLAN70 -> VLAN10,20,30,40,60,100,200
```

---

## VLAN 100: Tenant WiFi

### Purpose
Wireless network for tenant-owned devices (phones, laptops, tablets, etc.).

### Configuration

**IP Addressing:**
- Network: 10.X.100.0/22 (1,024 usable IPs)
- Gateway: 10.X.1.1
- DHCP: 10.X.100.10 - 10.X.103.254
- DNS: 10.X.1.53, 10.X.1.54 (or public: 1.1.1.1, 8.8.8.8)

**Wireless Settings:**
- SSID: `Property-[Name]-WiFi` (visible)
- Security: WPA3/WPA2 mixed mode
- Password: Unique per property (or per unit if desired)
- Band steering: Prefer 5GHz for capable clients
- Client isolation: Enabled (clients can't see each other)

**Allowed Protocols:**
- All outbound to internet (with content filtering optional)
- Block inbound from WAN
- Block NetBIOS, SMB (prevent lateral movement)

**Inter-VLAN Access:**
- **To Internet**: Full access (with rate limiting)
- **To Management (VLAN 1)**: Blocked
- **To all IoT VLANs**: Blocked (security isolation)
- **From IoT VLANs**: Blocked

**QoS Settings:**
- Priority: Medium
- Per-client rate limiting: 100 Mbps download, 50 Mbps upload
- Total VLAN bandwidth cap: 80% of WAN capacity

**Security Features:**
- Client isolation (clients can't communicate with each other)
- Content filtering (optional): block malware, adult content
- DPI (Deep Packet Inspection) for anomaly detection
- Session timeout: 24 hours (re-authenticate)

**Firewall Rules:**
```
# Allow tenant WiFi to internet only
allow VLAN100 -> WAN proto any

# Block access to RFC1918 addresses (except internet gateway)
deny VLAN100 -> 10.0.0.0/8 except 10.X.1.1
deny VLAN100 -> 172.16.0.0/12
deny VLAN100 -> 192.168.0.0/16

# Block multicast/broadcast
deny VLAN100 -> 224.0.0.0/4
deny VLAN100 -> 255.255.255.255

# Block common exploits
deny VLAN100 -> any proto tcp,udp port 135-139,445 (SMB/NetBIOS)
deny VLAN100 -> any proto tcp port 23 (Telnet)

# Rate limiting per client (iptables example)
iptables -A FORWARD -i vlan100 -m limit --limit 100mbit/s --limit-burst 120mbit -j ACCEPT
```

**Access Point Configuration (Ubiquiti/Cisco Example):**
```
wlan Tenant-WiFi
 ssid Property-Name-WiFi
 vlan 100
 security wpa3 wpa2
 client-isolation enable
 band-steering prefer-5ghz
 dtim-period 1
 beacon-interval 100
```

---

## VLAN 200: Guest WiFi

### Purpose
Temporary wireless access for guests and visitors.

### Configuration

**IP Addressing:**
- Network: 10.X.200.0/22
- Gateway: 10.X.1.1
- DHCP: 10.X.200.10 - 10.X.203.254
- DNS: Public only (1.1.1.1, 8.8.8.8)

**Wireless Settings:**
- SSID: `Property-[Name]-Guest` (visible)
- Security: Open with captive portal OR WPA2 with simple password
- Band steering: Prefer 5GHz
- Client isolation: Enabled

**Captive Portal:**
- URL: http://10.X.200.1
- Terms of service acceptance required
- Contact info collection (optional, email/phone)
- Session duration: 24 hours
- Voucher codes (optional, for time-limited access)

**Allowed Protocols:**
- HTTPS/HTTP to internet only
- DNS queries

**Inter-VLAN Access:**
- **To Internet**: Full (with aggressive rate limiting)
- **To all other VLANs**: Completely blocked

**QoS Settings:**
- Priority: Lowest
- Per-client rate limiting: 25 Mbps download, 10 Mbps upload
- Total VLAN bandwidth cap: 20% of WAN capacity

**Security Features:**
- Aggressive client isolation
- Bandwidth throttling
- Content filtering (block malware, torrents, known bad sites)
- Session timeout: 4 hours idle, 24 hours absolute
- Captive portal with terms

**Firewall Rules:**
```
# Allow guest to internet only (HTTP/HTTPS)
allow VLAN200 -> WAN proto tcp port 80,443
allow VLAN200 -> WAN proto udp port 53 (DNS)

# Redirect to captive portal (before authentication)
redirect VLAN200 proto tcp port 80 -> 10.X.200.1:8080

# Block everything else
deny VLAN200 -> 10.0.0.0/8
deny VLAN200 -> 172.16.0.0/12
deny VLAN200 -> 192.168.0.0/16
deny VLAN200 -> any proto tcp,udp port 25,135-139,445

# Extremely strict rate limiting
iptables -A FORWARD -i vlan200 -m limit --limit 25mbit/s -j ACCEPT
iptables -A FORWARD -i vlan200 -j DROP
```

---

## Inter-VLAN Routing Matrix

| Source → Destination | Mgmt | HVAC | Kitchen | Laundry | Security | Env | Water | Light | Tenant | Guest | Internet |
|----------------------|------|------|---------|---------|----------|-----|-------|-------|--------|-------|----------|
| **Management (1)** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✗ | ✗ | ✓ |
| **HVAC (10)** | Limited | ✓ | ✗ | ✗ | ✗ | Read | ✗ | ✗ | ✗ | ✗ | Whitelist |
| **Kitchen (20)** | Limited | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Whitelist |
| **Laundry (30)** | Limited | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | Whitelist |
| **Security (40)** | Limited | ✗ | ✗ | ✗ | ✓* | ✗ | ✗ | ✗ | ✗ | ✗ | Limited |
| **Environmental (50)** | ✓ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | Limited | ✗ | ✗ | Whitelist |
| **Water (60)** | ✓ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | ✗ | Limited |
| **Lighting (70)** | Limited | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✓ | ✗ | ✗ | Whitelist |
| **Tenant WiFi (100)** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗** | ✗ | ✓ |
| **Guest WiFi (200)** | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗ | ✗** | Limited |

**Legend:**
- ✓ = Full access
- Limited = Specific ports/protocols only
- Read = Read-only data queries
- Whitelist = Specific destinations only
- ✗ = Blocked
- * = Cameras to NVR only, locks isolated
- ** = Client isolation enabled (can't see other clients)

---

## VLAN Trunking

### Trunk Links Between Switches

**Cisco IOS Configuration:**
```
interface GigabitEthernet0/48
 description Trunk to Distribution Switch
 switchport mode trunk
 switchport trunk allowed vlan 1,10,20,30,40,50,60,70,100,200
 switchport trunk native vlan 999  # unused VLAN for security
 spanning-tree guard root
```

**802.1Q Tagging:**
- All VLANs tagged except native VLAN
- Native VLAN set to unused VLAN (not VLAN 1)
- DTP (Dynamic Trunking Protocol) disabled for security

---

## VLAN Security Best Practices

### General Hardening

1. **VLAN Hopping Prevention:**
   - Disable DTP (Dynamic Trunking Protocol)
   - Set native VLAN to unused VLAN
   - Explicitly configure access ports

2. **Spanning Tree Protection:**
   - Enable BPDU guard on access ports
   - Enable root guard on distribution uplinks
   - Use Rapid PVST+ or MST

3. **Port Security:**
   - MAC address limiting (1-3 MACs per port)
   - Sticky MAC learning for known devices
   - Violation action: shutdown or restrict

4. **DHCP Security:**
   - DHCP snooping on all VLANs
   - Trusted ports only on uplinks to DHCP server
   - Rate limiting DHCP requests

5. **ARP Security:**
   - Dynamic ARP Inspection (DAI)
   - Validate src-mac, dst-mac, IP
   - Trusted ports on uplinks only

6. **IP Source Guard:**
   - Prevent IP spoofing
   - Bind IP to MAC via DHCP snooping table

### Example Cisco Security Configuration

```
! Global settings
ip dhcp snooping
ip dhcp snooping vlan 10,20,30,40,50,60,70,100,200
ip arp inspection vlan 10,20,30,40,50,60,70,100,200
ip arp inspection validate src-mac dst-mac ip

! Access port configuration
interface range GigabitEthernet0/1-46
 switchport mode access
 switchport port-security
 switchport port-security maximum 3
 switchport port-security violation restrict
 switchport port-security aging time 2
 ip dhcp snooping limit rate 10
 ip verify source
 spanning-tree portfast
 spanning-tree bpduguard enable

! Uplink/trunk port configuration
interface GigabitEthernet0/48
 description Trunk to Core
 switchport mode trunk
 switchport trunk allowed vlan 1,10,20,30,40,50,60,70,100,200
 ip dhcp snooping trust
 ip arp inspection trust
 spanning-tree guard root
```

---

## QoS Configuration

### Traffic Classification

**Priority Levels:**
1. **Critical** (Expedited Forwarding):
   - Smoke/CO alarms
   - Water leak alerts
   - Security alarms
   - VoIP (intercom)

2. **High** (Assured Forwarding 4):
   - Camera streams
   - Access control
   - HVAC control

3. **Medium** (Assured Forwarding 2):
   - Tenant WiFi
   - IoT monitoring data

4. **Low** (Best Effort):
   - Guest WiFi
   - Firmware updates
   - Bulk transfers

### DSCP Marking

| Traffic Type | DSCP | Binary | Decimal | Queue |
|--------------|------|--------|---------|-------|
| Life-safety alarms | EF | 101110 | 46 | 1 (highest) |
| VoIP/Intercom | EF | 101110 | 46 | 1 |
| Camera streams | AF41 | 100010 | 34 | 2 |
| Access control | AF31 | 011010 | 26 | 3 |
| Tenant WiFi | AF21 | 010010 | 18 | 4 |
| IoT data | AF11 | 001010 | 10 | 5 |
| Guest WiFi | BE | 000000 | 0 | 6 (lowest) |

### Example QoS Policy (Cisco)

```
! Class maps
class-map match-any CRITICAL
 match dscp ef
 match access-group name LIFE_SAFETY

class-map match-any HIGH
 match dscp af41 af42
 match vlan 40

class-map match-any MEDIUM
 match dscp af21 af22
 match vlan 100

class-map match-any LOW
 match vlan 200

! Policy map
policy-map WAN_QOS
 class CRITICAL
  priority percent 10
 class HIGH
  bandwidth percent 40
  random-detect dscp-based
 class MEDIUM
  bandwidth percent 30
  random-detect dscp-based
 class LOW
  bandwidth percent 10
  random-detect dscp-based
 class class-default
  bandwidth percent 10
  random-detect

! Apply to WAN interface
interface GigabitEthernet0/0
 description WAN Uplink
 service-policy output WAN_QOS
```

---

## Monitoring and Logging

### VLAN Monitoring

**Metrics to Track:**
- Bandwidth utilization per VLAN
- Device count per VLAN
- Inter-VLAN firewall hits/blocks
- QoS drops and queue depths
- Port errors and discards

**Tools:**
- SNMP monitoring (PRTG, LibreNMS, Zabbix)
- NetFlow/sFlow for traffic analysis
- Syslog aggregation
- SPAN/mirror ports for packet capture

### Logging Configuration

```
! Cisco logging
logging buffered 64000 informational
logging host 10.X.1.70
logging trap notifications
logging source-interface Vlan1
logging facility local6

! Log inter-VLAN denials
access-list 100 deny ip any any log

! Log port security violations
switchport port-security violation restrict
```

---

## Change Management

### VLAN Addition Process

1. **Planning:**
   - Justify new VLAN requirement
   - Assign VLAN ID and subnet
   - Define security policies
   - Update documentation

2. **Implementation:**
   - Configure VLAN on all switches
   - Update trunk allowed lists
   - Configure SVI (switched virtual interface) on L3 switch
   - Update firewall rules
   - Configure DHCP (if needed)
   - Update monitoring

3. **Testing:**
   - Verify connectivity within VLAN
   - Test inter-VLAN routing (allowed paths)
   - Confirm blocked paths are blocked
   - Validate QoS markings
   - Check logging and monitoring

4. **Documentation:**
   - Update network diagrams
   - Update IP address management (IPAM)
   - Document firewall rules
   - Train staff if necessary

### VLAN Modification Process

- Follow change control procedures
- Schedule maintenance window for critical VLANs
- Backup configurations before changes
- Test in lab environment if possible
- Have rollback plan ready
- Monitor after implementation

---

## Disaster Recovery

### VLAN Configuration Backup

**Automated Backups:**
- Daily configuration exports
- Store in version control (Git)
- Offsite backup copy
- Encrypted storage

**Backup Script Example (Cisco):**
```bash
#!/bin/bash
# Backup switch configs via SSH

SWITCHES="10.1.1.10 10.1.1.11 10.1.1.12"
BACKUP_DIR="/backup/network/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR

for SWITCH in $SWITCHES; do
  sshpass -p "$PASSWORD" ssh admin@$SWITCH "show run" > $BACKUP_DIR/$SWITCH.cfg
  sshpass -p "$PASSWORD" ssh admin@$SWITCH "show vlan" > $BACKUP_DIR/$SWITCH-vlan.txt
done

# Commit to git
cd /backup/network
git add .
git commit -m "Daily backup $(date +%Y%m%d)"
git push origin main
```

### Recovery Procedures

**Switch Failure:**
1. Replace failed hardware
2. Restore configuration from backup
3. Verify VLAN database and trunks
4. Test inter-VLAN routing
5. Reconnect devices and verify

**Configuration Corruption:**
1. Identify last known good configuration
2. Console into switch (out-of-band)
3. Erase startup-config
4. Copy backup config to running-config
5. Save and reload
6. Verify operation

---

## Compliance and Auditing

### PCI DSS (Payment Systems)

**Requirements for VLAN 30 (Laundry Payment):**
- Segmentation from all other networks
- Firewall between payment and non-payment VLANs
- No direct internet access (only to payment gateway)
- Logging all access attempts
- Annual penetration testing
- Quarterly vulnerability scans

### NIST Cybersecurity Framework

**Alignment:**
- **Identify**: Asset inventory, VLAN mapping
- **Protect**: ACLs, encryption, port security
- **Detect**: Logging, SIEM integration, anomaly detection
- **Respond**: Incident response plan, VLAN isolation
- **Recover**: Backup/restore procedures, redundancy

### Audit Logs

**Retain for 1 year minimum:**
- VLAN configuration changes
- Firewall rule modifications
- Inter-VLAN denied traffic (samples)
- Port security violations
- Administrative access logs

---

## Future Enhancements

### Planned Improvements

1. **802.1X Authentication:**
   - Per-port authentication for IoT devices
   - RADIUS server integration
   - Dynamic VLAN assignment

2. **Micro-Segmentation:**
   - Per-device firewall rules (identity-based)
   - Zero-trust network access
   - Software-defined perimeter

3. **Network Automation:**
   - Ansible playbooks for VLAN provisioning
   - Terraform for infrastructure as code
   - Automated compliance scanning

4. **Advanced Threat Protection:**
   - IDS/IPS integration (Suricata, Snort)
   - Threat intelligence feeds
   - Behavioral analysis

5. **IPv6 Dual-Stack:**
   - Plan IPv6 address scheme
   - Enable on management VLAN first
   - Gradual rollout to IoT VLANs
