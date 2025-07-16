# 1credit

NutriFlow - Enterprise-Grade Diet and Meal Planner Web Application

## Features

- **User Authentication**: Secure login with Replit Auth integration
- **Personalized Meal Planning**: 3-day meal plans based on user preferences (height, weight, dietary preferences)
- **Multi-Cuisine Support**: Indian, Italian, French, South Indian cuisines
- **Task Management**: Health-related task tracking and completion
- **Health News Feed**: Curated health and nutrition articles with filtering
- **Professional UI**: Glassmorphism effects and enterprise-grade design
- **Progress Tracking**: User achievement monitoring and analytics

## Tech Stack

- **Frontend**: React 18 + TypeScript, Tailwind CSS, Radix UI
- **Backend**: Express.js + TypeScript, Drizzle ORM
- **Database**: PostgreSQL (Neon serverless)
- **Authentication**: Replit Auth with OpenID Connect
- **State Management**: TanStack Query
- **Styling**: Professional glassmorphism design system

## Quick Start

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   DATABASE_URL=your_postgresql_url
   SESSION_SECRET=your_session_secret
   ```

3. Push database schema:
   ```bash
   npm run db:push
   ```

4. Start development server:
   ```bash
   npm run dev
   ```

## Architecture

- **Frontend**: Modern React architecture with TypeScript
- **Backend**: RESTful API with Express.js
- **Database**: PostgreSQL with Drizzle ORM for type-safe operations
- **Authentication**: Secure session management with PostgreSQL storage

## Database Schema

- Users and user profiles with health preferences
- Meal plans with personalized recommendations
- Task management for health goals
- Health news content management
- Progress tracking and analytics

## Deployment

The application is designed for deployment on Replit with automatic environment configuration and database provisioning.