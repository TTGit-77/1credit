# NutriFlow Health & Nutrition App

## Overview

NutriFlow is a comprehensive health and nutrition web application that provides personalized meal planning, task management, and health insights. The application is built with a modern full-stack architecture using React for the frontend, Express.js for the backend, and PostgreSQL for data storage.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom health-focused design system
- **UI Components**: Radix UI primitives with shadcn/ui components
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Animations**: Framer Motion for smooth UI interactions

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Runtime**: Node.js with ES modules
- **Authentication**: Replit Auth integration with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with JSON responses

### Database Architecture
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon serverless driver with WebSocket support

## Key Components

### Authentication System
- **Provider**: Replit Auth with OpenID Connect
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **User Management**: Automatic user creation and profile management
- **Security**: HTTP-only cookies with secure session handling

### Data Models
- **Users**: Basic user information from Replit Auth
- **User Profiles**: Detailed health information (age, weight, dietary preferences, goals)
- **Meal Plans**: Personalized meal planning with calendar integration
- **Tasks**: Health-related task management and tracking
- **Health News**: Curated health and nutrition content
- **User Progress**: Achievement tracking and analytics

### Frontend Components
- **Dashboard**: Multi-tab interface with overview, meal plans, tasks, and news
- **Onboarding**: Step-by-step profile setup with health preferences
- **Meal Planning**: Visual meal cards with completion tracking
- **Task Management**: Interactive task lists with progress tracking
- **Health News**: Categorized news feed with filtering

### API Endpoints
- **Authentication**: `/api/auth/user`, `/api/login`, `/api/logout`
- **Profile Management**: `/api/profile` (GET, POST)
- **Meal Plans**: `/api/meal-plans` with date filtering and generation
- **Tasks**: `/api/tasks` with date filtering and completion tracking
- **Health News**: `/api/health-news` with category filtering

## Data Flow

1. **User Authentication**: Replit Auth handles OAuth flow, creates/updates user records
2. **Profile Setup**: Onboarding flow captures detailed health preferences
3. **Meal Planning**: System generates personalized meal plans based on user profile
4. **Task Management**: Users create and track health-related tasks
5. **Progress Tracking**: System monitors completion rates and achievements
6. **Content Delivery**: Curated health news served based on user interests

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **drizzle-orm**: Type-safe database operations
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI primitives
- **framer-motion**: Animation library
- **tailwindcss**: Utility-first CSS framework

### Authentication
- **openid-client**: OpenID Connect implementation
- **passport**: Authentication middleware
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution
- **esbuild**: Production bundling

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with hot module replacement
- **Database**: Neon serverless PostgreSQL with automatic provisioning
- **Environment**: Replit development environment with integrated tooling

### Production Build
- **Frontend**: Vite builds optimized React bundle to `dist/public`
- **Backend**: esbuild bundles Express server to `dist/index.js`
- **Assets**: Static assets served from build directory
- **Database**: Production PostgreSQL via environment variables

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Session encryption key
- **REPLIT_DOMAINS**: Allowed domains for Replit Auth
- **ISSUER_URL**: OpenID Connect issuer endpoint

### Key Features
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Updates**: Optimistic updates with TanStack Query
- **Offline Support**: Query caching for improved performance
- **Accessibility**: ARIA-compliant components throughout
- **Type Safety**: End-to-end TypeScript with shared schema validation

The application follows a modern full-stack architecture with emphasis on type safety, user experience, and scalability. The health-focused design system provides a cohesive visual experience while the modular component architecture enables easy maintenance and feature additions.