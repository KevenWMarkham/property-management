# Property Management System

A modern property management system built with Next.js, TypeScript, and SQLite.

## Features

- 🏢 **Property Management**: Track multiple properties, units, and details
- 👥 **Tenant Management**: Manage tenant information and contacts
- 📝 **Lease Tracking**: Handle lease agreements, terms, and renewals
- 💰 **Payment Processing**: Monitor rent payments and financial records
- 🔧 **Maintenance Requests**: Track and manage maintenance work orders

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Drizzle ORM
- **Styling**: Tailwind CSS v4
- **Runtime**: React 19

## Getting Started

### Installation

```bash
npm install
```

### Database Setup

The database schema is already configured. Push it to SQLite:

```bash
npm run db:push
```

### Development

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push schema changes to database
- `npm run db:generate` - Generate migration files
- `npm run db:migrate` - Apply migrations
- `npm run db:studio` - Open Drizzle Studio

## Database Schema

### Tables

- **properties**: Property information (address, type, units)
- **tenants**: Tenant contact information
- **leases**: Lease agreements linking properties to tenants
- **payments**: Rent payment records
- **maintenance_requests**: Maintenance and repair requests

## API Routes

### Properties

- `GET /api/properties` - List all properties
- `POST /api/properties` - Create a new property

## Project Structure

```
src/
├── app/              # Next.js App Router
│   ├── api/         # API routes
│   ├── layout.tsx   # Root layout
│   └── page.tsx     # Home page
└── db/              # Database
    ├── schema.ts    # Table definitions
    └── index.ts     # Database connection
```

## Development Notes

- Monetary values are stored in cents (integers) to avoid floating-point precision issues
- All timestamps use SQLite's CURRENT_TIMESTAMP
- The SQLite database file (`sqlite.db`) is gitignored
- Use Drizzle Studio to visually inspect and edit the database

## License

ISC
