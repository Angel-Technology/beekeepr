# Beekeepr - Architecture

## Overview

This is a React Native app built with Expo and `expo-router`, using a feature-based architecture for strong separation of concerns.

The app shell in `app/` is responsible for navigation only. Real product work lives inside feature folders under `src/features`, where each feature owns its presentation, hooks, models, GraphQL documents, repository code, and service layer.

The app also uses:

- TanStack Query for async state and caching
- GraphQL for API communication
- GraphQL Code Generator for typed operation output
- A shared component library under `src/components` for reusable UI primitives and composed app-wide components

The code style is TypeScript, but we model code in a **ReasonReact / ReasonML-inspired** way: small composable pure pieces, immutable data, discriminated unions over booleans, no classes, and a strict separation between data, behavior, and effects. See [Architectural Patterns](#architectural-patterns) below.

## Features

These are the features currently living under `src/features/<name>`. Each feature follows the architecture below. Maturity varies — some are partial (presentation-only) and will grow `hooks/`, `services/`, `repository/`, and `graphql/` as they need them.

| Feature        | Owns                                                                  | Current shape                              |
| -------------- | --------------------------------------------------------------------- | ------------------------------------------ |
| `auth`         | Account creation (email + code), session, terms acceptance            | Full vertical: presentation/hooks/models/services/repository/graphql |
| `onboarding`   | Intro, "what we do", create-account onboarding screens                | presentation                               |
| `verification` | Paywall → Persona ID verification → Checkr criminal check (multi-step gated flow) | Full vertical: presentation/hooks/models/services/repository/graphql |
| `home`         | Post-auth landing: Buzz tab and Buzz records                          | presentation + hooks + models              |
| `subscription` | RevenueCat paywall surfaced inside the verify-identity flow           | presentation                               |

Each feature re-exports its public surface from `src/features/<name>/index.ts`. Cross-feature imports must go through that public entry — never reach into a sibling feature's internals.

Per-feature flow docs live in [`./features/`](./features/) — start there when working in a feature to understand its current shape and pending changes:

- [`features/auth.md`](./features/auth.md) — email + code, Google sign-in, sign-out, terms gate, Persona kickoff
- [`features/onboarding.md`](./features/onboarding.md) — intro screen, what-we-do carousel, create-account entry
- [`features/verification.md`](./features/verification.md) — paywall, Persona kickoff + 30s poll, Checkr criminal check, exit-screening guard, post-flow welcome state

The Storybook conventions (how to write a story file, controls, actions, the global preview decorator) live in [`./stories.md`](./stories.md).

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

## Architectural Patterns

The codebase combines two ideas:

1. **Feature-based vertical slicing.** Every product area is a self-contained feature folder with its own UI, hooks, models, services, repository, and GraphQL. Features compose at the route layer only.
2. **ReasonReact / ReasonML-inspired structure with functional-programming fundamentals.** TypeScript is the language, but we shape code the way ReasonReact and ReasonML projects do: small pure pieces, data-first, no inheritance, no hidden mutation, behavior expressed as transformations on values.

### ReasonReact-style structure

- Screens render. They don't fetch and they don't orchestrate. They receive data and callbacks from a feature hook.
- Feature hooks are the equivalent of ReasonReact reducers / state hooks: one hook per screen or per coherent flow, returning a value record (`{ data, loading, error, onX, onY }`) that the screen consumes.
- Components are declared as `const Foo = (...) => ...`. No `function` components, no `class` components.
- Props types are explicit and narrow. No `any`. No `unknown` leaking out of hooks.
- Side effects (network, navigation, storage) are isolated to `services/` and `repository/`, called from hooks — never from presentation.

### ReasonML / FP fundamentals

- **Immutability by default.** Treat all values as `readonly`. Build new objects/arrays instead of mutating; use spread, `map`, `filter`, `reduce` instead of `push`/`splice` or in-place writes.
- **Pure functions wherever possible.** Service and utility functions take inputs, return outputs, and avoid hidden state. Async work returns Promises / Query results — it does not mutate module-level singletons.
- **Discriminated unions over booleans + nulls.** Model state as tagged unions, e.g. `type State = { kind: 'idle' } | { kind: 'loading' } | { kind: 'error'; error: Error } | { kind: 'ready'; value: T }`, and handle each variant explicitly. This is the TypeScript stand-in for ReasonML variants and pattern matching.
- **Exhaustive switches.** When switching on a discriminated union, include a `default` that calls `assertNever(x)` so adding a new variant becomes a compile error at every site.
- **No classes.** Use modules of functions and plain data. Repositories and services are objects of functions or plain function exports — not classes with `this`.
- **Pipe-style composition.** Prefer chaining small transformations over deeply nested calls. Local `const` helpers beat inline complexity.
- **Total functions over throwing.** For expected failures, return `Result`-shaped values (`{ ok: true; value } | { ok: false; error }`). Reserve `throw` for true invariants and programmer error.
- **Data and behavior stay separate.** `models/` holds shapes; `services/` holds behavior. Don't attach methods to data types.

### `any` is banned

Don't write `: any`, `as any`, or any other escape hatch that turns off type checking. This includes "soft" `any`s like `as { someField?: T }` casts on `unknown` values — they're the same lie wrapped in a narrower shape.

When you have a value of unknown type:

- **Caught errors** (`catch (e)`) are typed as `unknown`. Narrow with `instanceof Error` and read `.message` from there. For tagged errors (e.g. `SubscriptionRequiredError`), define a type guard and use it instead of casting.
- **External payloads** at boundaries (GraphQL responses, deep-link params, native bridge) come in pre-typed by codegen or platform types. Trust those types; don't widen them.
- **Genuine open-ended values** that you can't type — use `unknown` and narrow at the point of use, never `any`.

If you're tempted to reach for `any`, the right move is almost always to model the value with a discriminated union or write a type guard. The one cast that's allowed is the one inside the constructor of a tagged-error helper (one place, one line, well-named) — see `subscriptionRequiredError` for the pattern.

### Documentation comments

Hooks, services, and any non-trivial exported function must carry a JSDoc-style `/** ... */` block. The goal is for a reader landing in the file cold to understand **what the function exists to do** without reverse-engineering the body.

- Lead with a one- or two-sentence summary of what the function is responsible for.
- For hooks: enumerate the responsibilities (`Responsibilities:` bulleted block) so the reader knows the surface area without scrolling. Document the returned shape's non-obvious fields.
- For services: document `@param` / `@returns` / `@throws` only when the contract isn't obvious from the type signature. If a function throws a tagged error (e.g. `Error & { subscriptionRequired: true }`), call that out explicitly.
- Add a **Why:** paragraph for non-obvious decisions: a workaround, a constraint imposed by an external system, or a trade-off the reader would otherwise question. Avoid restating the *what* — that's what the code says.
- Internal helpers can use a single short line if the name doesn't already make the intent obvious.

What not to write: generic descriptions ("This hook manages state"), commit-history narration ("added in PR #123"), or comments that will rot the moment a caller renames a route. Document invariants and intent, not lineage.

The verification feature is the canonical example: see `useVerificationGate`, `useVerificationActions`, and `useScreeningExit` for the shape we want everywhere else.

### How this maps to the folders

| Concept                                  | Lives in                                              |
| ---------------------------------------- | ----------------------------------------------------- |
| Pure data + types                        | `features/*/models`, `domain/`                        |
| Pure transformations / use-cases         | `features/*/services`                                 |
| Effectful I/O                            | `features/*/repository`, `lib/graphql`, `lib/tanstack`|
| State + effect orchestration             | `features/*/hooks`                                    |
| Rendering only                           | `features/*/presentation`, `components/ui`            |

If a piece of code doesn't fit cleanly into one of these, that's a signal to split it — not to grow the boundary.

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
