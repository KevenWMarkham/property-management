# IP Subnet Design and Addressing Scheme

## Overview

The property management network uses a hierarchical IP addressing scheme based on RFC 1918 private address space. Each property receives a /16 subnet, allowing for up to 65,534 host addresses with logical segmentation by device type.

## Address Space Allocation

### Global Allocation
- **Base Network**: 10.0.0.0/8
- **Property Range**: 10.1.0.0/16 through 10.255.0.0/16
- **Maximum Properties**: 255 properties
- **Addresses per Property**: 65,534 usable addresses

### Property ID Mapping
```
Property ID → Second Octet
Property 1  → 10.1.0.0/16
Property 2  → 10.2.0.0/16
Property 3  → 10.3.0.0/16
...
Property 255 → 10.255.0.0/16
```

## Per-Property Subnet Structure

### Standard Subnet Template (10.X.0.0/16)

| Subnet | VLAN | Network | Range | Hosts | Purpose |
|--------|------|---------|-------|-------|---------|
| Management | 1 | 10.X.1.0/24 | .1 - .254 | 254 | Network equipment, servers, management |
| Reserved | - | 10.X.2.0/24 | - | 254 | Future expansion |
| Reserved | - | 10.X.3.0/24 | - | 254 | Future expansion |
| HVAC Systems | 10 | 10.X.10.0/24 | .1 - .254 | 254 | Thermostats, HVAC controllers, air quality |
| HVAC Expansion | 10 | 10.X.11.0/24 | .1 - .254 | 254 | Additional HVAC devices |
| Kitchen Appliances | 20 | 10.X.20.0/24 | .1 - .254 | 254 | Refrigerators, ovens, dishwashers |
| Kitchen Expansion | 20 | 10.X.21.0/24 | .1 - .254 | 254 | Additional kitchen devices |
| Laundry Systems | 30 | 10.X.30.0/24 | .1 - .254 | 254 | Washers, dryers, payment systems |
| Laundry Expansion | 30 | 10.X.31.0/24 | .1 - .254 | 254 | Additional laundry devices |
| Security & Access | 40 | 10.X.40.0/24 | .1 - .254 | 254 | Smart locks, cameras, access control |
| Security Expansion | 40 | 10.X.41.0/24 | .1 - .254 | 254 | Additional security devices |
| Environmental Sensors | 50 | 10.X.50.0/24 | .1 - .254 | 254 | Motion, temp, humidity, light sensors |
| Sensor Expansion | 50 | 10.X.51.0/24 | .1 - .254 | 254 | Additional sensors |
| Water Management | 60 | 10.X.60.0/24 | .1 - .254 | 254 | Leak sensors, smart valves, meters |
| Water Expansion | 60 | 10.X.61.0/24 | .1 - .254 | 254 | Additional water devices |
| Lighting & Energy | 70 | 10.X.70.0/24 | .1 - .254 | 254 | Smart lights, energy monitors |
| Lighting Expansion | 70 | 10.X.71.0/24 | .1 - .254 | 254 | Additional lighting devices |
| Tenant WiFi | 100 | 10.X.100.0/22 | .1 - .1022 | 1022 | Tenant devices (phones, laptops, etc.) |
| Guest WiFi | 200 | 10.X.200.0/22 | .1 - .1022 | 1022 | Guest/visitor devices |
| IoT Reserve | - | 10.X.80.0/21 | - | 2046 | Future IoT device categories |

### Address Space Summary per Property
- **Management/Infrastructure**: 766 addresses (3 subnets)
- **IoT Devices**: 3,556 addresses (14 subnets)
- **WiFi Clients**: 2,044 addresses (2 subnets)
- **Reserved/Expansion**: ~59,000 addresses
- **Total Usable**: 65,534 addresses

## Detailed Subnet Assignments

### VLAN 1: Management Network (10.X.1.0/24)

| IP Range | Assignment | Notes |
|----------|------------|-------|
| 10.X.1.1 | Gateway/Firewall Primary | Default gateway |
| 10.X.1.2 | Gateway/Firewall Secondary | HA standby |
| 10.X.1.10-10.X.1.29 | Network Switches | Core and access switches |
| 10.X.1.30-10.X.1.49 | Wireless Access Points | Management IPs for APs |
| 10.X.1.50-10.X.1.69 | Servers/Controllers | MQTT broker, IoT hub, NVR |
| 10.X.1.70-10.X.1.89 | Monitoring Systems | SNMP collector, syslog server |
| 10.X.1.90-10.X.1.99 | VPN Clients | Remote management access |
| 10.X.1.100-10.X.1.199 | DHCP Pool | Dynamic management devices |
| 10.X.1.200-10.X.1.254 | Static Reservations | Reserved for specific devices |

**DNS Servers**: 10.X.1.53, 10.X.1.54 (local caching DNS)
**NTP Server**: 10.X.1.123
**DHCP Server**: 10.X.1.67

---

### VLAN 10: HVAC and Climate Control (10.X.10.0/24)

#### Per-Unit Assignment Pattern
Each unit receives a block of 5 addresses:
- Base: 10.X.10.{unit_offset}

**Example for 50 units:**
```
Unit 101: 10.X.10.1-5
  .1 = Smart Thermostat
  .2 = HVAC Controller
  .3 = Air Quality Sensor
  .4 = Window Sensors (hub)
  .5 = Reserved

Unit 102: 10.X.10.6-10
Unit 103: 10.X.10.11-15
...
Unit 150: 10.X.10.246-250
```

#### Common Area HVAC
| IP Range | Assignment |
|----------|------------|
| 10.X.10.251 | Lobby HVAC Controller |
| 10.X.10.252 | Hallway Climate Sensors |
| 10.X.10.253 | Roof HVAC Units |
| 10.X.10.254 | Mechanical Room Controller |

**DHCP**: Disabled (all static assignments)
**Gateway**: 10.X.1.1

---

### VLAN 20: Kitchen Appliances (10.X.20.0/24)

#### Per-Unit Assignment Pattern
Each unit receives a block of 5 addresses:

```
Unit 101: 10.X.20.1-5
  .1 = Smart Refrigerator
  .2 = Smart Oven/Range
  .3 = Dishwasher
  .4 = Microwave
  .5 = Reserved

Unit 102: 10.X.20.6-10
Unit 103: 10.X.20.11-15
...
```

**DHCP**: Disabled (all static assignments)
**Gateway**: 10.X.1.1

---

### VLAN 30: Laundry and Utility (10.X.30.0/24)

#### Shared Laundry Rooms
| IP Range | Assignment |
|----------|------------|
| 10.X.30.1-10.X.30.50 | Washers (up to 50 units) |
| 10.X.30.51-10.X.30.100 | Dryers (up to 50 units) |
| 10.X.30.101-10.X.30.120 | Payment Terminals |
| 10.X.30.121-10.X.30.130 | Laundry Room Sensors (occupancy, humidity) |

#### In-Unit Laundry (if applicable)
```
Unit 101: 10.X.30.131-132
  .131 = Washer
  .132 = Dryer

Unit 102: 10.X.30.133-134
...
```

**DHCP**: Disabled (all static assignments)
**Gateway**: 10.X.1.1

---

### VLAN 40: Security and Access Control (10.X.40.0/24)

#### Access Control
| IP Range | Assignment |
|----------|------------|
| 10.X.40.1-10.X.40.10 | Entry Door Locks/Readers |
| 10.X.40.11-10.X.40.20 | Elevator Access Control |
| 10.X.40.21-10.X.40.30 | Parking Gate Controllers |

#### Video Surveillance
| IP Range | Assignment |
|----------|------------|
| 10.X.40.50-10.X.40.99 | Exterior Cameras |
| 10.X.40.100-10.X.40.149 | Interior Common Area Cameras |
| 10.X.40.150-10.X.40.199 | Parking/Garage Cameras |
| 10.X.40.200 | Network Video Recorder (NVR) |

#### Per-Unit Smart Locks
```
Unit 101: 10.X.40.201
Unit 102: 10.X.40.202
Unit 103: 10.X.40.203
...
```

**DHCP**: Disabled (all static assignments)
**Gateway**: 10.X.1.1

---

### VLAN 50: Environmental Sensors (10.X.50.0/24)

#### Per-Unit Sensors (5 addresses per unit)
```
Unit 101: 10.X.50.1-5
  .1 = Motion Sensors (hub)
  .2 = Temperature Sensors
  .3 = Humidity Sensors
  .4 = Light Sensors
  .5 = Smoke/CO Detectors (if networked)

Unit 102: 10.X.50.6-10
...
```

#### Common Area Sensors
| IP Range | Assignment |
|----------|------------|
| 10.X.50.240-10.X.50.244 | Lobby Sensors |
| 10.X.50.245-10.X.50.249 | Hallway Sensors |
| 10.X.50.250-10.X.50.254 | Exterior Sensors |

**DHCP**: Disabled (all static assignments)
**Gateway**: 10.X.1.1

---

### VLAN 60: Water Management (10.X.60.0/24)

#### Per-Unit Leak Detection (3 addresses per unit)
```
Unit 101: 10.X.60.1-3
  .1 = Kitchen Leak Sensor
  .2 = Bathroom Leak Sensor
  .3 = Water Heater Sensor

Unit 102: 10.X.60.4-6
...
```

#### Building Water Systems
| IP Range | Assignment |
|----------|------------|
| 10.X.60.240 | Main Water Shutoff Valve |
| 10.X.60.241 | Irrigation Controller |
| 10.X.60.242-10.X.60.244 | Sump Pump Monitors |
| 10.X.60.245-10.X.60.249 | Water Meter Readers |
| 10.X.60.250-10.X.60.254 | Roof/Gutter Sensors |

**DHCP**: Disabled (all static assignments)
**Gateway**: 10.X.1.1

---

### VLAN 70: Lighting and Energy (10.X.70.0/24)

#### Per-Unit Smart Lighting (3 addresses per unit)
```
Unit 101: 10.X.70.1-3
  .1 = Lighting Controller/Hub
  .2 = Smart Switches
  .3 = Energy Monitor

Unit 102: 10.X.70.4-6
...
```

#### Common Area Lighting
| IP Range | Assignment |
|----------|------------|
| 10.X.70.240-10.X.70.244 | Exterior Lighting Controllers |
| 10.X.70.245-10.X.70.249 | Common Area Lighting |
| 10.X.70.250-10.X.70.254 | Emergency Lighting (if networked) |

**DHCP**: Disabled (all static assignments)
**Gateway**: 10.X.1.1

---

### VLAN 100: Tenant WiFi (10.X.100.0/22)

**DHCP Pool**: 10.X.100.10 - 10.X.103.254 (1,013 addresses)
**Gateway**: 10.X.1.1
**DNS Servers**: 10.X.1.53, 10.X.1.54 (or public DNS)
**Lease Time**: 24 hours
**Reserved**: 10.X.100.1-9 for static assignments

#### Features
- Client isolation enabled
- Rate limiting: 100 Mbps per client
- NAT to WAN

---

### VLAN 200: Guest WiFi (10.X.200.0/22)

**DHCP Pool**: 10.X.200.10 - 10.X.203.254 (1,013 addresses)
**Gateway**: 10.X.1.1
**DNS Servers**: Public DNS only (1.1.1.1, 8.8.8.8)
**Lease Time**: 4 hours
**Reserved**: 10.X.200.1-9 for captive portal

#### Features
- Client isolation enabled
- Rate limiting: 25 Mbps per client
- Captive portal at 10.X.200.1
- Session timeout: 24 hours
- NAT to WAN

---

## IP Address Management (IPAM)

### Allocation Strategy

**Static Assignments** (IoT Devices):
- Predictable addressing for troubleshooting
- DNS entries for all static devices
- Spreadsheet/database tracking with MAC addresses
- Naming convention: `device-type-location-unit`

**Dynamic Assignments** (WiFi Clients):
- Large DHCP pools for tenant/guest devices
- Short lease times for guest network
- DHCP reservations for known tenant devices (optional)

### Naming Convention Examples

**Management Devices:**
- `gw-property001-primary` → 10.1.1.1
- `sw-core-property001` → 10.1.1.10
- `ap-floor2-east` → 10.1.1.35
- `mqtt-broker-property001` → 10.1.1.50

**IoT Devices:**
- `hvac-thermostat-unit101` → 10.1.10.1
- `kitchen-fridge-unit101` → 10.1.20.1
- `laundry-washer-01` → 10.1.30.1
- `security-lock-unit101` → 10.1.40.201
- `water-leak-kitchen-unit101` → 10.1.60.1

### DNS Configuration

**Internal DNS Zones:**
- `property001.local` → 10.1.0.0/16
- `property002.local` → 10.2.0.0/16

**Sample DNS Records:**
```
gw.property001.local        A    10.1.1.1
mqtt.property001.local      A    10.1.1.50
thermostat-101.property001.local  A  10.1.10.1
```

## Subnet Capacity Planning

### Example: 100-Unit Property

| Device Category | Per-Unit | Total | Subnet | Utilization |
|----------------|----------|-------|--------|-------------|
| HVAC | 5 | 500 | 10.X.10-11.0/23 | 500/510 (98%) |
| Kitchen | 5 | 500 | 10.X.20-21.0/23 | 500/510 (98%) |
| Laundry (shared) | - | 50 | 10.X.30.0/24 | 50/254 (20%) |
| Security (locks) | 1 | 100 | 10.X.40.0/24 | 150/254 (59%)* |
| Environmental | 5 | 500 | 10.X.50-51.0/23 | 500/510 (98%) |
| Water | 3 | 300 | 10.X.60.0/24 | 300/254 (Full)** |
| Lighting | 3 | 300 | 10.X.70.0/24 | 300/254 (Full)** |

*Includes 50 cameras and access control
**Requires expansion subnet

### Expansion Strategy
When a /24 subnet exceeds 80% utilization:
1. Enable expansion subnet (X.Y.{vlan+1}.0/24)
2. Update DHCP scopes if applicable
3. Verify VLAN configuration includes both subnets
4. Update documentation and monitoring

## Multi-Property Routing

### Property-to-Property Communication
By default, properties are isolated. If inter-property communication is required:

**VPN Mesh Network:**
```
Central Hub: 10.0.1.0/24
Property 1: 10.1.0.0/16 ← VPN tunnel → Central Hub
Property 2: 10.2.0.0/16 ← VPN tunnel → Central Hub
Property 3: 10.3.0.0/16 ← VPN tunnel → Central Hub
```

**Routing Table (at Central Hub):**
```
10.1.0.0/16 via VPN-Tunnel-1
10.2.0.0/16 via VPN-Tunnel-2
10.3.0.0/16 via VPN-Tunnel-3
```

### Cloud Management Network
**Cloud Controller Subnet**: 10.0.2.0/24
- 10.0.2.1: Primary Management Server
- 10.0.2.2: Secondary Management Server
- 10.0.2.10-50: Cloud Services (MQTT, database, APIs)

## IPv6 Considerations

### Future IPv6 Deployment
- **ULA Prefix**: fd00::/8 for internal addressing
- **Property Allocation**: fd{XX}::/48 per property
- **Dual-Stack**: Run IPv4 and IPv6 concurrently
- **IoT Compatibility**: Most IoT devices are IPv4-only currently

### Example IPv6 Addressing
```
Property 1: fd01::/48
  Management: fd01:0:1::/64
  HVAC: fd01:0:10::/64
  Tenant WiFi: fd01:0:100::/64
```

## Troubleshooting Reference

### Quick Subnet Identification
```
10.X.1.Y    → Management (VLAN 1)
10.X.10.Y   → HVAC (VLAN 10)
10.X.20.Y   → Kitchen (VLAN 20)
10.X.30.Y   → Laundry (VLAN 30)
10.X.40.Y   → Security (VLAN 40)
10.X.50.Y   → Environmental (VLAN 50)
10.X.60.Y   → Water (VLAN 60)
10.X.70.Y   → Lighting (VLAN 70)
10.X.100-103.Y → Tenant WiFi (VLAN 100)
10.X.200-203.Y → Guest WiFi (VLAN 200)
```

### Common Issues
- **Device can't reach internet**: Check gateway (10.X.1.1) and DNS
- **Device can't reach management**: Verify VLAN ACLs
- **DHCP not working**: Check DHCP server 10.X.1.67 and VLAN helper addresses
- **Subnet exhausted**: Enable expansion subnet for that VLAN

## Documentation and Change Management

### IP Allocation Tracking
Maintain spreadsheets or IPAM system with:
- IP address
- MAC address
- Hostname
- Device type
- Physical location
- Installation date
- Assigned VLAN
- Contact/responsible party

### Change Request Process
1. Document proposed changes
2. Verify no IP conflicts
3. Update IPAM database
4. Configure network equipment
5. Test connectivity
6. Update documentation
7. Notify affected parties
