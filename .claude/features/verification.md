# Verification — Feature Flow

> Source: `src/features/verification/`. Multi-step gated flow: subscription paywall → Persona ID verification → instant criminal background check. Owns its own GraphQL surface (`startPersonaInquiry`, `startInstantCriminalCheck`), reads `currentUser` from the auth feature, and uses `src/lib/revenuecat` for the subscription purchase. The Persona SDK launch lives in this feature's service layer; everything else is hooks + presentation.

## What this feature owns

- The user-facing **paywall** that gates verification (Pay fee + Enter promo code stub)
- **Step 1 — Identity verification (Persona)** + the in-app **waiting/polling** state for async approval
- **Step 2 — Criminal record intro** explainer screen
- The **criminal-check form** that submits the instant criminal check
- **Exit Screening** confirmation modal + back-press guard, active across all in-flow steps
- **Privacy and Compliance** "More info" modal, shared across step 1 / step 2
- The **post-verification welcome state** on the home tab (`BuzzWelcomeFlow`) — owned by the `home` feature but driven by `user.backgroundCheckBadge` set in this flow

## Public surface

Re-exported from `src/features/verification/index.ts`:

| Export                          | Layer            | Purpose                                                                     |
| ------------------------------- | ---------------- | --------------------------------------------------------------------------- |
| `VerificationPaywallScreen`          | presentation     | Paywall (`/verify-identity`)                                                |
| `IdentityVerificationIntroScreen`   | presentation     | Step 1 kickoff + waiting/timed-out/declined states (`/verify-identity/identity`) |
| `CriminalCheckIntroScreen`  | presentation     | Step 2 explainer (`/verify-identity/criminal-check`)                        |
| `CriminalCheckFormScreen`             | presentation     | Phone form → Checkr (`/verify-identity/find-records`)                       |
| `useVerificationActions`        | hook (mutations) | `startPersonaVerification`, `startCriminalCheck`, `refreshVerificationStatus` |
| `verification.types`            | model            | `PersonaInquiryStartResult`, `CriminalCheckInput`/`CriminalCheckResult`, `SubscriptionRequiredError` + factory + guard, etc. |
| `verificationService`           | service          | `startPersonaInquiry` (subscription-gate aware), `startCriminalCheck`, `startVerification` (Persona SDK launcher) |
| `resolveVerifyIdentityRoute`    | service          | Pure `(user, isPro) → next route` resolver                                  |
| `hasResumableVerification`      | service          | Same inputs → `boolean` for "Resume" vs "Get Started" labelling             |

The remaining hooks (`useVerificationPaywall`, `useVerificationFlow`, `useCriminalCheckForm`, `useVerificationGate`) and presentation components (`StepBadge`, `PrivacyComplianceCard`, `PrivacyComplianceModal`, `ExitScreeningModal`, `PaymentErrorModal`, `VerificationTrialStepper`, plus the per-phase body sections under `IdentityKickoffSection`, `IdentityWaitingSection`, `IdentityTimedOutSection`, `IdentityDeclinedSection`, `CriminalIntroSection`, `CriminalFormSection`) are feature-private. The screen header reuses the shared `AppHeader` from `@components` rather than a feature-local nav.

## File map

```text
src/features/verification/
  graphql/
    mutations/
      startPersonaInquiry.graphql            # mint a Persona inquiry id (subscription gate fires server-side)
      startInstantCriminalCheck.graphql      # phoneNumber → Checkr instant criminal
    generated/verification.generated.ts      # codegen output

  hooks/
    useVerificationActions.ts                # TanStack mutations: startPersonaVerification, startCriminalCheck, refreshVerificationStatus
    useVerificationGate.ts                   # shared gate ('subscription' | 'identity-approved') → auto-redirect when preconditions fail
    useVerificationPaywall.ts                # paywall — Pay fee, Enter promo (stub), auto-skip if isPro
    useVerificationFlow.ts                   # consolidated post-paywall phase machine: kickoff/waiting/timed-out/declined/criminal-intro/criminal-form
    useCriminalCheckForm.ts                  # criminal-check form state — read-only verified fields + editable phone + submit

  models/
    verification.types.ts                    # StartVerificationInput, VerificationLaunchResult, PersonaInquiryStartResult, CriminalCheckInput/Result, SubscriptionRequiredError + isSubscriptionRequiredError + subscriptionRequiredError factory

  repository/
    verificationRepository.ts                # GraphQL passthrough for startPersonaInquiry + startInstantCriminalCheck

  services/
    verificationService.ts                   # startPersonaInquiry (gate-aware), startCriminalCheck, startVerification (Persona SDK builder)
    resolveVerifyIdentityRoute.ts            # pure (user, isPro) → next route resolver, used by home Get Started

  presentation/
    components/
      StepBadge.tsx                       # "STEP n of N" yellow pill
      PrivacyComplianceCard.tsx           # gray FAQ card with bullet list + "More info"
      PrivacyComplianceModal.tsx          # full info modal triggered by "More info"
      ExitScreeningModal.tsx              # "Exit screening?" Cancel / Yes, exit
      PaymentErrorModal.tsx               # purchase / promo failure dialog (mirrors ExitScreening chrome)
      VerificationTrialStepper.tsx        # the "How your trial works" stepper on the paywall
    screens/
      VerificationPaywallScreen.tsx
      IdentityVerificationIntroScreen.tsx
      CriminalCheckIntroScreen.tsx
      CriminalCheckFormScreen.tsx

  index.ts                                # public surface
```

## Routes that mount this feature

```text
app/(private)/verify-identity/
  _layout.tsx          → Stack; index uses slide_from_bottom; siblings slide_from_right
  index.tsx            → <VerificationPaywallScreen />
  identity.tsx         → <IdentityVerificationIntroScreen />
  criminal-check.tsx   → <CriminalCheckIntroScreen />
  find-records.tsx     → <CriminalCheckFormScreen />
```

Entry into the flow: `BuzzVerifyFlow.Get Started` on the home tab → `resolveVerifyIdentityRoute({ user, isPro })` → `router.push(<route>)`. The resolver routes the user to **wherever they left off** rather than always the paywall:
- no user → `/verify-identity` (paywall)
- already has a badge → `null` (caller hides the entry; in practice the home tab is already showing `BuzzWelcomeFlow`)
- `!isPro` → `/verify-identity` (paywall)
- `identityVerificationStatus === Approved` → `/verify-identity/criminal-check` (skip Step 1)
- otherwise (NotStarted, Created, Pending, Completed, NeedsReview, Declined, Failed, Expired) → `/verify-identity/identity` — the intro screen self-renders the right phase (kickoff / waiting / declined) from status

This preserves the "you paid, we won't make you pay again" contract: the paywall (`/verify-identity`) auto-skips on `isPro` via its entry guard, but with the resolver we don't even push them there.

Once the user has any non-`None` badge, the home tab swaps `BuzzVerifyFlow` for `BuzzWelcomeFlow` (handled in the `home` feature off `user.backgroundCheckBadge`), so Get Started is no longer visible.

The outer `(private)/_layout.tsx` registers `verify-identity` with `animation: 'slide_from_bottom'` so the entry feels like a sheet over the tab bar.

## State machine (the why behind every redirect)

The flow is driven entirely by **server state** (`user.identityVerificationStatus`, `user.backgroundCheckBadge`) plus **client subscription state** (`useRevenueCat().isPro`). Downstream screens call `useVerificationGate(<requirement>)` which centralises the redirect rules; the paywall self-redirects since it's the entry point, not a gated downstream screen.

| Route                                   | Gate requirement     | Redirects when violated                                            |
| --------------------------------------- | -------------------- | ------------------------------------------------------------------ |
| `/verify-identity` (paywall)            | (none — entry point) | `isPro` → self-redirect to `/verify-identity/identity`             |
| `/verify-identity/identity` (intro)     | `subscription`       | `!isPro` → `/verify-identity`; badge set → `/(main)`               |
| `/verify-identity/criminal-check`       | `identity-approved`  | not Approved → `/verify-identity/identity`; badge set → `/(main)`  |
| `/verify-identity/find-records`         | `identity-approved`  | same                                                               |

The intro screen is also the **waiting state**:

```text
identityVerificationStatus value          rendered phase     transition
─────────────────────────────────────     ──────────────     ─────────────────────────────
NotStarted                                kickoff            user taps "Start verification"
Created / Pending                         waiting (poll)     SDK fired onComplete; backend hasn't approved yet
Completed / NeedsReview                   waiting (poll)     Persona has the docs, verdict pending
                                          ↳ after 15 polls   timed-out → "we'll email you when done"
Approved                                  approved           auto-replace to /verify-identity/criminal-check
Declined / Failed / Expired               declined           "Try again" → restarts startPersonaVerification
```

While `phase === 'waiting'` the intro hook runs a `useQuery({ queryKey: authQueryKeys.session(), refetchInterval: 2000 })` so the same `currentUser` cache that drives the screen ticks every 2s. **There is no `setTimeout`** — the timeout is detected by counting completed polls (`POLL_TIMEOUT_COUNT = 15`, ≈30s at the 2s interval). When `pollCount` crosses the threshold, `phase` derives to `'timed-out'` on the next render, `refetchInterval` returns `false`, and polling stops.

## End-to-end flows

### 1. Pay fee → enter the verification flow

```text
[VerificationPaywallScreen]
   └─ useVerificationPaywall
        ├─ self-redirect: if (isReady && isPro) → router.replace('/verify-identity/identity')
        ├─ "Pay fee to get started" → handlePayFee
        │     └─ useRevenueCat().purchase()             # native Apple/Play sheet pops
        │           ↳ returns true on entitlement granted → router.replace('/verify-identity/identity')
        │           ↳ returns false on user-cancel → stay silent
        │           ↳ throws on real errors → setPaymentError('Payment failed')
        └─ "Enter promo code" → handlePromoCode
              └─ console.warn('promo-code redemption tapped — not yet wired')
                    ↳ stub for now; promo flow will be wired when offer set is finalised
```

The paywall does not call our backend itself. Backend gating happens on the next mutation (`startPersonaInquiry`).

**Error handling.** `handlePayFee` writes into a single `paymentError` state (`{ title, message }`) instead of calling `Alert.alert`. The screen renders `<PaymentErrorModal />` when that state is non-null. Cases:

- `subscriptionPriceString` not yet loaded → `"Subscription unavailable"`
- `purchase()` threw → `"Payment failed"`

The contract with `RevenueCatProvider.purchase` is:

- Returns `true` when the entitlement is granted.
- Returns `false` only on **user cancellation** (RC's native sheet dismiss; not an error).
- **Throws** on any other failure (network, store, receipt validation). The hook's `try/catch` populates `paymentError`.

### 2. Step 1 — Persona kickoff + waiting

```text
[IdentityVerificationIntroScreen, phase === 'kickoff']
   └─ useIdentityVerificationIntro
        ├─ useVerificationGate('subscription')          # !isPro → /verify-identity; badge → /(main)
        ├─ "Start verification" → handleStartVerification
        │     └─ useVerificationActions.startPersonaVerification.mutateAsync()
        │           ├─ verificationService.startPersonaInquiry()          # GraphQL
        │           │     ↳ server runs subscription gate
        │           │       success     → returns inquiryId
        │           │       gated       → throws SubscriptionRequiredError (typed-tag error)
        │           ├─ verificationService.startVerification({ inquiryId })
        │           │     └─ react-native-persona builder
        │           │         ├─ env: sandbox | production (from environmentConfig)
        │           │         ├─ either fromInquiry(id) (resume) or fromTemplate(id) (new)
        │           │         ├─ onComplete → resolve({ inquiryId, status, fields })
        │           │         ├─ onCanceled → reject('Verification was canceled…')
        │           │         └─ onError    → reject(error)
        │           └─ onSuccess → invalidate authQueryKeys.session()
        │                 ↳ identityVerificationStatus flips → phase becomes 'waiting'
        │           └─ onError(isSubscriptionRequiredError) → swallowed (no Alert)
        │                 ↳ intro hook router.replace('/verify-identity')
        │           └─ onError(other) → Alert.alert('Verification Failed', message)
        │
        └─ Privacy and Compliance "More info" → screen-local useState → PrivacyComplianceModal

[IdentityVerificationIntroScreen, phase === 'waiting']
   └─ useQuery(currentUser, refetchInterval: 2000)
        ↳ identityVerificationStatus changes drive phase
        ├─ Approved        → useEffect → router.replace('/verify-identity/criminal-check')
        ├─ Declined        → phase 'declined' → "Try again" UI
        └─ pollCount ≥ 15  → phase 'timed-out' → "we'll email you when done" UI
```

### 3. Step 2 — Criminal record intro → form

The criminal intro and form are sections of the consolidated `VerificationFlowScreen`, not separate screens. `useVerificationFlow` flips `phase` from `criminal-intro` to `criminal-form` when the user taps "Start search" — pure local state, no router navigation between sections.

```text
[VerificationFlowScreen, phase === 'criminal-intro']
   └─ <CriminalIntroSection> (presentation component, takes props)
        ├─ "Start search" → flow.handleStartCriminalSearch
        │     └─ setCriminalIntroAcknowledged(true) inside useVerificationFlow
        │           ↳ phase derives to 'criminal-form' on next render
        └─ "More info" → screen-local useState → PrivacyComplianceModal

[VerificationFlowScreen, phase === 'criminal-form']
   └─ <CriminalFormSection> (presentation component, takes props from useCriminalCheckForm)
        ├─ verified data is read-only:
        │     firstName / middleName / lastName  ← user.verifiedFirstName / etc.
        │     dateOfBirth                        ← formatted from verifiedBirthdate (YYYY-MM-DD → mm/dd/yyyy)
        │     licenseState                       ← user.verifiedLicenseState
        ├─ phoneNumber is editable (seeded from user.phoneNumber)
        ├─ canSubmit = verifiedFirstName && verifiedLastName && phoneNumber.trim()
        └─ "Submit" → form.handleSubmit
              └─ useVerificationActions.startCriminalCheck.mutateAsync({ phoneNumber })
                    ├─ verificationService.startCriminalCheck → verificationRepository (GraphQL)
                    │     ↳ backend server-locks identity to user.Verified*; only phone is editable
                    ├─ throws on !success
                    └─ onSuccess → invalidate authQueryKeys.session()
                          ↳ user.backgroundCheckBadge flips Approved or Denied
                          ↳ router.replace('/(main)') — passes through the chevron-left's
                            confirm modal cleanly; programmatic navigation is not intercepted
                                ↳ home tab re-evaluates → BuzzWelcomeFlow renders
```

### 4. Exit-confirm modal (chevron-left only)

The exit-confirm modal lives inline in `VerificationFlowScreen` as plain `useState` — no shared hook. The chevron-left in the `AppHeader` is the only thing that opens it; programmatic navigation (form submit success, gate redirect, retry on decline, paywall self-redirect) bypasses the modal entirely.

```text
<AppHeader />
  └─ chevron-left onPress: setIsExitOpen(true)

<ExitScreeningModal visible={isExitOpen}>
  ├─ Cancel    → setIsExitOpen(false), stay on the screen
  └─ Yes, exit → setIsExitOpen(false) + router.replace('/(main)')
```

Five lines of inline state, no `usePreventRemove`, no race conditions. Trade-off vs. the previous design: hardware back / swipe gestures now exit without confirmation. Acceptable because the screen is sheet-presented (slide-from-bottom) and the chevron-left is prominent in the header.

### 5. Promo code redemption (deferred)

The paywall still renders an "Enter promo code" button, but `handlePromoCode` is currently a `console.warn` stub. The real flow (StoreKit `presentCodeRedemptionSheet` on iOS, `Linking.openURL('https://play.google.com/redeem')` on Android) needs to come back when the App Store Connect / Play Console offer set is finalised.

## Cross-feature contracts

### Auth (server state)

`AuthUserFields` fragment was extended to expose every server field this flow reads:

```graphql
fragment AuthUserFields on UserGraph {
  id email displayName emailVerified createdAtUtc
  identityVerificationStatus
  personaInquiryId
  personaInquiryStatus
  personaVerifiedAtUtc
  verifiedFirstName
  verifiedMiddleName
  verifiedLastName
  verifiedBirthdate
  verifiedLicenseState
  phoneNumber
  imageUrl
  backgroundCheckBadge
  backgroundCheckBadgeExpiresAtUtc
  termsAcceptedAtUtc
}
```

The `startPersonaInquiry` mutation lives in **this** feature now (it was previously in auth — moved during the verification overhaul). It's the **subscription gate**: when the backend returns `subscriptionRequired: true`, `verificationService.startPersonaInquiry` throws a `SubscriptionRequiredError` (constructed via `subscriptionRequiredError(message)`, detected via `isSubscriptionRequiredError(error)`). The intro hook recognises the tag and redirects to the paywall. The shared `useVerificationActions.startPersonaVerification.onError` swallows that case (no Alert) since the redirect handles UX.

### RevenueCat (client purchase state)

`src/lib/revenuecat/RevenueCatProvider.tsx` exposes a deliberately minimal surface:

- `isReady` — provider has finished initial sync
- `isPro` — `customerInfo.entitlements.active[ENTITLEMENT_ID]` truthy
- `subscriptionPriceString` — localised display price (e.g. `"$9.95"`), `null` until offerings load
- `purchase()` — returns `true` on entitlement granted, `false` on user-cancel, throws on real failures
- `restorePurchases()` — Apple-mandated restore path; returns post-restore `isPro`

The `appUserId` passed to `Purchases.configure({ appUserID: user.id })` MUST equal `users.id` so the backend RevenueCat webhook handler can resolve the user.

The product is a single auto-renewable subscription with a **7-day free trial → $9.95/month** introductory offer (configured in App Store Connect / Play Console; RevenueCat's `offering.monthly` slot exposes it). There is no separate verification fee and no annual plan. Promo redemption is currently a `console.warn` stub.

### Home (post-flow UX)

The home tab's `useBuzzScreen` reads `user.backgroundCheckBadge`:

```ts
const flow: BuzzFlow =
  hasSubmittedBackgroundCheck ? 'active' :
  badge !== BackgroundCheckBadge.None ? 'welcome' :
  'verify';
```

`BuzzWelcomeFlow` (`src/features/home/presentation/components/BuzzWelcomeFlow.tsx`) renders the search bar + "Welcome to TheBuzz Community!" card after a non-`None` badge is set. The verification feature does not navigate there explicitly — it just `router.replace('/(main)')` after Checkr returns and lets the home tab re-derive.

## Subscription gate — full behaviour

Per `beekeepr-api/.claude/features/identity-verification-persona.md`, the gate fires only on **fresh-or-retry** Persona inquiries:

- `NotStarted` / `Declined` / `Expired` / `Failed` → backend creates a new inquiry, gate fires
- In-progress inquiries (`Created` / `Pending` / `Completed` / `NeedsReview` / `Approved`) → reuse path, gate **bypassed**

The backend has its own RevenueCat REST fallback (`BillingService.GetSubscriptionForUserAsync`) — if the local mirror says inactive but the user just paid, the backend hits RC directly before deciding. So a user who pays and immediately taps "Start verification" should rarely see a `subscriptionRequired` rejection even if the webhook is in flight.

## Background check renewal

Verified background-check badges expire after 3 months (`backgroundCheckBadgeExpiresAtUtc`). The backend's `BackgroundCheckRenewalBackgroundService` re-runs the instant criminal check for active subscribers automatically — this feature does not own renewal UX. For lapsed subscribers the timestamp ages out and the home `BuzzWelcomeFlow` should treat the badge as expired (currently it doesn't — see "Misalignments" below).

## How well it follows the architecture today

| Rule from `.claude/index.md`                          | Status                                                                  |
| ----------------------------------------------------- | ----------------------------------------------------------------------- |
| Routes are thin wrappers                              | ✅ each `app/(private)/verify-identity/*.tsx` just renders the screen   |
| Screens render only — no fetching/orchestration       | ✅ each pulls from a single hook (intro screen excepted: composes shared hooks inline) |
| Components declared as `const ... = () =>`            | ✅                                                                      |
| No classes                                            | ✅ services and repository are object-of-functions modules              |
| Side effects isolated to services/repository          | ✅ Persona SDK in `verificationService`, GraphQL in `verificationRepository` |
| Layer-boundary lint rules                             | ✅ enforced by `eslint.config.mjs` `featureLayerBoundaries`             |
| `any` is banned                                       | ✅ `subscriptionRequiredError` factory isolates the one unavoidable cast |
| JSDoc on hooks/services with non-obvious intent       | ✅ canonical examples are `useVerificationGate`, `useVerificationActions`, `useVerificationFlow` |
| Feature-scoped query keys                             | ⚠️ uses `authQueryKeys.session()` directly for polling — see misalignments |
| Pure data + pure helpers in `models/`/`services/`     | ✅ `verification.types`, `formatDobForDisplay`, `resolveVerifyIdentityRoute` |
| Discriminated unions over booleans + nulls            | ✅ `KickoffPhase` union; ⚠️ form state still uses booleans              |
| Total functions over throwing                         | ❌ `startCriminalCheck` and `startPersonaInquiry` services still throw on backend errors |
| Exhaustive switches with `assertNever`                | ⚠️ `phaseFromStatus` switches on `IdentityVerificationStatus` but uses `default` instead of `assertNever` |
| `readonly` everywhere                                 | ❌ hook return shapes are mutable                                       |

## Misalignments with the new style (things to change)

1. **Verification has no own query keys.** `useIdentityVerificationIntro` polls via `useQuery({ queryKey: authQueryKeys.session() })` — reaching into the auth feature's keys. Acceptable for now (we explicitly want to share the same cache observer), but a `verificationQueryKeys.identityPolling()` alias would make the intent clearer.
2. **`SubscriptionRequiredError` is still a thrown tagged error.** The factory + guard contains the cast, but it's still a throw where a `Result<T, E>` could be exhaustively matched. A discriminated payload from `verificationService.startPersonaInquiry` (`{ ok:true, inquiry } | { ok:false, reason:'subscription-required' } | { ok:false, reason:'unknown', message }`) would let `useVerificationActions` switch over kinds instead of branching on `instanceof + tag`.
3. **Form state uses booleans, not a discriminated union.** `useCriminalCheckForm` exposes `isSubmitting`, `canSubmit`, `phoneNumber`, etc. The natural model is `{ kind: 'editing'; phoneNumber } | { kind: 'submitting'; phoneNumber } | { kind: 'error'; message; phoneNumber } | { kind: 'success' }`.
4. **`BuzzWelcomeFlow` doesn't gate on badge expiry.** It currently shows for any non-`None` badge regardless of `backgroundCheckBadgeExpiresAtUtc`. Lapsed-subscriber UX should fall back to "your badge expired — re-subscribe to refresh".
5. **Step 1 / Step 2 use `IllustrationLetsdothis`** as a placeholder. The Figma designs reference different illustrations that aren't in the repo yet. Swap in the real assets when they land — the dimensions match the Figma already.
6. **Auto-forward on `Approved`** uses `router.replace`. If the user is on the Persona SDK when their previous Approved status had already been observed (rare), the intro hook would forward through the underlying screen. Today this is fine because Persona is modal — but worth a guard if the SDK presentation ever changes.
7. **`POLL_TIMEOUT_COUNT = 15` is a magic number** inside the intro hook. Per backend docs Persona settles in 1–10s typically; 15 polls (≈30s at 2s interval) is a reasonable upper bound but should be a named feature constant in `models/` so other layers can reference it.
8. **`startCriminalCheck` mutation has no `onError` handler.** `useCriminalCheckForm.handleSubmit` catches and Alerts directly, which works, but pushing the Alert into the mutation's `onError` (the way `startPersonaVerification` does) would be more consistent.
9. **Promo-code redemption is a `console.warn` stub.** Need to wire it back when the App Store Connect / Play Console offer set is finalised. Today the paywall still shows the "Enter promo code" button.
10. **`startCriminalCheck` invalidates the auth session on success** so the screen sees the badge update, but the result of the mutation is otherwise dropped — we don't surface badge=Denied differently from badge=Approved on the way out. Both currently route home; the home flow renders `BuzzWelcomeFlow` for ANY non-None badge. If product wants a "we couldn't find any records" flash, this is where it goes.

## Open questions to resolve next

- Should the paywall's "auto-skip if isPro" effect run unconditionally, or should we let the user view the trial card even after subscribing (e.g. if they tapped Get Started a second time from home)? Today it auto-skips — which is correct for the verify flow but might surprise users.
- Persona retry UX after `Declined`/`Failed`/`Expired`: the intro screen renders "Try again" which calls `startPersonaVerification` again, which triggers the backend gate path again. That's the spec, but we should confirm the backend treats a fresh inquiry on `Declined` correctly (per `RetryableStatuses`, it does).
- Where does badge `Denied` route? Today `Denied` users land on `BuzzWelcomeFlow` like everyone else with a non-None badge. Probably wrong — a denied user shouldn't see "Welcome to TheBuzz Community!"

## Files to watch

### Frontend (this feature)

- `src/features/verification/hooks/useIdentityVerificationIntro.ts` — phase machine + poll-count timeout
- `src/features/verification/hooks/useVerificationGate.ts` — shared gate, source of truth for redirects
- `src/features/verification/hooks/useVerificationActions.ts` — all three flow mutations
- `src/features/verification/presentation/screens/VerificationFlowScreen.tsx` — owns the inline exit-confirm modal state and the `AppHeader` chevron-left wiring
- `src/features/verification/services/verificationService.ts` — Persona SDK launcher + `startPersonaInquiry` (gate-aware) + `startCriminalCheck`
- `src/features/verification/models/verification.types.ts` — `SubscriptionRequiredError` factory + guard
- `src/features/verification/graphql/mutations/` — `startPersonaInquiry.graphql`, `startInstantCriminalCheck.graphql`

### Cross-feature

- `src/features/auth/graphql/fragments/user.fragment.graphql` — `AuthUserFields` carries all the verified-data fields read by this flow
- `src/lib/revenuecat/RevenueCatProvider.tsx` — `isPro`, `purchase`, `restorePurchases`, `subscriptionPriceString`
- `src/features/home/hooks/useBuzzScreen.ts` — flow switch driven by `backgroundCheckBadge`
- `src/features/home/hooks/useBuzzVerifyFlow.ts` — calls `resolveVerifyIdentityRoute` to drive Get Started / Resume CTA
- `src/features/home/presentation/components/BuzzWelcomeFlow.tsx` — the post-verification home state

### Backend (reference)

- `beekeepr-api/.claude/features/identity-verification-persona.md` — webhook lifecycle, subscription gate behaviour, watermark
- `beekeepr-api/.claude/features/identity-verification-checkr.md` — `startInstantCriminalCheck` server-locked verified fields, badge classification, renewal sweeper
- `beekeepr-api/.claude/features/billing-subscriptions.md` — RC mirror columns, REST fallback, webhook event mapping
