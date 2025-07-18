# NutriFlow - Enterprise-Grade Diet and Meal Planner Web Application

## Features

- **User Authentication**: (Optional) Local or mock login for demo
- **Personalized Meal Planning**: 3-day meal plans based on user preferences (height, weight, dietary preferences)
- **Multi-Cuisine Support**: Indian, Italian, French, South Indian cuisines
- **Task Management**: Health-related task tracking and completion
- **Health News Feed**: Curated health and nutrition articles with filtering
- **Professional UI**: Glassmorphism effects and enterprise-grade design
- **Progress Tracking**: User achievement monitoring and analytics

## Tech Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js + TypeScript, Mongoose (MongoDB)
- **Database**: MongoDB
- **State Management**: TanStack Query
- **Styling**: Professional glassmorphism design system

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   DATABASE_URL=mongodb://localhost:27017/dietplannerpro
   SESSION_SECRET=your_session_secret
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Architecture

- **Frontend**: Modern React architecture with TypeScript
- **Backend**: RESTful API with Express.js
- **Database**: MongoDB with Mongoose for type-safe operations
- **Authentication**: (Optional) Local or mock session management

## Database Schema

- Users and user profiles with health preferences
- Meal plans with personalized recommendations
- Task management for health goals
- Health news content management
- Progress tracking and analytics

## Deployment

The application is designed for deployment on any Node.js/MongoDB-compatible environment.

## Environment Variables Required

```bash
DATABASE_URL=mongodb://localhost:27017/dietplannerpro
SESSION_SECRET=your_session_secret_key
```

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Status

The application is fully functional with:
- ✅ All TypeScript errors resolved
- ✅ Database schema synchronized
- ✅ Professional UI implementation complete