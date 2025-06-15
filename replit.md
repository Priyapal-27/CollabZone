# CollabZone - Intra-College Event Management System

## Overview

CollabZone is a full-stack web application designed to connect multiple colleges and manage inter-college events. The platform allows colleges to register, create events, and facilitate student participation across institutions. It serves as a collaborative platform where educational institutions can share events, build communities, and manage registrations efficiently.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI
- **State Management**: TanStack Query (React Query) for server state management
- **Build Tool**: Vite for fast development and optimized production builds
- **Theme System**: Light/dark mode support with system preference detection
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules for modern JavaScript features
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Database Provider**: Neon Database (@neondatabase/serverless) for serverless PostgreSQL
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **Development**: Hot reload development server with tsx

### Project Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express.js application
├── shared/           # Shared TypeScript types and database schemas
└── migrations/       # Database migration files
```

## Key Components

### Database Schema
The application uses a PostgreSQL database with the following main entities:

- **Users**: Basic user authentication system
- **Colleges**: Institution profiles with approval workflow, contact information, and student counts
- **Events**: Comprehensive event management with categories (Technical, Cultural, Sports, Workshop), fees, participant tracking, and contact details
- **Registrations**: Event registration system with participant details and payment proof upload
- **Feed Posts**: Social feed functionality for college communities
- **Admins**: Super admin management system for platform oversight

### Authentication & Authorization
The system implements role-based access control:

- **Public Access**: Browse colleges, events, and social feed without authentication
- **College Admins**: Session-based authentication for college administrators to manage their institution's profile and events
- **Super Admins**: Separate admin authentication for platform-wide management and moderation

### User Roles & Permissions
1. **Public Users**: Can browse colleges, view events, register for events, and view social feed
2. **College Admins**: Can manage college profile, create/edit/delete events, view registrations, and manage their institution's presence
3. **Super Admins**: Can approve colleges, moderate content, view analytics, and manage platform-wide settings

## Data Flow

### Event Management Flow
1. College admins create events with detailed information including dates, fees, eligibility criteria
2. Events are published and visible to all users across the platform
3. Students can register for events with payment proof upload for paid events
4. College admins can view and manage registrations, export participant data

### College Registration Flow
1. Colleges register through the admin panel with institutional details
2. Super admins review and approve college registrations
3. Approved colleges gain access to event management features
4. Colleges can update their profiles and manage their events

### Social Feed System
1. Users can create posts to share updates and announcements
2. Posts go through a moderation system managed by super admins
3. Approved posts are visible in the community feed
4. Feeds help build inter-college community engagement

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations with PostgreSQL
- **@tanstack/react-query**: Server state management and caching
- **wouter**: Lightweight routing solution for React applications
- **@radix-ui/***: Headless UI components for accessibility and consistency
- **tailwindcss**: Utility-first CSS framework for styling
- **react-hook-form**: Performant forms with easy validation
- **zod**: TypeScript-first schema validation

### Development Tools
- **vite**: Fast build tool and development server
- **tsx**: TypeScript execution for Node.js development
- **drizzle-kit**: Database migration and schema management tools

## Deployment Strategy

### Production Build Process
1. **Frontend Build**: Vite compiles React application with TypeScript and optimizations
2. **Backend Build**: esbuild bundles Node.js server with TypeScript compilation
3. **Database**: Migrations are applied using Drizzle Kit push command
4. **Deployment**: Configured for autoscale deployment on Replit

### Environment Configuration
- Development server runs on port 5000 with hot reload
- Production deployment uses external port 80
- Database connection via environment variable `DATABASE_URL`
- Session management uses PostgreSQL for persistence

### File Structure Organization
- Client assets built to `dist/public` directory
- Server bundle output to `dist` directory
- Shared schemas and types accessible from both client and server
- Static assets served from server in production

## Changelog

- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.