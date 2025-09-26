# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Root Level Commands
- `bun run dev` - Start all apps in development mode
- `bun run build` - Build all apps and packages
- `bun run lint` - Lint all code across the monorepo
- `bun install` - Install dependencies for all packages

### Backend Development (apps/backend)
- `bun run dev` - Start backend server with hot reload
- `bun run build` - Build backend for production
- `bun run check` - TypeScript type checking without emit
- `bun run prisma:generate` - Generate Prisma client
- `bun run prisma:migrate` - Run database migrations
- `bun run create-admin` - Create admin user script
- `bun run check:email` - Test email configuration

### Mobile App Development (apps/mobile-app)
- `bun run start` - Start Expo development server
- `bun run ios` - Run on iOS simulator
- `bun run android` - Run on Android emulator
- `bun run lint` - Lint mobile app code
- `bun run build:preview` - Build preview version for testing
- `bun run build:production` - Build production version

### Testing
No unified test command found. Check individual package.json files for test scripts if needed.

## Project Architecture

### Monorepo Structure
This is a Turborepo-managed health and fitness application with three main components:

1. **Backend API** (`apps/backend`) - Hono.js server with Prisma ORM
2. **Mobile App** (`apps/mobile-app`) - React Native Expo app with HealthKit integration
3. **Core Package** (`packages/core`) - Shared business logic and type definitions

### Backend Architecture (`apps/backend`)

**API Structure Pattern:**
Each API module follows a consistent 5-file structure:
- `index.ts` - Router configuration and exports
- `routes.ts` - OpenAPI route definitions with Zod validation
- `handlers.ts` - Request handlers with authentication
- `service.ts` - Business logic and database operations
- `models.ts` - Zod schemas and TypeScript types

**Key Technologies:**
- **Framework:** Hono.js with OpenAPI support
- **Database:** PostgreSQL with Prisma ORM
- **Validation:** Zod schemas for type-safe request/response
- **Authentication:** API key-based (`x-api-key` header)
- **File Storage:** AWS S3 with presigned URLs

**API Modules:**
- `auth/` - Authentication and user management
- `user/` - User profiles and health metrics
- `nutrition/` - Food database and consumption tracking
- `workout/` - Exercise sessions and metrics
- `heart-rate/` - Heart rate data management
- `admin/` - Administrative functions and file uploads

### Mobile App Architecture (`apps/mobile-app`)

**Key Technologies:**
- **Framework:** React Native with Expo SDK
- **Navigation:** Expo Router with file-based routing
- **UI Framework:** Gluestack UI components with NativeWind/TailwindCSS
- **State Management:** Zustand for global state
- **Health Integration:** HealthKit via `@kingstinct/react-native-healthkit`
- **Data Fetching:** TanStack React Query with shared API client

**Key Features:**
- HealthKit data synchronization (heart rate, workouts, steps)
- Nutrition tracking with extensive macro/micronutrient data
- Workout logging with real-time heart rate monitoring
- User onboarding and profile management
- Live Activities and App Intents for iOS widgets

### Shared Core Package (`packages/core`)

**Purpose:** Provides type-safe business logic shared between backend and mobile app.

**Key Services:**
- `AuthService` - Login, signup, password management
- `UserService` - Profile management and streak tracking
- `NutritionService` - Food search and consumption logging
- `WorkoutService` - Exercise tracking with comprehensive metrics
- `HeartRateService` - Heart rate data management
- `StepsService`, `BodyMeasurementService`, `MobilityService`, `VitalSignsService` - Health metric tracking

**Architecture Pattern:**
- Type-safe API client using Hono's `hcWithType`
- Shared entity types between frontend and backend
- Centralized error handling with auth-aware interceptors
- Environment-configurable API endpoints

## Database Schema (Prisma)

**Core Models:**
- `User` - User profiles with health metrics and patient status
- `Food` - Comprehensive nutritional database (30+ nutrients)
- `FoodConsumption` - User food intake logging
- `Workout` - Exercise sessions with HealthKit integration
- `HeartRate` - Heart rate data points with workout association
- Various health metric models (Steps, BodyMeasurement, etc.)

**Key Features:**
- Soft deletion support for workouts
- Streak tracking for user engagement
- Calorie counting method preferences (HR, VO2, RER, EE)
- Admin file management system

## Authentication & API Patterns

**Authentication:** All API requests (except auth endpoints) require `x-api-key` header containing user token.

**Request/Response Pattern:**
- All routes use Zod validation for type safety
- Standardized error responses: `{ cause: string }`
- List endpoints return: `{ data: T[], pagination?: {...} }`
- Single item endpoints return the item directly

**Error Handling:**
- Specific error causes for better debugging
- Authentication errors trigger automatic logout
- Standardized HTTP status codes

## Development Guidelines

### Backend Development
- Follow the 5-file module structure for new APIs
- Use Zod for all request/response validation
- Include comprehensive OpenAPI documentation
- Handle database operations through Prisma
- Use specific error causes in service layer

### Mobile Development
- Use functional components with hooks
- Implement proper HealthKit permission handling
- Follow Expo best practices for navigation and assets
- Use Gluestack UI components for consistency
- Implement proper offline support for health data

### Shared Core Development
- Maintain type safety across service boundaries
- Update entity types when database schema changes
- Follow consistent service method patterns
- Handle authentication errors gracefully

## Health Data Integration

**HealthKit Integration:**
- Permissions configured in `config/healthkit-permissions.ts`
- Real-time heart rate monitoring during workouts
- Bulk data synchronization for historical data
- Background sync capabilities

**Data Synchronization:**
- Heart rate data linked to workout sessions
- Step count tracking with workout association
- Body measurements with flexible type/unit system
- Nutrition tracking with meal categorization

## File Structure Notes

**Backend:** API modules in `src/apis/` with helpers in `src/helpers/`
**Mobile:** Screen components in `src/app/` with shared components in `src/components/`
**Shared:** Services and types in `packages/core/` for cross-platform use

## Environment Setup

**Prerequisites:**
- Node.js >= 18
- Bun >= 1.1.27
- PostgreSQL database
- AWS S3 credentials (for file uploads)
- HealthKit entitlements (for iOS development)