# NutriFlow - Deployment Guide

## Project Structure Overview

```
1credit/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utility libraries
│   │   ├── pages/         # Application pages
│   │   ├── App.tsx        # Main application component
│   │   ├── index.css      # Global styles with glassmorphism
│   │   └── main.tsx       # Application entry point
│   └── index.html         # HTML template
├── server/                # Express.js backend
│   ├── db.ts             # Database connection setup
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes definition
│   ├── storage.ts        # Database operations
│   ├── replitAuth.ts     # Authentication middleware
│   └── vite.ts           # Development server config
├── shared/               # Shared types and schemas
│   └── schema.ts         # Database schema definitions
├── README.md             # Project documentation
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies and scripts
├── replit.md            # Project architecture docs
└── Configuration files (TypeScript, Tailwind, Vite, etc.)
```

## Features Implemented

### ✅ Authentication System
- Replit Auth integration with OpenID Connect
- Secure session management with PostgreSQL storage
- User profile management with onboarding flow

### ✅ Database Architecture
- PostgreSQL with Drizzle ORM
- Complete schema: users, profiles, meal plans, tasks, health news
- Type-safe database operations throughout

### ✅ Frontend Features
- Professional glassmorphism UI design
- Responsive layout with mobile support
- Dashboard with multiple sections
- Personalized meal planning system
- Task management and tracking
- Health news feed with filtering

### ✅ Backend API
- RESTful API endpoints
- Authentication middleware
- Data validation with Zod schemas
- Error handling and logging

## Manual Git Setup Commands

Since Git operations are restricted in the Replit environment, run these commands in your local terminal:

```bash
# Navigate to your project directory
cd /path/to/your/project

# Remove any existing Git locks (if needed)
rm -f .git/config.lock .git/index.lock

# Add all files to Git
git add .

# Commit with descriptive message
git commit -m "Initial commit - NutriFlow enterprise diet planner

Features:
- Professional UI with glassmorphism effects
- User authentication with Replit Auth
- Personalized meal planning system
- Task management and health tracking
- PostgreSQL database with comprehensive schema
- Type-safe operations with TypeScript"

# Set main branch
git branch -M main

# Add your remote repository
git remote add origin https://github.com/TTGit-77/1credit.git

# Push to GitHub
git push -u origin main
```

## Environment Variables Required

```bash
DATABASE_URL=your_postgresql_connection_string
SESSION_SECRET=your_session_secret_key
REPLIT_DOMAINS=your_replit_domain
ISSUER_URL=https://replit.com/oidc
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Push database schema
npm run db:push

# Build for production
npm run build
```

## Key Technologies

- **Frontend**: React 18, TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js, TypeScript, Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **State Management**: TanStack Query
- **Build Tools**: Vite, ESBuild

## Project Status

The application is fully functional with:
- ✅ All TypeScript errors resolved
- ✅ Database schema synchronized
- ✅ Professional UI implementation complete
- ✅ Authentication system working
- ✅ API endpoints implemented
- ✅ Ready for production deployment

## Next Steps

1. Run the manual Git commands above to push to your repository
2. Configure environment variables in your deployment platform
3. Set up continuous deployment from your GitHub repository
4. Test all features in production environment