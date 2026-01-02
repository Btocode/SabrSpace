# SabrSpace

## Overview

SabrSpace is a bilingual (English/Bangla) web application that enables authenticated users to create shareable question sets and collect anonymous or named responses. The platform features an Islamic-inspired design aesthetic with features like optional religious attestation for respondents. Users can create question sets with various settings (anonymous responses, attestation requirements, multiple submissions), share them via unique tokens, and view response analytics on a dashboard.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing with protected route patterns
- **State Management**: TanStack React Query for server state, React Context for language/locale
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Islamic-inspired color palette (teal/green primary, gold accent)
- **Animations**: Framer Motion for page transitions and UI animations
- **Charts**: Recharts for dashboard analytics visualization

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful endpoints defined in `@shared/routes.ts` with Zod validation
- **Authentication**: Replit Auth integration using OpenID Connect with Passport.js
- **Session Management**: Express sessions stored in PostgreSQL via connect-pg-simple

### Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (DATABASE_URL driven configuration)
- **Schema Location**: `shared/schema.ts` contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)

### Key Design Patterns
- **Shared Types**: Schema and route definitions in `shared/` directory are used by both client and server
- **API Contract**: Routes defined with Zod schemas for input validation and response typing
- **Storage Interface**: `IStorage` interface in `server/storage.ts` abstracts database operations
- **Path Aliases**: `@/` for client source, `@shared/` for shared modules

### Build System
- **Development**: Vite dev server with HMR, proxied through Express
- **Production**: Vite builds client to `dist/public`, esbuild bundles server to `dist/index.cjs`
- **Server Bundling**: Selective dependency bundling for faster cold starts

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Session Storage**: Sessions table required for Replit Auth

### Authentication
- **Replit Auth**: OpenID Connect integration with Replit's identity provider
- **Required Environment Variables**: `ISSUER_URL`, `REPL_ID`, `SESSION_SECRET`, `DATABASE_URL`

### Third-Party Libraries
- **Radix UI**: Accessible component primitives for shadcn/ui
- **TanStack Query**: Data fetching and caching
- **Zod**: Runtime type validation for API contracts
- **date-fns**: Date formatting utilities
- **Framer Motion**: Animation library
- **Recharts**: Charting library for analytics