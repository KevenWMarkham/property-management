# Property Network Architecture Diagram

## Property-Level Network Infrastructure

This document provides detailed network diagrams for a typical property deployment.

## Physical Network Diagram - Multi-Story Building

```
                              ┌────────────────────┐
                              │   INTERNET (WAN)   │
                              │   ISP Connection   │
                              └─────────┬──────────┘
                                        │
                                        │ Fiber/Ethernet
                                        │
┌─────────────────────────────────────────────────────────────────────┐
│                     GROUND FLOOR - NETWORK RACK                     │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      Main Network Rack                       │  │
│  │                                                              │  │
│  │  ┌────────────────────────────────────────────┐             │  │
│  │  │  UTM Firewall/Gateway (10.X.0.1)          │             │  │
│  │  │  • WAN: Public IP                         │             │  │
│  │  │  • LAN: 10.X.1.1 (All VLANs)             │             │  │
│  │  │  • VPN Server                             │             │  │
│  │  │  • IDS/IPS Engine                         │             │  │
│  │  │  • DHCP Server                            │             │  │
│  │  └──────────────┬─────────────────────────────┘             │  │
│  │                 │                                           │  │
│  │  ┌──────────────┴─────────────────────────────┐             │  │
│  │  │  Core L3 Switch (10.X.1.10)               │             │  │
│  │  │  • 48-port Gigabit PoE+                   │             │  │
│  │  │  • 10G SFP+ uplinks                       │             │  │
│  │  │  • VLAN routing (all VLANs)               │             │  │
│  │  │  • QoS policies                           │             │  │
│  │  │  • Spanning Tree root                     │             │  │
│  │  └──┬────┬────┬────┬────┬────┬───────────────┘             │  │
│  │     │    │    │    │    │    │                             │  │
│  │  ┌──┴─┐ ┌┴──┐ ┌┴──┐ ┌┴──┐ ┌┴──┐                           │  │
│  │  │AP1│ │Srv│ │IoT│ │NVR│ │To│                            │  │
│  │  │VLAN│ │Mgmt│ │Hub│ │VLAN│ │Flr│                          │  │
│  │  │100,│ │VLAN│ │All│ │40 │ │1 │                            │  │
│  │  │200 │ │1  │ │VLANs│    │    │                            │  │
│  │  └────┘ └───┘ └───┘ └───┘ └───┘                            │  │
│  │                                                              │  │
│  │  Servers/Controllers:                                       │  │
│  │  • MQTT Broker (10.X.1.50)                                 │  │
│  │  • DNS Server (10.X.1.53)                                  │  │
│  │  • NTP Server (10.X.1.123)                                 │  │
│  │  • Syslog Server (10.X.1.70)                               │  │
│  │  • Zigbee/Z-Wave Hubs (10.X.1.60-61)                       │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Common Areas:                                                      │
│  • Access Control Panel (VLAN 40) - 10.X.40.1                     │
│  • Entry Intercom (VLAN 40) - 10.X.40.31                          │
│  • Lobby Cameras x3 (VLAN 40) - 10.X.40.50-52                     │
│  • Main Water Shutoff (VLAN 60) - 10.X.60.240                     │
│  • Lobby HVAC Controller (VLAN 10) - 10.X.10.251                  │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Fiber/Cat6 Trunk
                                        │ (All VLANs Tagged)
                                        │
┌─────────────────────────────────────────────────────────────────────┐
│                      FLOOR 1 - UNITS 101-110                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Floor Access Switch (10.X.1.11)                            │  │
│  │  • 24-port Gigabit PoE+ (managed)                           │  │
│  │  • Trunk uplink to Core                                     │  │
│  │  • Ports assigned to VLANs per device type                  │  │
│  └──┬────┬────┬────┬────┬────┬────┬────┬────┬────┬────────────┘  │
│     │    │    │    │    │    │    │    │    │    │                │
│  ┌──┴─┐ ┌┴──┐Units...                    ┌┴──┐ ┌┴──┐            │
│  │ AP │ │Cam│                              │Cam│ │Cam│            │
│  │West│ │40 │                              │40 │ │40 │            │
│  └────┘ └───┘                              └───┘ └───┘            │
│                                                                     │
│  Unit 101 Devices:                                                 │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Smart Thermostat (VLAN 10) - 10.X.10.1                     │   │
│  │ Smart Refrigerator (VLAN 20) - 10.X.20.1                   │   │
│  │ Smart Dishwasher (VLAN 20) - 10.X.20.3                     │   │
│  │ Smart Door Lock (VLAN 40) - 10.X.40.201                    │   │
│  │ Leak Sensors x2 (VLAN 60) - 10.X.60.1-2 (via Zigbee hub)  │   │
│  │ Motion Sensor (VLAN 50) - 10.X.50.1 (via Zigbee hub)      │   │
│  │ Smart Lights (VLAN 70) - 10.X.70.1-3 (via Zigbee hub)     │   │
│  │ Tenant WiFi Clients (VLAN 100) - DHCP assigned             │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Units 102-110: Similar device configuration                       │
│  Hallway Devices:                                                  │
│  • Camera (VLAN 40) - 10.X.40.60                                  │
│  • Environmental Sensors (VLAN 50) - 10.X.50.240-244              │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Fiber/Cat6 Trunk
                                        │
┌─────────────────────────────────────────────────────────────────────┐
│                      FLOOR 2 - UNITS 201-210                        │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │  Floor Access Switch (10.X.1.12)                            │  │
│  │  • 24-port Gigabit PoE+ (managed)                           │  │
│  └──┬────┬────┬────┬────┬────────────────────────────────────┘  │
│     │    │    │    │    │                                         │
│  ┌──┴─┐ ┌┴──┐ ┌──┴────┴─────────────┐                           │
│  │ AP │ │Cam│ │  Shared Laundry Room │                           │
│  │East│ │40 │ │                      │                           │
│  └────┘ └───┘ └──────────────────────┘                           │
│                                                                     │
│  Laundry Room Devices (VLAN 30):                                   │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Washer #1-5 - 10.X.30.1-5                                  │   │
│  │ Dryer #1-5 - 10.X.30.51-55                                 │   │
│  │ Payment Terminal - 10.X.30.101                             │   │
│  │ Occupancy Sensor - 10.X.30.121                             │   │
│  │ Humidity Sensor - 10.X.30.122                              │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  Units 201-210: Similar to Floor 1                                 │
└─────────────────────────────────────────────────────────────────────┘
                                        │
                                        │ Fiber/Cat6 Trunk
                                        │
┌─────────────────────────────────────────────────────────────────────┐
│                      FLOOR 3 - UNITS 301-310                        │
│  (Similar configuration to Floors 1 & 2)                            │
└─────────────────────────────────────────────────────────────────────┘
                                        │
┌─────────────────────────────────────────────────────────────────────┐
│                    ROOF/MECHANICAL ROOM                             │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │ Rooftop HVAC Units (VLAN 10):                             │   │
│  │ • HVAC Controller #1 - 10.X.10.253                        │   │
│  │ • HVAC Controller #2 - 10.X.10.254                        │   │
│  │                                                            │   │
│  │ Water Management (VLAN 60):                               │   │
│  │ • Water Tank Sensor - 10.X.60.250                         │   │
│  │                                                            │   │
│  │ Security (VLAN 40):                                       │   │
│  │ • Rooftop Access Camera - 10.X.40.99                      │   │
│  └────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Logical Network Diagram - VLAN Structure

```
                                    INTERNET
                                        │
                                        │
                        ┌───────────────┴────────────────┐
                        │   UTM Firewall/Gateway         │
                        │   NAT, Firewall, VPN, IDS/IPS  │
                        └───────────────┬────────────────┘
                                        │
                        ┌───────────────┴────────────────┐
                        │     Core L3 Switch             │
                        │   Inter-VLAN Routing           │
                        │   ACLs, QoS, Trunking          │
                        └───────────────┬────────────────┘
                                        │
        ┌───────────────────────────────┼────────────────────────────────┐
        │                               │                                │
┌───────┴────────┐             ┌────────┴────────┐              ┌───────┴────────┐
│ VLAN 1: MGMT   │             │ VLAN 10: HVAC   │              │ VLAN 20: KITCH │
│ 10.X.1.0/24    │             │ 10.X.10.0/23    │              │ 10.X.20.0/23   │
│                │             │                 │              │                │
│ • Switches     │────────────>│ • Thermostats   │              │ • Fridges      │
│ • Servers      │  Monitor    │ • Controllers   │              │ • Ovens        │
│ • Controllers  │             │ • Air Quality   │              │ • Dishwashers  │
└────────────────┘             └─────────────────┘              └────────────────┘
        │                               │                                │
        │                               v                                v
        │                          Cloud APIs                        Cloud APIs
        │                          (Whitelist)                       (Whitelist)
        │
        │       ┌───────────────────────────────────────────────────────┐
        │       │                                                       │
        v       v                                                       v
┌───────┴────────┐             ┌─────────────────┐              ┌───────┴────────┐
│ VLAN 30: LNDRY │             │ VLAN 40: SECURE │              │ VLAN 50: SENSOR│
│ 10.X.30.0/24   │             │ 10.X.40.0/24    │              │ 10.X.50.0/23   │
│                │             │                 │              │                │
│ • Washers      │             │ • Cameras───────┼──> NVR       │ • Motion       │
│ • Dryers       │             │ • Locks         │   (10.X.40.200)│ • Temp/Humid │
│ • Payment***   │────────────>│ • Access Ctrl   │              │ • Light        │
│   (PCI DSS)    │  Isolated   │ • Intercom      │              │ • Smoke/CO     │
└────────────────┘             └─────────────────┘              └────────────────┘
        │                               │                                │
        v                               v                                │
   Payment GW                      Cloud Backup                          │
   (Whitelist)                     (Optional)                            │
                                                                          │
        ┌─────────────────────────────────────────────────────────────────┘
        │                               │
        v                               v
┌───────┴────────┐             ┌─────────────────┐              ┌────────────────┐
│ VLAN 60: WATER │             │ VLAN 70: LIGHT  │              │ VLAN 100: WIFI │
│ 10.X.60.0/24   │             │ 10.X.70.0/24    │              │ 10.X.100.0/22  │
│                │             │                 │              │                │
│ • Leak Sensors │────────────>│ • Smart Bulbs   │<─────────────│ • Tenant       │
│ • Shutoff Valve│  Alert      │ • Switches      │  Motion      │   Devices      │
│ • Water Meters │             │ • Energy Monitor│  Trigger     │ • Phones       │
│ • Sump Pumps   │             │                 │              │ • Laptops      │
└────────────────┘             └─────────────────┘              └────────────────┘
        │                               │                                │
        v                               v                                v
 Critical Alerts                   Cloud APIs                      INTERNET ONLY
   (High QoS)                      (Whitelist)                    (Isolated)


                                ┌─────────────────┐
                                │ VLAN 200: GUEST │
                                │ 10.X.200.0/22   │
                                │                 │
                                │ • Guest Devices │
                                │ • Captive Portal│
                                │   (10.X.200.1)  │
                                └────────┬────────┘
                                         │
                                         v
                                  INTERNET ONLY
                                  (Rate Limited)


═══════════════════════════════════════════════════════════════════════

LEGEND:
────────>  Allowed communication (with restrictions)
═══════>   Full access
─ ─ ─ >    Read-only access
─ ─X─ ─    Blocked communication

***  High security (PCI DSS compliant)
```

---

## WiFi Coverage Map

```
┌─────────────────────────────────────────────────────────────┐
│                    FLOOR PLAN - FLOOR 2                     │
│                                                             │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│   │ 201  │  │ 202  │  │ 203  │  │ 204  │  │ 205  │       │
│   │      │  │      │  │      │  │      │  │      │       │
│   └──────┘  └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                             │
│        (((  AP-WEST  )))                  ((( AP-EAST )))  │
│        VLAN 100, 200                      VLAN 100, 200    │
│        10.X.1.35                          10.X.1.36        │
│        Ch: 36 (5GHz)                      Ch: 149 (5GHz)   │
│        Ch: 1 (2.4GHz)                     Ch: 11 (2.4GHz)  │
│                                                             │
│   ┌───────────────────┐                                    │
│   │  LAUNDRY ROOM     │                                    │
│   │                   │                                    │
│   │  W W W W W        │  Hallway                           │
│   │  D D D D D        │  ═════════════════════════════     │
│   │  Payment Terminal │                                    │
│   └───────────────────┘                                    │
│                                                             │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐       │
│   │ 210  │  │ 209  │  │ 208  │  │ 207  │  │ 206  │       │
│   │      │  │      │  │      │  │      │  │      │       │
│   └──────┘  └──────┘  └──────┘  └──────┘  └──────┘       │
│                                                             │
│   [AP Coverage Visualization]                              │
│   ═══════ = Strong 5GHz signal                            │
│   ─────── = Acceptable 2.4GHz signal                      │
│   · · · · = Edge of coverage                              │
│                                                             │
└─────────────────────────────────────────────────────────────┘

WiFi Design Principles:
• 2 APs per floor for redundancy and capacity
• Non-overlapping channels (5GHz: 36, 149 / 2.4GHz: 1, 11)
• Band steering enabled (prefer 5GHz)
• Roaming support (802.11r fast transition)
• Client isolation enabled
• Separate SSIDs for Tenant (VLAN 100) and Guest (VLAN 200)
```

---

## Network Cabling Infrastructure

```
                   VERTICAL BACKBONE
                         │
                         │ Fiber OM3/OM4 or Cat6a
                         │ (Runs through riser/shaft)
                         │
        ┌────────────────┼────────────────┐
        │                │                │
    ┌───┴───┐        ┌───┴───┐        ┌───┴───┐
    │ IDF   │        │ IDF   │        │ IDF   │
    │ Floor │        │ Floor │        │ Floor │
    │   1   │        │   2   │        │   3   │
    └───┬───┘        └───┬───┘        └───┬───┘
        │                │                │
        │ Horizontal Cabling (Cat6/Cat6a)
        │ Max 100m per segment
        │
    ┌───┴───────────────────────────┐
    │ Structured Cabling            │
    │                               │
    │ • Unit drops: 2x Cat6 per unit│
    │   (1 for IoT, 1 for tenant)   │
    │ • AP locations: Cat6 PoE+     │
    │ • Camera locations: Cat6 PoE  │
    │ • Common areas: Cat6          │
    └───────────────────────────────┘

Cable Types:
• Backbone: Fiber OM3 (10G) or Cat6a (10GBASE-T)
• Horizontal: Cat6 (1G) or Cat6a (10G future-proof)
• Patch cables: Cat6 snagless
• Outdoor: Direct burial or conduit with gel-filled Cat6

Termination:
• Patch panels in each IDF (24 or 48 port)
• Keystone jacks at endpoint (wall plates)
• Fiber termination: LC duplex
• Cable management: horizontal and vertical managers

Labeling:
• Format: BLDG-FLOOR-ROOM-DROP#
• Example: B1-F2-U205-01 (Building 1, Floor 2, Unit 205, Drop 1)
• Color coding: Blue=Data, Yellow=PoE, Red=Security, Green=Fiber
```

---

## Power and Environmental

```
┌─────────────────────────────────────────────────────────────┐
│                    POWER DISTRIBUTION                       │
│                                                             │
│   ┌──────────────────┐                                     │
│   │   Main Utility   │                                     │
│   │   Power Feed     │                                     │
│   └────────┬─────────┘                                     │
│            │                                                │
│   ┌────────┴─────────┐        ┌──────────────┐            │
│   │ Automatic        │        │ Backup       │            │
│   │ Transfer Switch  │<───────│ Generator    │            │
│   │ (ATS)            │        │ (Optional)   │            │
│   └────────┬─────────┘        └──────────────┘            │
│            │                                                │
│   ┌────────┴─────────┐                                     │
│   │  UPS System      │                                     │
│   │  (Network Rack)  │                                     │
│   │  • Runtime: 2hr  │                                     │
│   │  • Capacity: 3kVA│                                     │
│   └────────┬─────────┘                                     │
│            │                                                │
│      ┌─────┴────┬────────┬────────┐                       │
│      │          │        │        │                        │
│   ┌──┴──┐   ┌──┴──┐ ┌───┴───┐ ┌──┴──┐                    │
│   │ FW  │   │ SW  │ │ Srv   │ │ NVR │                    │
│   │     │   │ Core│ │       │ │     │                    │
│   └─────┘   └─────┘ └───────┘ └─────┘                    │
│                                                             │
│   PoE Budget Planning (per floor):                         │
│   • Access Points: 25W each × 2 = 50W                     │
│   • Cameras: 15W each × 4 = 60W                           │
│   • IoT devices: 5W each × 10 = 50W                       │
│   • Contingency: 20%                                       │
│   • Total per floor: ~200W                                │
│                                                             │
│   48-port PoE+ switch: 370W budget (adequate)             │
│   Alternative: 740W for high-power PoE++ devices          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│             ENVIRONMENTAL MONITORING                        │
│                                                             │
│   Network Rack Conditions:                                 │
│   • Temperature: 65-75°F (monitored)                       │
│   • Humidity: 40-60% RH (monitored)                        │
│   • Cooling: Dedicated AC or vented closet                │
│   • Fire suppression: Building system                      │
│                                                             │
│   Monitoring Sensors (VLAN 50):                            │
│   • Rack temperature sensor: 10.X.50.240                   │
│   • Humidity sensor: 10.X.50.241                           │
│   • Door access sensor: 10.X.40.10                         │
│   • Water leak sensor (if applicable): 10.X.60.240        │
│                                                             │
│   Alerting Thresholds:                                     │
│   • Temperature > 80°F: Warning                            │
│   • Temperature > 90°F: Critical                           │
│   • Humidity < 30% or > 70%: Warning                       │
│   • Door open > 5 minutes: Alert                           │
│   • Water detected: Critical                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Camera Placement

```
┌─────────────────────────────────────────────────────────────┐
│                  CAMERA COVERAGE - FLOOR 2                  │
│                                                             │
│              [Cam-62]                                       │
│              Elevator                                       │
│   Units      ══╬══                    Units                │
│   ┌────┐ ┌────┐│┌────┐ ┌────┐ ┌────┐                      │
│   │201 │ │202 │││203 │ │204 │ │205 │                      │
│   └────┘ └────┘│└────┘ └────┘ └────┘                      │
│                 │                                           │
│  [Cam-60]       │     Hallway            [Cam-61]          │
│  Hallway West   │     ═══════════        Hallway East      │
│  (10.X.40.60)   │                        (10.X.40.61)      │
│                 │                                           │
│   ┌────────────┐│                                           │
│   │ Laundry   [│Cam-63]                                    │
│   │ Room       ││ Laundry                                  │
│   │            ││ (10.X.40.63)                             │
│   │ W W W W W  ││                                           │
│   │ D D D D D  ││                                           │
│   └────────────┘│                                           │
│                 │                                           │
│   ┌────┐ ┌────┐│┌────┐ ┌────┐ ┌────┐                      │
│   │210 │ │209 │││208 │ │207 │ │206 │                      │
│   └────┘ └────┘│└────┘ └────┘ └────┘                      │
│              ══╬══                                          │
│              Stairs                                         │
│                                                             │
│   Camera Specifications:                                   │
│   • Resolution: 1080p or 4K                                │
│   • FPS: 15-30 fps                                         │
│   • Night vision: IR LEDs                                  │
│   • Field of view: 90-120° horizontal                      │
│   • Retention: 30-90 days on NVR                           │
│   • Bandwidth: 2-8 Mbps per camera (H.265 compression)    │
│   • Power: PoE (802.3af or 802.3at)                       │
└─────────────────────────────────────────────────────────────┘

Coverage Strategy:
• All entry/exit points covered
• Hallway coverage with overlapping fields
• Shared spaces (laundry, lobby, parking)
• Exterior perimeter
• No coverage inside private units (privacy)
```

---

## Network Management Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│      PROPERTY NETWORK MANAGEMENT OVERVIEW                   │
│                    Property ID: 001                         │
│                                                             │
│  Network Health: ●●●●○ (80%)       Uptime: 99.8%          │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                             │
│  ┌─────────────────┬──────────┬─────────┬─────────┐       │
│  │ VLAN            │ Devices  │ Traffic │ Status  │       │
│  ├─────────────────┼──────────┼─────────┼─────────┤       │
│  │ Management (1)  │    15    │  50MB/s │   ✓     │       │
│  │ HVAC (10)       │   127    │  12MB/s │   ✓     │       │
│  │ Kitchen (20)    │    98    │   8MB/s │   ✓     │       │
│  │ Laundry (30)    │    15    │   5MB/s │   ✓     │       │
│  │ Security (40)   │    45    │  85MB/s │   ✓     │       │
│  │ Environmental(50)│   156    │   3MB/s │   ⚠     │       │
│  │ Water (60)      │    87    │   2MB/s │   ✓     │       │
│  │ Lighting (70)   │    72    │   4MB/s │   ✓     │       │
│  │ Tenant WiFi(100)│   243    │ 450MB/s │   ✓     │       │
│  │ Guest WiFi(200) │    18    │  35MB/s │   ✓     │       │
│  └─────────────────┴──────────┴─────────┴─────────┘       │
│                                                             │
│  Active Alerts:                                            │
│  ⚠ VLAN 50: 3 motion sensors offline (Units 205,307,412) │
│  ℹ Firmware update available for 12 cameras               │
│  ℹ DHCP pool 80% utilized on VLAN 100                     │
│                                                             │
│  Bandwidth Utilization (WAN):                              │
│  ┌─────────────────────────────────────────────┐          │
│  │                              ╭─╮             │          │
│  │                         ╭────╯ ╰─╮           │          │
│  │          ╭──╮      ╭───╯        ╰─╮         │          │
│  │     ╭────╯  ╰──────╯              ╰───      │          │
│  │ ════╯                                        │          │
│  └─────────────────────────────────────────────┘          │
│    Current: 654 Mbps  |  Peak: 892 Mbps  |  Avg: 512 Mbps│
│                                                             │
│  Recent Events:                                            │
│  • 14:32 - Unit 205 motion sensor reconnected             │
│  • 14:15 - Guest connected to Guest WiFi (10.X.200.45)    │
│  • 13:58 - Water leak sensor battery low (Unit 308)       │
│  • 13:42 - NVR recording space 75% full                   │
└─────────────────────────────────────────────────────────────┘
```

---

## Multi-Property Central Management

```
                    ┌───────────────────┐
                    │  Cloud Management │
                    │  Portal/Dashboard │
                    │  (AWS/Azure/GCP)  │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │  VPN Concentrator │
                    │  (Central Hub)    │
                    │  10.0.1.0/24      │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
   ┌────┴────┐          ┌────┴────┐          ┌────┴────┐
   │Property 1│          │Property 2│          │Property N│
   │VPN Client│          │VPN Client│          │VPN Client│
   │10.1.0.0  │          │10.2.0.0  │          │10.N.0.0  │
   └─────────┘          └─────────┘          └─────────┘

Centralized Management Features:
• Single-pane-of-glass monitoring
• Aggregated alerting across all properties
• Centralized firmware/config management
• Cross-property analytics and reporting
• Multi-tenant access control
• Compliance reporting (PCI, NIST, etc.)

Data Aggregation:
• MQTT messages forwarded to central broker
• Metrics shipped to time-series DB (InfluxDB/TimescaleDB)
• Logs aggregated to SIEM (Splunk/ELK)
• Video stored locally, metadata centralized
• Alarms forwarded to central NOC

Security Considerations:
• Site-to-site VPN with strong encryption (AES-256)
• Mutual authentication (certificates)
• Network segmentation at central hub
• Firewall rules limit property-to-property traffic
• Centralized patch management
```

---

## Installation Checklist

### Pre-Installation Planning
- [ ] Conduct site survey
- [ ] Measure distances for cable runs
- [ ] Identify equipment rack location
- [ ] Plan power requirements and UPS sizing
- [ ] Order equipment and cabling
- [ ] Coordinate with electrical/HVAC contractors

### Physical Installation
- [ ] Install network rack and UPS
- [ ] Run fiber/Cat6a backbone cabling
- [ ] Run horizontal cabling to all endpoints
- [ ] Install patch panels and cable management
- [ ] Terminate all cables and test continuity
- [ ] Label all cables per standard
- [ ] Mount switches, firewall, and servers
- [ ] Install access points at planned locations
- [ ] Mount cameras with proper angles/coverage

### Network Configuration
- [ ] Configure firewall with VLAN interfaces
- [ ] Set up DHCP servers per VLAN
- [ ] Configure DNS (internal zone)
- [ ] Create VLANs on all switches
- [ ] Configure trunk ports
- [ ] Assign access ports to VLANs
- [ ] Enable port security and DHCP snooping
- [ ] Configure inter-VLAN routing and ACLs
- [ ] Set up QoS policies
- [ ] Configure WiFi SSIDs and VLANs

### Device Provisioning
- [ ] Assign static IPs to all IoT devices
- [ ] Configure MQTT broker
- [ ] Set up Zigbee/Z-Wave hubs
- [ ] Pair/connect all IoT devices
- [ ] Configure NVR and add cameras
- [ ] Test camera recording and playback
- [ ] Configure access control panels
- [ ] Test smart locks remotely

### Security Hardening
- [ ] Change all default passwords
- [ ] Disable unnecessary services
- [ ] Enable HTTPS/SSH only (disable HTTP/Telnet)
- [ ] Configure firewall rules (whitelist approach)
- [ ] Enable logging on all devices
- [ ] Set up central syslog server
- [ ] Configure SNMP v3 monitoring
- [ ] Enable IDS/IPS on firewall
- [ ] Test all block rules (ensure isolation)

### Testing and Validation
- [ ] Test inter-VLAN communication (allowed paths)
- [ ] Verify blocked paths are actually blocked
- [ ] Test WiFi coverage on all floors
- [ ] Load test (simulate peak usage)
- [ ] Test failover scenarios (power, WAN)
- [ ] Verify QoS prioritization
- [ ] Test all IoT device functionality
- [ ] Validate alerting (leak, smoke, etc.)
- [ ] Penetration testing (optional but recommended)

### Documentation
- [ ] Update network diagrams with as-built
- [ ] Document all IP addresses in IPAM
- [ ] Create password vault with credentials
- [ ] Write runbook for common tasks
- [ ] Document alert procedures
- [ ] Create maintenance schedule
- [ ] Train property staff on system

### Go-Live
- [ ] Final walkthrough with stakeholders
- [ ] Transition to production
- [ ] Monitor closely for 72 hours
- [ ] Address any issues discovered
- [ ] Schedule first maintenance window
- [ ] Archive project documentation
