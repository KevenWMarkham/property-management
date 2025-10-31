# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A property management system built with Next.js 16, TypeScript, Drizzle ORM, and SQLite.

## Development Setup

### Prerequisites
- Node.js (latest LTS version recommended)

### Installation
```bash
npm install
```

### Development Commands
- `npm run dev` - Start the Next.js development server (http://localhost:3000)
- `npm run build` - Build the production application
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint

### Database Commands
- `npm run db:push` - Push schema changes to SQLite database (use during development)
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply migrations to the database
- `npm run db:studio` - Open Drizzle Studio to view/edit database (https://local.drizzle.studio)

## Architecture

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS v4 with custom design tokens

### Database Schema
The SQLite database (`sqlite.db`) includes the following tables:
- **properties**: Property information (address, type, units)
- **tenants**: Tenant contact and emergency information
- **leases**: Lease agreements linking properties and tenants
- **payments**: Rent payment tracking (amounts stored in cents)
- **maintenance_requests**: Maintenance and repair requests

All tables include `created_at` and `updated_at` timestamps.

### Project Structure
- `src/app/` - Next.js App Router pages and layouts
- `src/db/` - Database configuration and schema
  - `schema.ts` - Drizzle ORM table definitions
  - `index.ts` - Database connection instance
- `drizzle.config.ts` - Drizzle Kit configuration
- `sqlite.db` - SQLite database file (gitignored)

## Key Domains

Property management systems typically involve these core domains:
- **Properties**: Building/unit management, amenities, documents
- **Tenants**: Contact info, lease history, payment records
- **Leases**: Terms, renewals, terminations
- **Payments**: Rent collection, late fees, payment history
- **Maintenance**: Work orders, vendor management, scheduling
- **Communications**: Notifications, announcements, messaging

## Important Considerations

- Ensure proper data isolation between different properties/landlords
- Handle timezone conversions for lease dates and payment due dates
- Maintain audit trails for financial transactions
- Implement proper access control (landlords, property managers, tenants, maintenance staff)
- Consider compliance requirements (fair housing laws, security deposit regulations, data privacy)
