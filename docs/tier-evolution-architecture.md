# Tier-Based Architecture Evolution Document

**Project**: Smart Property Management System
**Document Version**: 1.0
**Last Updated**: October 31, 2025
**Author**: Development Team

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Tier Definitions](#tier-definitions)
4. [Phase-by-Tier Evolution](#phase-by-tier-evolution)
5. [Current State (Post-Phase 1)](#current-state-post-phase-1)
6. [Tier Dependencies](#tier-dependencies)
7. [Technology Stack by Tier](#technology-stack-by-tier)

---

## Executive Summary

This document provides a tier-based view of the Smart Property Management System's evolution across development phases. It maps features and capabilities to architectural tiers, enabling stakeholders to understand the system's maturity at each layer and plan infrastructure, security, and integration requirements accordingly.

**Key Architectural Tiers**:
- UX/Presentation Tier (Forms, UI Components)
- Business Logic Tier (Validation, Workflows)
- Integration Tier (APIs, External Services)
- Data Layer Tier (Database, ORM)
- Security Tier (Auth, Authorization, Encryption)
- Network Tier (Connectivity, VPN, DNS)
- Infrastructure Tier (Servers, Storage, Monitoring)
- Hardware Tier (Physical Devices, IoT)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     USER EXPERIENCE TIER                     │
│  Web UI • Mobile Web • Admin Portal • Guest Portal          │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   BUSINESS LOGIC TIER                        │
│  Validation • Workflows • Calculations • State Management    │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    INTEGRATION TIER                          │
│  REST APIs • Home Assistant • N8N • AI Services             │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER TIER                          │
│  SQLite • Drizzle ORM • Migrations • Backups                │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     SECURITY TIER                            │
│  Authentication • Authorization • Encryption • Audit Logs    │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      NETWORK TIER                            │
│  TwinGate VPN • Local Network • DNS • SSL/TLS              │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   INFRASTRUCTURE TIER                        │
│  Zimaboard/Beelink • Docker • Monitoring • Backups         │
└─────────────────────────────────────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     HARDWARE TIER                            │
│  Smart Locks • Thermostats • Sensors • Cameras             │
└─────────────────────────────────────────────────────────────┘
```

---

## Tier Definitions

### 1. UX/Presentation Tier
**Purpose**: User interface and interaction layer
**Components**: Web pages, forms, dashboards, mobile interfaces
**Technologies**: React, Next.js, Tailwind CSS, TypeScript
**Responsibilities**:
- Render UI components
- Handle user interactions
- Client-side validation
- State management
- Responsive design

### 2. Business Logic Tier
**Purpose**: Core application logic and rules
**Components**: Validation schemas, workflows, calculations
**Technologies**: Zod, TypeScript, React Hooks
**Responsibilities**:
- Data validation (client & server)
- Business rule enforcement
- Calculations (rent, totals, dates)
- Workflow orchestration
- State transitions

### 3. Integration Tier
**Purpose**: External system connectivity
**Components**: REST APIs, webhooks, third-party services
**Technologies**: Next.js API Routes, Axios, WebSockets
**Responsibilities**:
- RESTful API endpoints
- Home Assistant integration
- N8N automation workflows
- AI service integration (Claude, OpenAI)
- External payment gateways

### 4. Data Layer Tier
**Purpose**: Data persistence and retrieval
**Components**: Database, ORM, migrations, backups
**Technologies**: SQLite, Drizzle ORM, Drizzle Kit
**Responsibilities**:
- Data storage
- Query optimization
- Schema management
- Data migrations
- Backup and recovery

### 5. Security Tier
**Purpose**: Authentication, authorization, and data protection
**Components**: Auth providers, session management, encryption
**Technologies**: NextAuth.js, JWT, bcrypt, HTTPS
**Responsibilities**:
- User authentication
- Role-based access control (RBAC)
- API key management
- Data encryption (at rest & in transit)
- Audit logging
- CSRF/XSS protection

### 6. Network Tier
**Purpose**: Network connectivity and routing
**Components**: VPN, DNS, load balancing, SSL certificates
**Technologies**: TwinGate VPN, Cloudflare, Let's Encrypt
**Responsibilities**:
- Secure remote access
- Local network connectivity
- DNS management
- SSL/TLS termination
- Firewall rules

### 7. Infrastructure Tier
**Purpose**: Compute and storage resources
**Components**: Servers, containers, monitoring, backups
**Technologies**: Zimaboard/Beelink, Docker, Prometheus, Grafana
**Responsibilities**:
- Application hosting
- Container orchestration
- Resource monitoring
- Log aggregation
- Automated backups
- Disaster recovery

### 8. Hardware Tier
**Purpose**: Physical IoT devices and sensors
**Components**: Smart home devices, sensors, actuators
**Technologies**: Home Assistant, Z-Wave, Zigbee, WiFi
**Responsibilities**:
- Device control
- Sensor data collection
- Physical automation
- Device firmware updates
- Hardware health monitoring

---

## Phase-by-Tier Evolution

### Phase 1: Core Foundation (COMPLETE)

#### ✅ UX/Presentation Tier
**Status**: 70% Complete
- ✅ Admin dashboard layout
- ✅ Properties CRUD forms (list, detail, create, edit)
- ✅ Tenants CRUD forms (list, detail, create, edit)
- ✅ Bookings CRUD forms (list, detail, create, edit)
- ✅ Guests API support
- ✅ Command K palette
- ✅ Responsive design
- ✅ Loading states
- ✅ Empty states
- ✅ Dark input text styling
- ⏳ Guest portal (Phase 3)
- ⏳ Mobile optimization (Phase 3)

#### ✅ Business Logic Tier
**Status**: 80% Complete
- ✅ Zod validation schemas (7 entities)
- ✅ Client-side form validation
- ✅ Server-side validation
- ✅ Currency calculations (cents conversion)
- ✅ Date calculations (nights, durations)
- ✅ Total amount calculations
- ✅ State management (React hooks)
- ⏳ Complex workflows (check-in/out automation) - Phase 2
- ⏳ Business rules engine - Phase 3

#### ✅ Integration Tier
**Status**: 40% Complete
- ✅ REST API structure (admin endpoints)
- ✅ Properties API (GET, POST, PATCH, DELETE)
- ✅ Tenants API (GET, POST, PATCH, DELETE)
- ✅ Bookings API (GET, POST, PATCH, DELETE)
- ✅ Guests API (GET, POST, PATCH, DELETE)
- ✅ Next.js 15+ async params
- ✅ PATCH for partial updates
- ⏳ Home Assistant integration - Phase 2
- ⏳ N8N webhooks - Phase 2
- ⏳ AI services (Claude Code) - Phase 3
- ⏳ Payment gateway - Phase 4

#### ✅ Data Layer Tier
**Status**: 90% Complete
- ✅ SQLite database
- ✅ Drizzle ORM setup
- ✅ Schema definitions (8 tables)
- ✅ Foreign key relationships
- ✅ Timestamps (createdAt, updatedAt)
- ✅ Database in organized location (src/db/)
- ✅ Migration infrastructure
- ✅ Type-safe queries
- ⏳ Automated backups - Phase 2
- ⏳ Query optimization - Phase 3

#### ❌ Security Tier
**Status**: 20% Complete
- ✅ SQL injection prevention (ORM)
- ✅ Input validation (Zod)
- ✅ API route separation (admin/guest)
- ✅ Error message sanitization
- ❌ Authentication (Phase 3)
- ❌ Authorization/RBAC (Phase 3)
- ❌ Session management (Phase 3)
- ❌ CSRF protection (Phase 3)
- ❌ Rate limiting (Phase 3)
- ❌ API key management (Phase 2)

#### ❌ Network Tier
**Status**: 0% Complete
- ❌ TwinGate VPN setup (Phase 4)
- ❌ DNS configuration (Phase 4)
- ❌ SSL certificate (Phase 4)
- ❌ Firewall rules (Phase 4)
- ❌ Network monitoring (Phase 4)

#### ❌ Infrastructure Tier
**Status**: 10% Complete (Development Only)
- ✅ Local development environment
- ✅ Next.js dev server
- ❌ Production server (Zimaboard/Beelink) - Phase 4
- ❌ Docker containers - Phase 4
- ❌ Process manager (PM2) - Phase 4
- ❌ Monitoring (Prometheus/Grafana) - Phase 4
- ❌ Log aggregation - Phase 4
- ❌ Backup automation - Phase 4

#### ❌ Hardware Tier
**Status**: 0% Complete
- ❌ Smart lock integration (Phase 2)
- ❌ Thermostat control (Phase 2)
- ❌ Sensor monitoring (Phase 2)
- ❌ Camera integration (Phase 3)
- ❌ Device health monitoring (Phase 2)

---

### Phase 2: Home Assistant & IoT Integration (PLANNED)

#### 🔄 UX/Presentation Tier
**New Features**:
- IoT device dashboard
- Real-time sensor displays
- Device control panels
- Guest device permissions UI
- Automation rule builder

#### 🔄 Business Logic Tier
**New Features**:
- Check-in/out automation workflows
- Device permission rules
- Sensor threshold alerts
- Automated scheduling
- Energy optimization logic

#### 🔄 Integration Tier
**New Features**:
- ✨ Home Assistant REST API integration
- ✨ Home Assistant WebSocket connection
- ✨ N8N workflow automation
- ✨ Device state synchronization
- ✨ Event-driven webhooks
- Guest proxy API for device control

#### 🔄 Data Layer Tier
**New Features**:
- IoT device state caching
- Sensor data logging
- Device history tracking
- Performance metrics storage

#### 🔄 Security Tier
**New Features**:
- ✨ Home Assistant API key management
- ✨ Temporary guest access tokens
- Device permission scoping
- Audit logging for device access

#### ❌ Network Tier
**New Features**:
- ✨ Local network device discovery
- mDNS/Bonjour configuration
- IoT network segmentation (optional)

#### 🔄 Infrastructure Tier
**New Features**:
- ✨ Automated backup system
- Database optimization
- Performance monitoring

#### 🔄 Hardware Tier
**New Features**:
- ✨ Smart lock integration (Schlage, Yale)
- ✨ Thermostat control (Nest, Ecobee)
- ✨ Motion sensors
- ✨ Door/window sensors
- ✨ Water leak sensors
- ✨ Smoke detectors

---

### Phase 3: Guest Portal & Authentication (PLANNED)

#### 🔄 UX/Presentation Tier
**New Features**:
- ✨ Guest login portal
- ✨ Booking confirmation pages
- ✨ Guest device control interface
- ✨ Guest communication center
- Mobile-responsive guest app
- AI concierge chat interface

#### 🔄 Business Logic Tier
**New Features**:
- Guest session management
- Booking lifecycle workflows
- Communication templates
- AI prompt engineering
- Natural language processing

#### 🔄 Integration Tier
**New Features**:
- ✨ AI services (Claude, OpenAI)
- ✨ Email/SMS notifications (Twilio, SendGrid)
- Calendar sync (Google, Outlook)
- Payment gateway (Stripe/Square)

#### 🔄 Data Layer Tier
**New Features**:
- Guest session storage
- Communication history
- AI conversation logs
- Payment transaction records

#### 🔄 Security Tier
**New Features**:
- ✨ User authentication (NextAuth.js)
- ✨ Role-based access control (RBAC)
- ✨ Session management
- ✨ Password hashing (bcrypt)
- ✨ CSRF protection
- ✨ XSS prevention
- ✨ Rate limiting
- Two-factor authentication (2FA)
- Guest token expiration

#### ❌ Network Tier
**Status**: Planning phase
- Public endpoint configuration
- DDoS protection

#### ❌ Infrastructure Tier
**Status**: Planning phase
- SSL certificate setup
- CDN configuration (optional)

#### ❌ Hardware Tier
**New Features**:
- ✨ Camera integration (Ring, Nest)
- Video doorbell integration

---

### Phase 4: Production Deployment (PLANNED)

#### ✅ UX/Presentation Tier
**Enhancements**:
- Production build optimization
- Asset compression
- PWA capabilities
- Offline mode support

#### ✅ Business Logic Tier
**Enhancements**:
- Performance optimization
- Caching strategies
- Background job processing

#### ✅ Integration Tier
**Enhancements**:
- API versioning
- Webhook reliability
- Retry mechanisms
- Circuit breakers

#### ✅ Data Layer Tier
**Enhancements**:
- ✨ Automated daily backups
- ✨ Point-in-time recovery
- Database replication (optional)
- Query performance tuning

#### ✅ Security Tier
**Enhancements**:
- ✨ Production security hardening
- ✨ Penetration testing
- ✨ Security audit
- ✨ Vulnerability scanning
- Compliance review (GDPR, etc.)

#### ✅ Network Tier
**Production Setup**:
- ✨ TwinGate VPN deployment
- ✨ Custom domain setup
- ✨ SSL/TLS certificates (Let's Encrypt)
- ✨ Firewall configuration
- ✨ DDoS protection
- ✨ Network monitoring
- Load balancing (if needed)

#### ✅ Infrastructure Tier
**Production Setup**:
- ✨ Zimaboard/Beelink server setup
- ✨ Docker containerization
- ✨ Process management (PM2)
- ✨ Reverse proxy (Nginx)
- ✨ Prometheus monitoring
- ✨ Grafana dashboards
- ✨ Log aggregation (Loki/ELK)
- ✨ Alerting system
- ✨ Automated backup jobs
- ✨ Disaster recovery plan
- ✨ Capacity planning

#### ✅ Hardware Tier
**Production Setup**:
- ✨ All IoT devices commissioned
- ✨ Device firmware updates
- ✨ Redundant power supplies
- ✨ Network redundancy
- Hardware health monitoring
- Preventive maintenance schedule

---

## Current State (Post-Phase 1)

### Tier Completion Summary

| Tier | Status | Completion | Notes |
|------|--------|-----------|-------|
| **UX/Presentation** | 🟢 Active | 70% | Admin portal complete, guest portal pending |
| **Business Logic** | 🟢 Active | 80% | Core validation complete, automation pending |
| **Integration** | 🟡 Partial | 40% | Admin APIs complete, HA integration pending |
| **Data Layer** | 🟢 Active | 90% | Schema complete, backups pending |
| **Security** | 🔴 Limited | 20% | No authentication yet (Phase 3) |
| **Network** | 🔴 Not Started | 0% | Production deployment (Phase 4) |
| **Infrastructure** | 🔴 Dev Only | 10% | Local dev only, production pending |
| **Hardware** | 🔴 Not Started | 0% | Home Assistant integration (Phase 2) |

### Key Achievements (Phase 1)

✅ **UX Tier**:
- Complete CRUD interfaces for Properties, Tenants, Bookings
- Command K palette for quick navigation
- Responsive design with Tailwind CSS
- Dark, readable form inputs

✅ **Business Logic Tier**:
- Comprehensive Zod validation (7 entity schemas)
- Currency and date calculations
- Real-time form validation

✅ **Integration Tier**:
- RESTful API structure
- 4 complete API resource sets (Properties, Tenants, Bookings, Guests)
- Next.js 15+ compatibility

✅ **Data Layer Tier**:
- SQLite with Drizzle ORM
- 8 tables with relationships
- Type-safe queries
- Migration infrastructure

### Critical Gaps (Pre-Phase 2)

❌ **Security Tier**:
- No authentication system
- No authorization/RBAC
- API routes unprotected
- **Risk**: High - Production blocker

❌ **Hardware Tier**:
- No IoT integration
- No device control
- No automation
- **Impact**: Core business value unrealized

❌ **Infrastructure Tier**:
- No production environment
- No monitoring
- No automated backups
- **Risk**: Medium - Can't deploy

---

## Tier Dependencies

### Dependency Matrix

```
UX Tier
  ↓ depends on
Business Logic Tier
  ↓ depends on
Integration Tier
  ↓ depends on
Data Layer Tier
  ↓ secured by
Security Tier
  ↓ runs on
Network Tier
  ↓ runs on
Infrastructure Tier
  ↓ controls
Hardware Tier
```

### Critical Path for Phase 2

**Phase 2 Goal**: Home Assistant Integration

**Required Tier Progression**:
1. **Security Tier**: API key management (for Home Assistant)
2. **Integration Tier**: Home Assistant API client
3. **Data Layer Tier**: IoT device state tables
4. **Business Logic Tier**: Device permission rules
5. **UX Tier**: Device control interfaces
6. **Hardware Tier**: Physical device commissioning

**Blockers**:
- ⚠️ Security Tier API key management required before HA integration
- ⚠️ Infrastructure Tier backups required before production data

---

## Technology Stack by Tier

### UX/Presentation Tier
```
Framework:     Next.js 15 (React 19)
Styling:       Tailwind CSS v4
Language:      TypeScript (strict mode)
State:         React Hooks, Context API
UI Library:    cmdk (command palette)
Utilities:     clsx, tailwind-merge
Icons:         Heroicons (optional)
Forms:         React controlled components
```

### Business Logic Tier
```
Validation:    Zod 3.23+
Type Safety:   TypeScript
Utilities:     date-fns, decimal.js
State Machine: (Future) XState
Workflows:     (Future) Temporal
```

### Integration Tier
```
API:           Next.js API Routes
Protocol:      REST (JSON)
Client:        Fetch API, Axios
WebSocket:     (Future) Socket.io
Automation:    (Future) N8N
AI:            (Future) Anthropic Claude, OpenAI
Payments:      (Future) Stripe
Email:         (Future) Resend, SendGrid
SMS:           (Future) Twilio
```

### Data Layer Tier
```
Database:      SQLite 3
ORM:           Drizzle ORM
Migrations:    Drizzle Kit
Backups:       (Future) Litestream
Caching:       (Future) Redis
Search:        (Future) MeiliSearch
```

### Security Tier
```
Auth:          (Future) NextAuth.js
Sessions:      (Future) JWT, secure cookies
Passwords:     (Future) bcrypt
CSRF:          (Future) csurf
Rate Limit:    (Future) express-rate-limit
Encryption:    (Future) crypto (Node.js)
SSL/TLS:       (Future) Let's Encrypt
Audit:         (Future) Custom logging
```

### Network Tier
```
VPN:           (Future) TwinGate
Reverse Proxy: (Future) Nginx
SSL/TLS:       (Future) Let's Encrypt
DNS:           (Future) Cloudflare
Firewall:      (Future) UFW, iptables
Monitoring:    (Future) Uptime Kuma
```

### Infrastructure Tier
```
Server:        (Future) Zimaboard/Beelink
OS:            (Future) Ubuntu Server 22.04 LTS
Containers:    (Future) Docker, Docker Compose
Process Mgmt:  (Future) PM2
Web Server:    (Future) Nginx
Monitoring:    (Future) Prometheus, Grafana
Logging:       (Future) Loki, Winston
Backups:       (Future) rsync, Litestream
```

### Hardware Tier
```
Hub:           Home Assistant OS
Protocols:     Z-Wave, Zigbee, WiFi, Bluetooth
Locks:         (Future) Schlage Encode, Yale Assure
Thermostats:   (Future) Nest, Ecobee
Sensors:       (Future) Aqara, Wyze
Cameras:       (Future) Ring, Nest Cam
Network:       (Future) UniFi (optional)
```

---

## Evolution Roadmap

### Phase 1 ✅ (COMPLETE)
**Focus**: Foundation
**Tier Emphasis**: UX, Business Logic, Data Layer
**Key Deliverable**: Functional admin portal with CRUD operations

### Phase 2 🔄 (NEXT - Q1 2026)
**Focus**: IoT Integration
**Tier Emphasis**: Integration, Hardware
**Key Deliverable**: Home Assistant integration, device control

### Phase 3 📋 (Q2 2026)
**Focus**: Guest Experience & Security
**Tier Emphasis**: UX, Security
**Key Deliverable**: Guest portal with authentication

### Phase 4 🚀 (Q3 2026)
**Focus**: Production Deployment
**Tier Emphasis**: Network, Infrastructure
**Key Deliverable**: Production-ready system on Zimaboard/Beelink

### Phase 5+ 🌟 (Q4 2026+)
**Focus**: Advanced Features
**Tier Emphasis**: All tiers
**Key Deliverable**: AI concierge, advanced automation, mobile app

---

## Conclusion

This tier-based evolution document provides a clear roadmap for developing the Smart Property Management System across all architectural layers. By understanding the current state and dependencies of each tier, the development team can:

1. **Plan Infrastructure**: Know when to provision servers, configure networks, and deploy hardware
2. **Manage Security**: Understand when authentication and encryption are required
3. **Sequence Development**: Follow the critical path through dependent tiers
4. **Allocate Resources**: Focus effort on the right tier for each phase
5. **Track Progress**: Measure completion at each architectural layer

**Current State Summary**:
- **Strong Foundation**: UX, Business Logic, and Data Layer tiers are well-established
- **Integration Ready**: API structure supports Phase 2 Home Assistant integration
- **Security Gap**: Authentication required before guest portal (Phase 3)
- **Infrastructure Pending**: Production deployment requires Phase 4 network and infrastructure work

**Next Steps**:
1. Complete Phase 1 remaining UX improvements
2. Begin Phase 2 Home Assistant integration planning
3. Design security tier architecture for Phase 3
4. Scope infrastructure requirements for Phase 4

---

**Document Maintenance**:
- Review after each phase completion
- Update tier percentages based on actual progress
- Revise technology choices as needed
- Add lessons learned section

**Version History**:
- v1.0 (Oct 31, 2025): Initial document created post-Phase 1
