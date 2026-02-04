# Online Learning System

## Overview

This is a full-stack online learning management system built for educational institutions. It provides separate interfaces for administrators and students to manage subjects, activities, announcements, learning materials, and student profiles. The application uses a client-side storage approach with localStorage to simulate backend functionality, making it a frontend-focused prototype that can be extended with a real database backend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React Context for auth state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design tokens and CSS variables
- **Forms**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express 5
- **Structure**: Minimal server that primarily serves static files
- **Development**: Vite middleware for HMR during development
- **Production**: Static file serving from built assets

### Data Storage
- **Current Implementation**: Browser localStorage simulating a database
- **Storage Service**: Custom storage abstraction layer in `client/src/lib/storage.ts`
- **Schema Definitions**: Zod schemas in `client/src/lib/types.ts` for type safety
- **Database Ready**: Drizzle ORM configured with PostgreSQL dialect for future migration

### Authentication
- **Approach**: Client-side authentication using localStorage
- **User Roles**: Admin and Student with role-based route protection
- **Session**: Stored in localStorage under `ols_current_user` key
- **Default Admin**: Username `admin`, password `admin123`

### Key Design Patterns
- **Protected Routes**: HOC wrapper checking auth state and role permissions
- **Layout Shell**: Shared navigation component adapting to user role
- **Custom Hooks**: `use-store.ts` provides CRUD operations via React Query mutations
- **Component Library**: Reusable UI components following shadcn/ui conventions

### Directory Structure
```
client/
├── src/
│   ├── components/ui/    # shadcn/ui components
│   ├── components/       # App-specific components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utilities, storage, types
│   └── pages/            # Route components (admin/, student/)
server/
├── index.ts              # Express server entry
├── routes.ts             # API route registration
├── static.ts             # Production static serving
└── vite.ts               # Development Vite integration
shared/
└── schema.ts             # Drizzle database schema
```

## External Dependencies

### UI Framework
- **Radix UI**: Accessible, unstyled component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Data & Forms
- **TanStack React Query**: Async state management and caching
- **React Hook Form**: Form state management
- **Zod**: Schema validation and TypeScript inference
- **date-fns**: Date formatting and manipulation

### Database (Prepared for future use)
- **Drizzle ORM**: TypeScript ORM with PostgreSQL dialect
- **drizzle-zod**: Generate Zod schemas from Drizzle tables
- **PostgreSQL**: Target database (requires DATABASE_URL environment variable)

### Development Tools
- **Vite**: Build tool with React plugin
- **TypeScript**: Type checking
- **esbuild**: Server bundling for production

### Fonts
- **Outfit**: Display/heading font
- **Plus Jakarta Sans**: Body text font
- Loaded via Google Fonts CDN