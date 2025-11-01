# Network Topology

## Overview

The property management network uses a hierarchical, segmented architecture with per-property isolation and centralized management capabilities.

## High-Level Architecture

```
                                    ┌─────────────────┐
                                    │  Cloud Services │
                                    │  (Management)   │
                                    └────────┬────────┘
                                             │
                                    ┌────────┴────────┐
                                    │   VPN Gateway   │
                                    │   (Redundant)   │
                                    └────────┬────────┘
                                             │
                                    ┌────────┴────────┐
                                    │ Central Router/ │
                                    │    Firewall     │
                                    └────────┬────────┘
                                             │
                    ┌────────────────────────┼────────────────────────┐
                    │                        │                        │
            ┌───────┴────────┐      ┌───────┴────────┐      ┌───────┴────────┐
            │  Property 1    │      │  Property 2    │      │  Property N    │
            │  10.1.0.0/16   │      │  10.2.0.0/16   │      │  10.N.0.0/16   │
            └───────┬────────┘      └───────┬────────┘      └───────┬────────┘
                    │                       │                        │
              [Per-Property Network]  [Per-Property Network]  [Per-Property Network]
```

## Per-Property Network Architecture

Each property has an isolated network with the following topology:

```
                        Internet (WAN)
                              │
                    ┌─────────┴─────────┐
                    │  Property Gateway │
                    │   UTM Firewall    │
                    │   10.X.0.1/16     │
                    └─────────┬─────────┘
                              │
                    ┌─────────┴─────────┐
                    │   Core Switch     │
                    │  (L3 Capable)     │
                    │  VLAN Routing     │
                    └─────────┬─────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
┌───────┴────────┐   ┌───────┴────────┐   ┌───────┴────────┐
│  Management    │   │ IoT Switches   │   │ Access Points  │
│   Switch       │   │  (Per Floor)   │   │  (Per Floor)   │
│  VLAN 1        │   │  VLAN 10-60    │   │  VLAN 100-200  │
└────────────────┘   └───────┬────────┘   └───────┬────────┘
                             │                     │
                    ┌────────┴────────┐   ┌────────┴────────┐
                    │  IoT Devices    │   │ Tenant/Guest    │
                    │  (Segmented)    │   │   WiFi Clients  │
                    └─────────────────┘   └─────────────────┘
```

## Network Layers

### Layer 1: Internet/WAN Layer
- **Purpose**: External connectivity
- **Components**: ISP connection, backup WAN (optional)
- **Redundancy**: Dual WAN with failover (recommended for critical properties)

### Layer 2: Gateway/Security Layer
- **Purpose**: Traffic filtering, VPN termination, NAT
- **Components**: UTM firewall, VPN concentrator, IDS/IPS
- **Redundancy**: Active/passive or active/active HA configuration

### Layer 3: Core Distribution Layer
- **Purpose**: VLAN routing, inter-subnet communication
- **Components**: L3 managed switch with routing capabilities
- **Features**:
  - VLAN tagging and routing
  - ACLs between VLANs
  - QoS policies
  - Link aggregation

### Layer 4: Access Layer
- **Purpose**: Device connectivity
- **Components**:
  - PoE switches for IoT devices
  - Wireless access points
  - Network-attached IoT hubs (Z-Wave/Zigbee)
- **Features**:
  - Port-based VLAN assignment
  - 802.1X authentication (optional)
  - Port security

## Physical Network Design

### Multi-Story Building Example

```
┌─────────────────────────────────────────────┐
│               Roof/Mechanical               │
│  - HVAC Controllers (VLAN 10)              │
│  - Water Tank Sensors (VLAN 60)            │
│  - Solar Panels (if applicable)            │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│             Floor 3 (Units 301-310)         │
│  - Access Point (VLAN 100, 200)            │
│  - PoE Switch (All VLANs)                  │
│  - Per-Unit Devices:                       │
│    * Smart Thermostats (VLAN 10)           │
│    * Smart Locks (VLAN 40)                 │
│    * Leak Sensors (VLAN 60)                │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│             Floor 2 (Units 201-210)         │
│  - Access Point (VLAN 100, 200)            │
│  - PoE Switch (All VLANs)                  │
│  - Shared Laundry (VLAN 30)                │
│  - Per-Unit Devices (VLANs 10, 40, 60)     │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│             Floor 1 (Units 101-110)         │
│  - Access Point (VLAN 100, 200)            │
│  - PoE Switch (All VLANs)                  │
│  - Per-Unit Devices (VLANs 10, 40, 60)     │
└────────────────┬────────────────────────────┘
                 │
┌────────────────┴────────────────────────────┐
│            Ground Floor/Common              │
│  - Main Network Rack:                      │
│    * Gateway/Firewall                      │
│    * Core Switch                           │
│    * Management Server (VLAN 1)            │
│    * IoT Controller Hub                    │
│  - Lobby/Common Area APs                   │
│  - Security Cameras (VLAN 40)              │
│  - Access Control System (VLAN 40)         │
└─────────────────────────────────────────────┘
```

## Network Connectivity Matrix

### Inter-VLAN Communication Rules

| Source VLAN | Destination VLAN | Access | Purpose |
|-------------|------------------|--------|---------|
| Management (1) | All VLANs | Full | Administration |
| HVAC (10) | Management (1) | Limited | Monitoring/Control |
| HVAC (10) | Environmental (50) | Read | Temperature Data |
| Kitchen (20) | Management (1) | Limited | Monitoring/Alerts |
| Laundry (30) | Management (1) | Limited | Status/Payment |
| Security (40) | Management (1) | Full | Monitoring/Recording |
| Security (40) | All IoT VLANs | None | Isolation |
| Environmental (50) | Management (1) | Limited | Sensor Data |
| Water (60) | Management (1) | Full | Leak Alerts/Shutoff |
| Tenant WiFi (100) | Internet Only | Internet | Isolated Network |
| Guest WiFi (200) | Internet Only | Internet | Isolated Network |
| All IoT VLANs | Internet | Limited | Cloud Services Only |

### Internet Access Policy

**Allowed Outbound (by VLAN):**
- **Management (1)**: Full access (with logging)
- **IoT VLANs (10-60)**: Whitelist only (manufacturer cloud services)
- **Tenant WiFi (100)**: Full access (rate-limited)
- **Guest WiFi (200)**: Full access (rate-limited, captive portal)

**Blocked Outbound:**
- Peer-to-peer protocols (BitTorrent, etc.) on tenant/guest networks
- Known malicious IPs/domains (threat intelligence feeds)
- Unnecessary ports (reduce attack surface)

## Redundancy and Failover

### Critical Systems
- **Gateway/Firewall**: Active/passive HA with VRRP
- **Core Switch**: Stacked switches with cross-stack links
- **Internet**: Dual WAN with automatic failover
- **Power**: UPS for network equipment, generator backup (optional)

### Non-Critical Systems
- **Access Points**: Coverage overlap for WiFi continuity
- **IoT Switches**: Graceful degradation (local operation if possible)

## Wireless Network Design

### Access Point Placement
- **Coverage**: One AP per 2,500 sq ft or per floor section
- **Capacity**: Plan for 25-50 concurrent clients per AP
- **Band Steering**: Prefer 5GHz for capable clients
- **Channel Planning**: Non-overlapping channels, DFS when available

### SSID Configuration
1. **Property-Tenant-WiFi** (VLAN 100)
   - WPA3/WPA2 mixed mode
   - Password per property or per unit
   - Client isolation enabled

2. **Property-Guest-WiFi** (VLAN 200)
   - Captive portal with terms acceptance
   - Time-limited access (24 hours)
   - Bandwidth throttling

3. **Property-IoT** (Per VLAN, hidden SSID)
   - WPA2-PSK or 802.1X
   - MAC address filtering (optional)
   - Legacy protocol support (2.4GHz)

4. **Property-Management** (VLAN 1, hidden)
   - WPA3 Enterprise (802.1X)
   - Strong authentication required
   - Access logging

## Scalability Considerations

### Adding New Properties
1. Assign new property ID (sequential)
2. Allocate 10.{property_id}.0.0/16 address space
3. Deploy standard equipment configuration
4. Connect to central management VPN
5. Configure firewall rules and monitoring

### Adding New Units
1. No network changes required (within subnet capacity)
2. Provision devices with appropriate VLAN assignment
3. Update device inventory and monitoring

### Adding New Device Types
1. Assign to existing VLAN or create new VLAN if needed
2. Update firewall ACLs for required communication
3. Configure QoS if real-time requirements exist
4. Add to monitoring and alerting systems

## Network Equipment Specifications

### Minimum Requirements

**Gateway/Firewall:**
- Throughput: 1 Gbps firewall, 500 Mbps VPN
- Ports: 4+ Gigabit Ethernet
- Features: Stateful inspection, IDS/IPS, VPN, VLAN support

**Core Switch:**
- Ports: 24-48 Gigabit Ethernet
- Uplinks: 10G SFP+ (optional but recommended)
- Layer: L3 with routing capabilities
- PoE: 802.3at (PoE+) on at least 50% of ports
- Switching Capacity: 128 Gbps+

**Access Layer Switches:**
- Ports: 8-24 Gigabit Ethernet per floor
- PoE: 802.3af/at on all ports
- VLAN: 802.1Q tagging support
- Management: SNMP, web interface

**Wireless Access Points:**
- Standard: 802.11ax (WiFi 6)
- Bands: Dual-band 2.4/5 GHz
- Antennas: Internal, omnidirectional
- Power: 802.3at PoE
- Concurrent Clients: 100+ (spec), 50 (realistic load)

## Monitoring and Management

### Central Management
- **Controller**: Centralized for all properties (cloud or on-premise)
- **Monitoring**: SNMP, NetFlow, syslog collection
- **Alerts**: Email, SMS, push notifications for critical events
- **Dashboards**: Real-time status, historical trends, capacity planning

### Per-Property Management
- **Local Access**: Console access to gateway for emergency
- **Device Discovery**: Automatic detection of new devices
- **Firmware Management**: Scheduled updates with rollback capability
- **Configuration Backup**: Automatic daily backups to central storage

## Future Expansion

### Planned Enhancements
- **5G Backup WAN**: Cellular failover for critical properties
- **WiFi 7**: Upgrade path for next-generation wireless
- **Network Automation**: Intent-based networking with automated provisioning
- **AI/ML Integration**: Anomaly detection, predictive maintenance
- **Energy Monitoring**: Per-circuit power monitoring and optimization
