# CollabZone - Intra-College Event Management System

## Overview

CollabZone is a full-stack web application designed to connect multiple colleges and manage inter-college events. The platform allows colleges to register, create events, and facilitate student participation across institutions while maintaining a collaborative social feed.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: React Query (TanStack Query) for server state
- **Build Tool**: Vite for development and production builds
- **Theme System**: Light/dark mode support with system preference detection

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **Development**: Hot reload with tsx

### Project Structure
```
├── client/           # Frontend React application
├── server/           # Backend Express.js application
├── shared/           # Shared TypeScript types and schemas
└── migrations/       # Database migration files
```

## Key Components

### Database Schema
- **Users**: Basic user authentication
- **Colleges**: Institution profiles with approval workflow
- **Events**: Event management with categories, fees, and participant tracking
- **Registrations**: Event registration system with payment proof upload
- **Feed Posts**: Social feed for college communities
- **Admins**: Super admin management system

### Authentication & Authorization
- **College Admin**: Session-based authentication for college administrators
- **Super Admin**: Separate admin authentication for platform management
- **Public Access**: Event browsing and registration without authentication

### User Roles & Permissions
1. **Public Users**: Browse colleges, events, and social feed
2. **College Admins**: Manage college profile, create/edit events, view registrations
3. **Super Admins**: Approve colleges, moderate content, system oversight

### Event Management
- **Categories**: Technical, Cultural, Sports, Workshop
- **Registration System**: Form-based with file upload for payment proof
- **Participant Tracking**: Current vs maximum participants
- **Fee Management**: Decimal pricing with revenue tracking

### Social Features
- **Feed Posts**: College-based social sharing with moderation
- **Content Moderation**: Admin approval system for posts
- **Community Building**: Inter-college social interaction

## Data Flow

### College Registration Flow
1. College submits registration form
2. Admin reviews and approves/rejects
3. Approved colleges gain access to admin dashboard
4. Colleges can create and manage events

### Event Participation Flow
1. Students browse events across colleges
2. Registration through detailed forms
3. Payment proof upload (if fee required)
4. College admins track registrations
5. Event analytics and reporting

### Content Moderation Flow
1. Colleges/users create feed posts
2. Posts require admin approval
3. Approved content appears in public feed
4. Ongoing moderation capabilities

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL via Neon Database
- **UI Components**: Radix UI primitives
- **Form Handling**: React Hook Form with Zod validation
- **Styling**: Tailwind CSS with CSS variables
- **Icons**: Lucide React

### Development Tools
- **Build**: Vite with React plugin
- **Type Checking**: TypeScript strict mode
- **Database**: Drizzle Kit for migrations
- **Session Store**: PostgreSQL session storage

### Production Dependencies
- **Date Handling**: date-fns for date manipulation
- **Validation**: Zod schemas with Drizzle integration
- **Image Processing**: Built-in file upload handling

## Deployment Strategy

### Replit Configuration
- **Platform**: Autoscale deployment target
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Development**: `npm run dev` on port 5000
- **Database**: PostgreSQL 16 module enabled

### Environment Setup
- **NODE_ENV**: Automatically set for development/production
- **DATABASE_URL**: Required environment variable for PostgreSQL connection
- **Port Configuration**: Internal port 5000 mapped to external port 80

### Build Process
1. **Frontend**: Vite builds React app to `dist/public`
2. **Backend**: esbuild bundles server to `dist/index.js`
3. **Assets**: Static files served from built frontend
4. **Database**: Migrations applied via `npm run db:push`

### Development Workflow
- **Hot Reload**: Vite dev server with HMR
- **Type Checking**: `npm run check` for TypeScript validation
- **Database Changes**: Drizzle Kit push for schema updates

Changelog:
- June 14, 2025. Initial setup

User Preferences:
Preferred communication style: Simple, everyday language.