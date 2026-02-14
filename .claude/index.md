# DA Template - Architecture

## Overview

This is a React Native app built with Expo, using expo-router for file-based routing and a layered architecture for separation of concerns.

## Directory Structure

```
app/                # expo-router routes (navigation only, thin wrappers)
assets/             # static assets (images, fonts)
src/
  screens/          # view components (UI for each page)
  hooks/            # custom hooks that consume actions
  actions/          # business logic, calls repositories
  data/             # GraphQL clients, repositories
  domain/           # utils, constants, models
```

## Path Aliases

TypeScript path aliases are configured for cleaner imports:

| Alias        | Path            |
| ------------ | --------------- |
| `@src/*`     | `src/*`         |
| `@assets/*`  | `assets/*`      |
| `@screens/*` | `src/screens/*` |
| `@hooks/*`   | `src/hooks/*`   |
| `@actions/*` | `src/actions/*` |
| `@data/*`    | `src/data/*`    |
| `@domain/*`  | `src/domain/*`  |

Example: `import { HomeScreen } from '@screens';`

## Layer Responsibilities

### app/ (Routes)

- File-based routing via expo-router
- Thin wrappers that render corresponding screen components
- No business logic - only navigation concerns

### screens/ (Views)

- UI components for each page/route
- Receives data and callbacks from hooks
- Easily testable in isolation
- Follows MVVM pattern where hooks serve as the ViewModel

### hooks/ (ViewModels)

- Custom React hooks that wire up actions to UI state
- Manages loading, error, and success states
- Consumed by screens

### actions/ (Use Cases)

- Business logic layer
- Calls repositories to fetch/mutate data
- Framework-agnostic (no React dependencies)

### data/ (Data Layer)

- GraphQL client setup and queries/mutations
- Repository implementations
- API communication

### domain/ (Domain Layer)

- `utils/` - helper functions
- `constants/` - app-wide constants
- `models/` - TypeScript interfaces and types

## Data Flow

```
Route (app/) → Screen (screens/) → Hook (hooks/) → Action (actions/) → Repository (data/) → GraphQL
```

## Build & Deployment

- Uses Fastlane for native builds
- Configuration in `fastlane/deploy.yml` (single source of truth for environment config)
- Three environments: dev, test, prod
- Version defined in `app.config.ts` (APP_VERSION constant)

## Environment Configuration

The app variant is determined by `EXPO_PUBLIC_APP_VARIANT` environment variable:

- `dev` - Development build
- `test` - Test/QA build
- `prod` - Production build

Each environment has distinct:

- Bundle identifiers
- App icons
- URL schemes
- Firebase app IDs
