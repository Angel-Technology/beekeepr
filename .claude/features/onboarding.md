# Onboarding — Feature Flow

> Source: `src/features/onboarding/`. Currently presentation-only — no hooks, services, models, or GraphQL. The first feature an unauthenticated user sees, and the on-ramp into auth.

## What this feature owns

- The **first screen** an unauthenticated user lands on (`/`)
- A **3-slide "what we do"** carousel that explains the verification value prop
- A **sign-up entry screen** that branches to "Continue with Google" (kicks off `auth.signInWithGoogle`) or "Continue with Email" (pushes into the auth feature's email/code screens)

It does **not** own:

- Account creation itself — that's `auth` (email/code screens, Google id-token exchange)
- Identity verification — that's `verification` (Persona inquiry)
- Terms acceptance — that's `auth` (`TermsAcceptanceModal`)

## Public surface

Re-exported from `src/features/onboarding/index.ts`:

| Export                          | Layer        | Purpose                                          |
| ------------------------------- | ------------ | ------------------------------------------------ |
| `OnboardingIntroScreen`         | presentation | "Stand out in the crowd" — Get Started CTA      |
| `OnboardingWhatWeDoScreen`      | presentation | 3-slide swipable explainer carousel              |
| `OnboardingCreateAccountScreen` | presentation | Continue-with-Google / Continue-with-Email entry |
| `WhatWeDoStepCard`              | presentation | Slide card used inside the carousel              |

Internal-only (not in `index.ts`):

- `OnboardingFlow` — generic carousel scaffold (FlatList + Reanimated scroll handler + pagination dots)
- `OnboardingPagination` — back/next buttons + animated dot indicator
- `OnboardingSlideCard` — **unused, candidate for deletion** (see Misalignments)
- `OnboardingSlideSubtitleSection` — **unused** (only imported by `OnboardingSlideCard`)
- `VerificationStatusPill` (feature-local copy) — **unused**, duplicates the shared one in `@components`

## File map

```text
src/features/onboarding/
  presentation/
    components/
      OnboardingFlow.tsx                 # generic horizontal-paging carousel (used)
      OnboardingPagination.tsx           # arrows + animated dots (used by OnboardingFlow)
      WhatWeDoStepCard.tsx               # the 3-slide card (used by OnboardingWhatWeDoScreen)
      OnboardingSlideCard.tsx            # DEAD — never rendered
      OnboardingSlideSubtitleSection.tsx # DEAD — only used by OnboardingSlideCard
      VerificationStatusPill.tsx         # DEAD — duplicates @components version, no imports
    screens/
      OnboardingIntroScreen.tsx
      OnboardingWhatWeDoScreen.tsx
      OnboardingCreateAccountScreen.tsx
  index.ts
```

There is **no `hooks/`, `services/`, `models/`, `graphql/`, or `repository/`** under onboarding today. The screens go straight from JSX to `useRouter().replace(...)` for navigation, and `OnboardingCreateAccountScreen` reaches into `useAuthActions()` for `signInWithGoogle`.

## Routes that mount this feature

```text
app/(public)/index.tsx                          → renders <OnboardingIntroScreen />            (path: /)
app/(public)/onboarding/what-we-do.tsx          → renders <OnboardingWhatWeDoScreen />         (path: /onboarding/what-we-do)
app/(public)/onboarding/create-account.tsx      → renders <OnboardingCreateAccountScreen />    (path: /onboarding/create-account)
```

All three live inside the `(public)` route group. The root layout's `Stack.Protected` keeps them mounted only while `useAuthSession` reports an unauthenticated user — once a session lands, the whole `(public)` stack is unmounted and the user is in `(private)`.

## End-to-end flow

```text
[ App boots, no session ]
   └─ app/_layout.tsx → useAuthSession → user = null
        └─ Stack.Protected guard={!isAuthenticated} → mounts (public)
             └─ app/(public)/_layout.tsx → Stack
                  └─ initial route: /

[ OnboardingIntroScreen ]   ← path "/"
   └─ "Get Started" button
        └─ router.replace('/onboarding/what-we-do')        ← replace, not push (forward-only)

[ OnboardingWhatWeDoScreen ]   ← path "/onboarding/what-we-do"
   └─ <OnboardingFlow data={slides} renderSlide={WhatWeDoStepCard} onComplete={...} />
        └─ user swipes / taps right arrow
             ├─ slide 0 → 1 → 2 (handled internally by OnboardingFlow)
             └─ at slide 2, "Next" → onComplete()
                  └─ router.replace('/onboarding/create-account')

[ OnboardingCreateAccountScreen ]   ← path "/onboarding/create-account"
   ├─ "Continue with Google"
   │    └─ useAuthActions().signInWithGoogle.mutate()
   │         └─ on success → authQueryKeys.session() set → root flips to (private)
   └─ "Continue with Email"
        └─ router.push('/auth/create-account-email')
             └─ owned by `auth` feature from here on
```

`router.replace` between onboarding screens is deliberate — the back button shouldn't return the user to the intro after they've started.

## Internal carousel mechanics (OnboardingFlow)

`OnboardingFlow<TItem>` is a small generic carousel built on:

- `Animated.FlatList` (Reanimated 3) — `horizontal`, `pagingEnabled`, `bounces={false}`
- `useAnimatedScrollHandler` writes scroll-x into a `SharedValue<number>` for the dot opacity interpolation
- `onViewableItemsChanged` writes the current slide index into local `useState` (drives back/next button enable/disable and `onComplete`)
- `pageWidth` is measured via `onLayout` (capped at 500), with a `useWindowDimensions`-derived fallback (`min(deviceWidth - 48, 500)`) so the first frame doesn't render at width 0
- Two refs to the same FlatList: `useAnimatedRef<FlatList>` for the worklet side, `useRef<FlatList>` for `scrollToIndex` from JS — the merged `ref={(node) => { jsFlatListRef.current = node; flatListRef(node); }}` keeps both in sync. **Awkward — see Misalignments.**

The pagination component (`OnboardingPagination`) renders `itemCount` `Dot`s; each `Dot` interpolates opacity from `0.3` → `1` → `0.3` based on `x.value` vs its index's centre.

## Cross-feature touch points

| What                                                                                              | Where               |
| ------------------------------------------------------------------------------------------------- | ------------------- |
| `useAuthActions().signInWithGoogle`                                                               | OnboardingCreateAccountScreen — via `@features/auth` ✅ |
| `AuthBrandHeader` imported from `@src/features/auth/presentation/components/AuthBrandHeader`      | OnboardingIntroScreen + OnboardingCreateAccountScreen — **bypasses `auth/index.ts`** ❌ |
| `router.push('/auth/create-account-email')`                                                       | OnboardingCreateAccountScreen — coupled to a route owned by `auth` ✅ (route-level coupling is fine) |
| Shared UI primitives (`Container`, `Button`, `ButtonWithIcon`, `VerificationStatusPill`, `DetailCard`, `VerticalSpacer`, `IconButton`) | All screens — via `@components` ✅ |

## How well it follows the architecture today

| Rule from `.claude/index.md`                       | Status                                                     |
| -------------------------------------------------- | ---------------------------------------------------------- |
| Routes are thin wrappers                            | ✅ all three pages just render the feature screen          |
| Screens render only — no fetching                   | ✅ no fetching anywhere; only `router.replace` and a single auth mutation call |
| Components declared as `const ... = () =>`         | ✅ throughout                                              |
| No classes                                         | ✅                                                         |
| Cross-feature imports go through the public index   | ⚠️ `AuthBrandHeader` is imported via deep path, not `@features/auth` |
| Feature-local UI in `presentation/components`       | ✅                                                         |
| Hooks own state/effects, screens render             | ⚠️ `OnboardingCreateAccountScreen` calls `signInWithGoogle.mutate()` inline; `OnboardingFlow` mixes Reanimated + JS state directly in the component |
| Discriminated unions over booleans + nulls          | n/a — no state union to model yet                          |
| `readonly` on returned shapes                       | ❌ slide arrays and props are mutable                      |
| No dead code                                        | ❌ three components in `presentation/components/` are unused |

## Misalignments with the new style (things to change)

These are the deltas between what's in the repo and the ReasonReact/ReasonML/FP guidance — the punch list for the rewrite:

1. **Three dead components.** `OnboardingSlideCard`, `OnboardingSlideSubtitleSection`, and the feature-local `VerificationStatusPill` are not rendered anywhere. They duplicate or pre-empt other components. Delete unless we have a concrete reason to keep them.
2. **`AuthBrandHeader` is imported through a deep path.** `OnboardingIntroScreen` and `OnboardingCreateAccountScreen` both reach into `@src/features/auth/presentation/components/AuthBrandHeader`. Either (a) re-export it from `@features/auth`, or (b) promote it to `@components/ui` if it's truly app-wide branding (it's used in onboarding *and* both auth screens, so this looks shared).
3. **`signInWithGoogle.mutate()` inline in the screen.** The screen knows about the mutation object's shape (`isPending`, `mutate`). A small `useOnboardingCreateAccountActions` hook in `onboarding/hooks/` should expose `{ continueWithGoogle, continueWithEmail, isGooglePending }` so the screen stays render-only and the auth coupling lives in one place.
4. **Slide data lives inline in the screen.** `OnboardingWhatWeDoScreen` declares the `OnboardingSlide` type and the `slides` array at module scope. As soon as we add copy variants, A/B tests, or localization, this belongs in `models/whatWeDoSlides.ts` (typed with `readonly` arrays).
5. **No discriminated state for the carousel.** `OnboardingFlow` uses `currentIndex`, `pageWidth`, plus button-disabled booleans. A modest variant — `type SlidePosition = { kind: 'first' } | { kind: 'middle'; index: number } | { kind: 'last' }` — would let `OnboardingPagination` switch exhaustively instead of computing `currentIndex === 0` / `currentIndex === data.length - 1` at the call site.
6. **Two refs for one FlatList.** `useAnimatedRef<FlatList>` + `useRef<FlatList>` merged in a callback ref is a workaround. The Reanimated way is to use `scrollTo` on the animated ref directly; either go all-animated-ref or all-JS-ref, not both.
7. **`OnboardingFlow` may not belong in `onboarding/`.** It's a generic carousel scaffold with no onboarding semantics — the only "onboarding" thing about it is the name. If anything else ever needs a horizontal paged carousel, this should live in `@components/ui/Carousel` (or similar) and the onboarding feature should consume it.
8. **`useCallback` everywhere without measurement.** `handleBack`, `handleNext`, `scrollToIndex`, `handlePageWidthLayout`, `onViewableItemsChanged` are all wrapped — fine in itself, but the dependency arrays (`[currentIndex, data.length, onComplete, scrollToIndex]`) thrash on every slide change anyway. Either drop the memos or wrap fewer.
9. **No `readonly` on props/data.** `slides: OnboardingSlide[]` should be `readonly OnboardingSlide[]` and the slide object's fields `Readonly<...>`. Same for `data: TItem[]` in `OnboardingFlow`.
10. **`OnboardingCreateAccountScreen` lives in `onboarding`.** It's the auth feature's entry point in disguise — it renders Google + Email sign-up CTAs and nothing else. Two options to settle: (a) keep it here as the *onboarding terminus* that delegates to auth (current state), or (b) move it to `auth/presentation/screens/AuthEntryScreen.tsx` and have onboarding's last carousel step `router.replace('/auth/entry')`. Worth a deliberate decision before we do anything else here.

## Open questions to resolve in the rewrite

- **Onboarding state.** Right now there's no concept of "where the user is in the onboarding journey" beyond the URL. Do we want a persisted onboarding-progress flag (so a force-quit during slide 2 of "what we do" can resume), or is route-as-state good enough?
- **Skip-onboarding.** No way to skip from intro → create-account today. Product call.
- **Boundary with auth.** Where does onboarding end and auth begin? Today the seam is `OnboardingCreateAccountScreen` (in onboarding) → `CreateAccountEmailScreen` (in auth). Tidy or muddled?
- **Carousel reuse.** If we promote `OnboardingFlow` to a shared `Carousel`, does `WhatWeDoStepCard` move too, or does it stay onboarding-specific?
