# Property Management Network Architecture

## Overview

This directory contains the network design and architecture documentation for the property management IoT infrastructure. The network is designed to support smart building automation, property monitoring, and tenant services while maintaining security, scalability, and reliability.

## Documentation Structure

- [network-topology.md](network-topology.md) - Overall network architecture and topology
- [subnet-design.md](subnet-design.md) - IP addressing scheme and subnet allocation
- [iot-devices.md](iot-devices.md) - IoT device categories and network assignments
- [vlan-configuration.md](vlan-configuration.md) - VLAN segmentation and security policies
- [security-policies.md](security-policies.md) - Network security and access control
- [monitoring-management.md](monitoring-management.md) - Network monitoring and device management

## Network Design Principles

### 1. Segmentation
- **Physical Segmentation**: Separate networks per property
- **Logical Segmentation**: VLANs for device type and security level
- **Isolation**: Critical systems isolated from guest/tenant networks

### 2. Security
- **Zero Trust**: No implicit trust between network segments
- **Least Privilege**: Minimal required access for each device type
- **Defense in Depth**: Multiple layers of security controls

### 3. Scalability
- **Per-Property Design**: Each property has dedicated IP space
- **Hierarchical Addressing**: Structured IP allocation for growth
- **Standardization**: Consistent design patterns across properties

### 4. Reliability
- **Redundancy**: Critical systems have failover capabilities
- **Monitoring**: Continuous health monitoring of devices and networks
- **Quality of Service**: Traffic prioritization for critical systems

## Quick Reference

### IP Address Ranges (Per Property)
- **Property Base**: 10.{property_id}.0.0/16
- **Management**: 10.{property_id}.1.0/24
- **HVAC Systems**: 10.{property_id}.10.0/24
- **Kitchen Appliances**: 10.{property_id}.20.0/24
- **Laundry Systems**: 10.{property_id}.30.0/24
- **Security/Access**: 10.{property_id}.40.0/24
- **Tenant Network**: 10.{property_id}.100.0/22

### VLAN Assignments
- **VLAN 1**: Management (untagged)
- **VLAN 10**: HVAC and Climate Control
- **VLAN 20**: Kitchen Appliances
- **VLAN 30**: Laundry and Utility
- **VLAN 40**: Security and Access Control
- **VLAN 50**: Environmental Sensors
- **VLAN 60**: Water Management
- **VLAN 100**: Tenant WiFi (isolated)
- **VLAN 200**: Guest WiFi (isolated)

## Network Standards

### Wireless Standards
- **802.11ax (WiFi 6)**: Primary tenant/guest networks
- **802.11n/ac**: IoT device compatibility
- **2.4GHz**: Legacy device support, better wall penetration
- **5GHz**: High-bandwidth applications, less interference

### IoT Protocols
- **MQTT**: Primary device communication protocol
- **CoAP**: Lightweight alternative for constrained devices
- **Z-Wave/Zigbee**: Smart home device mesh networks
- **BACnet**: HVAC and building automation systems
- **Modbus TCP**: Industrial equipment integration

### Network Equipment
- **Managed Switches**: Cisco, Ubiquiti, or enterprise-grade alternatives
- **Wireless Access Points**: WiFi 6 capable, POE powered
- **Gateway/Firewall**: pfSense, OPNsense, or commercial UTM
- **IoT Hub**: Dedicated controller for device management

## Getting Started

1. Review the [network-topology.md](network-topology.md) for overall architecture
2. Understand [subnet-design.md](subnet-design.md) for IP addressing
3. Reference [iot-devices.md](iot-devices.md) for device requirements
4. Implement [vlan-configuration.md](vlan-configuration.md) for network segmentation
5. Apply [security-policies.md](security-policies.md) for hardening

## Compliance Considerations

- **Data Privacy**: IoT data handling per GDPR/CCPA requirements
- **PCI DSS**: Payment processing network isolation
- **NIST Cybersecurity Framework**: Security control implementation
- **Local Building Codes**: Fire/safety system integration requirements
