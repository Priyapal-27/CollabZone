# CollabZone - Intra-College Event Management System

## Overview

CollabZone is a full-stack web application designed to connect multiple colleges for seamless event management, registration, and social interactions. The platform serves as a central hub where colleges can register, post events, and users from different institutions can explore and participate in inter-college activities.

## System Architecture

### Frontend Architecture
- **Framework**: React.js with JavaScript (not TypeScript)
- **Routing**: React Router DOM for client-side navigation
- **Styling**: Tailwind CSS with custom theming support
- **HTTP Client**: Axios for API communication
- **State Management**: React hooks and local state
- **Theme System**: Context-based dark/light mode with localStorage persistence

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: Currently using in-memory storage arrays (ready for MongoDB integration)
- **Authentication**: JWT-based (prepared but not fully implemented)
- **API Design**: RESTful endpoints with CORS enabled
- **File Structure**: Modular separation between server and client code

### Development Setup
- **Build Tool**: Vite for frontend bundling and development server
- **Module System**: ES6 modules throughout the application
- **Development Workflow**: Hot reloading with proxy configuration for API calls

## Key Components

### Public-Facing Features
1. **College Discovery**: Browse and explore participating colleges with detailed profiles
2. **Event Management**: View upcoming and past events with comprehensive details
3. **Registration System**: User-friendly event registration with form validation
4. **Social Feed**: Inter-college community interaction platform
5. **Contact System**: Support and inquiry management

### Administrative Features
1. **College Admin Portal**: Dashboard for college administrators to manage their events
2. **Event Creation**: Comprehensive event creation with multiple data fields
3. **Registration Tracking**: View and export event registrations
4. **System Admin Panel**: Platform-wide management and moderation tools

### UI/UX Components
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Theme Toggle**: Dark/light mode switching with system preference detection
- **Loading States**: Consistent loading indicators across the application
- **Error Handling**: User-friendly error messages and fallback states

## Data Flow

### Frontend Data Flow
1. Components make API calls using centralized Axios instance
2. Authentication tokens are automatically attached to requests
3. Error responses trigger appropriate user feedback
4. Loading states are managed at component level
5. Data is cached in component state or localStorage when appropriate

### Backend Data Flow (Current Implementation)
1. Express server handles incoming requests with CORS middleware
2. In-memory arrays simulate database operations
3. Mock authentication validates college and admin access
4. JSON responses maintain consistent API structure
5. File uploads are prepared for local storage or cloud integration

### Authentication Flow
- JWT tokens stored in localStorage
- Automatic token attachment via Axios interceptors
- Role-based routing (public, college admin, system admin)
- Session management with automatic logout on token expiration

## External Dependencies

### Frontend Dependencies
- **React Ecosystem**: React, React Router DOM, React hooks
- **Radix UI**: Comprehensive component library for accessible UI elements
- **HTTP & Data**: Axios for API calls, TanStack React Query for data fetching
- **Styling**: Tailwind CSS, class-variance-authority for conditional styling
- **Utilities**: date-fns for date manipulation, clsx for conditional classes

### Backend Dependencies
- **Server Framework**: Express.js with CORS middleware
- **Database**: Drizzle ORM prepared for PostgreSQL/Neon integration
- **Authentication**: Express session management with connect-pg-simple
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Development Tools
- **Build System**: Vite with React plugin
- **Code Quality**: TypeScript checking without full conversion
- **Environment**: Environment variable support for configuration

## Deployment Strategy

### Replit Configuration
- **Runtime**: Node.js 20 environment
- **Development**: `npm run dev` starts both frontend and backend
- **Production Build**: Vite builds frontend, esbuild bundles backend
- **Port Configuration**: Backend on port 5000, proxied through Vite dev server
- **Deployment Target**: Autoscale deployment with proper build commands

### File Structure
```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route components
│   │   ├── college-admin/  # College admin panel
│   │   └── admin/          # System admin panel
├── server/                 # Backend Express application
│   ├── index.js           # Main server file
│   └── index.ts           # TypeScript entry point
└── attached_assets/       # Project assets and documentation
```

### Environment Setup
- Development and production environment variables supported
- Proxy configuration for seamless API integration during development
- Static file serving for uploaded content
- CORS configuration for cross-origin requests

### Database Migration Path
The application is architected to easily transition from in-memory storage to MongoDB:
1. Replace array operations with MongoDB collection methods
2. Implement proper connection management
3. Add data validation and schema enforcement
4. Integrate with cloud database services (MongoDB Atlas)

## Changelog

- June 15, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.