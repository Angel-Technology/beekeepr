# Beekeepr - Architecture

## Overview

This is a React Native app built with Expo and `expo-router`, using a feature-based architecture for strong separation of concerns.

The app shell in `app/` is responsible for navigation only. Real product work lives inside feature folders under `src/features`, where each feature owns its presentation, hooks, models, GraphQL documents, repository code, and service layer.

The app also uses:

- TanStack Query for async state and caching
- GraphQL for API communication
- GraphQL Code Generator for typed operation output
- A shared component library under `src/components` for reusable UI primitives and composed app-wide components

## Directory Structure

```text
app/                              # expo-router routes (navigation only, thin wrappers)

src/
  components/                     # shared component library
    ui/                           # reusable UI primitives and shared components

  features/
    onboarding/
      presentation/               # feature UI built from shared components
        screens/
        components/
      hooks/                      # feature hooks, usually backed by TanStack Query
      models/                     # feature types, schemas, and local models
      graphql/                    # feature GraphQL documents and generated output
        queries/
        mutations/
        fragments/
        generated/
      repository/                 # feature repository layer
      services/                   # feature service/use-case layer
      index.ts                    # feature public API

  lib/
    graphql/                      # shared GraphQL client and setup
    tanstack/                     # shared QueryClient and TanStack helpers

  domain/                         # cross-feature constants, utilities, and global types only
    constants/
    models/
    utils/
```

## Path Aliases

TypeScript path aliases are configured for cleaner imports:

| Alias           | Path                   |
| --------------- | ---------------------- |
| `@src/*`        | `src/*`                |
| `@assets/*`     | `src/assets/*`         |
| `@components/*` | `src/components/*`     |
| `@features/*`   | `src/features/*`       |
| `@screens/*`    | `src/screens/*`        |
| `@hooks/*`      | `src/hooks/*`          |
| `@actions/*`    | `src/actions/*`        |
| `@data/*`       | `src/data/*`           |
| `@domain/*`     | `src/domain/*`         |

Note:

- Legacy aliases may still exist during the transition
- New work should prefer feature-local imports or `@features/*` / `@components/*`

## Architectural Rules

### app/ (Routes)

- File-based routing via `expo-router`
- Thin wrappers only
- No business logic
- No data fetching
- Each route should import and render the appropriate feature screen

Example:

```text
app/onboarding/index.tsx
  -> renders src/features/onboarding/presentation/screens/OnboardingScreen.tsx
```

### components/ (Shared Component Library)

- Houses reusable UI primitives and shared composed components
- Used across multiple features
- Should not contain feature-specific business logic
- Good examples: `Button`, `Text`, `Icon`, `Input`, `Sheet`, `EmptyState`

### features/ (Primary App Structure)

Each page or product area should be implemented as a feature.

Each feature owns everything it needs:

- `presentation/` for screens and feature-only visual components
- `hooks/` for feature state and TanStack Query integration
- `models/` for feature-specific types and schemas
- `graphql/` for queries, mutations, fragments, and generated types
- `repository/` for data access and persistence logic
- `services/` for orchestration and business rules
- `index.ts` as the feature's public entry point

This keeps feature code cohesive and makes it easier to reason about, test, and evolve independently.

### presentation/ (Feature UI)

- Contains the actual feature screens rendered by routes
- Built from shared `src/components` pieces plus feature-specific presentation components
- No direct API calls in components
- Should stay focused on rendering and user interaction wiring
- Prefer `const` declarations for React components and local helpers instead of `function` declarations

### hooks/ (Feature State Layer)

- Feature-level React hooks
- Usually the main integration point for TanStack Query
- Coordinates repository and service calls with UI state
- Exposes data, loading, error, and event handlers to presentation

### models/ (Feature Types)

- Feature-specific types and interfaces
- Validation schemas if needed
- DTO shaping where useful
- Keep global types in `src/domain` only when they are truly cross-feature

### graphql/ (Feature API Contracts)

- GraphQL queries, mutations, and fragments owned by the feature
- Generated types should live close to the documents that produce them
- Prefer keeping generated output inside `graphql/generated/` for that feature

### repository/ (Feature Data Access)

- Knows how to fetch and persist feature data
- Calls GraphQL clients or other data sources
- Should hide transport details from hooks and presentation
- Keeps data access logic out of components

### services/ (Feature Business Logic)

- Encapsulates orchestration and use-case logic
- Can combine repository calls, normalization, and workflow rules
- Keeps hooks thinner when feature workflows become non-trivial

### lib/ (Shared Infrastructure)

- Shared setup that multiple features depend on
- `lib/graphql/` for GraphQL client configuration
- `lib/tanstack/` for `QueryClient`, query helpers, and related shared setup

### domain/ (Global Shared Domain)

- Cross-feature constants
- Global utilities
- Global models and types that are genuinely shared
- This should stay small; feature-local logic belongs inside the feature

## Data Flow

```text
Route (app/)
  -> Feature Screen (features/*/presentation/screens)
  -> Feature Hook (features/*/hooks)
  -> Feature Service (features/*/services)
  -> Feature Repository (features/*/repository)
  -> Feature GraphQL (features/*/graphql)
  -> Shared GraphQL Client / TanStack Query setup (src/lib)
```

## TanStack Query Guidance

- TanStack Query should be used inside feature hooks
- Query keys should be feature-scoped when possible
- Shared query client setup belongs in `src/lib/tanstack`
- Avoid placing query logic directly in presentation components

## GraphQL Guidance

- GraphQL documents should live inside the owning feature
- GraphQL Codegen output should live close to those documents
- Repositories should consume generated GraphQL types instead of manually duplicating response shapes

## Separation of Concerns

Keep these boundaries strict:

- `app/` navigates
- `presentation/` renders
- `hooks/` manages UI-facing state
- `services/` coordinates use cases
- `repository/` talks to data sources
- `graphql/` defines API contracts
- `components/` stays reusable and shared

## Build & Deployment

- Uses Fastlane for native builds
- Configuration in `fastlane/deploy.yml` as the source of truth for environment config
- Environments: dev, test, prod
- App version defined in `app.config.ts`

## Environment Configuration

The app variant is determined by `EXPO_PUBLIC_APP_VARIANT`:

- `dev` - Development build
- `test` - Test or QA build
- `prod` - Production build

Each environment can define distinct:

- Bundle identifiers
- App icons
- URL schemes
- Firebase app IDs
