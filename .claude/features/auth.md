# Auth — Feature Flow

> Source: `src/features/auth/`. This is the most fully-realised feature and acts as the reference vertical for the Beekeepr architecture (presentation → hooks → services → repository → graphql).

## What this feature owns

- Account creation and sign-in via **email + 5-digit verification code**
- Sign-in via **Google** (id-token exchange with the API)
- Sign-out
- **Terms-of-Use / Privacy** acceptance (gated modal once authenticated)
- Kicking off **Persona** identity-verification inquiries (the Persona screen itself lives in the `verification` feature; auth only mints the inquiry on the server)
- Reading the **current user** session (consumed by routing guards and the terms modal)

## Public surface

Re-exported from `src/features/auth/index.ts`:

| Export                                 | Layer            | Purpose                                                       |
| -------------------------------------- | ---------------- | ------------------------------------------------------------- |
| `CreateAccountEmailScreen`             | presentation     | Step 1: email entry                                           |
| `CreateAccountCodeScreen`              | presentation     | Step 2: 5-digit code entry                                    |
| `TermsAcceptanceModal`                 | presentation     | Modal shown on first authenticated boot until terms accepted  |
| `useAuthSession`                       | hook (query)     | `currentUser` TanStack query — single source of truth         |
| `useAuthActions`                       | hook (mutations) | Bundle of all auth mutations + cache writes                   |
| `useCreateAccountEmailForm`            | hook             | Wires email screen state + `requestEmailSignIn`               |
| `useCreateAccountCodeForm`             | hook             | Wires code screen state + auto-submit + `verifyEmailSignIn`   |
| `authQueryKeys`                        | model            | Feature-scoped query-key factory                              |
| `auth.types`                           | model            | Re-exports of generated GraphQL types as feature types        |
| `authTerms` (`hasAcceptedCurrentTerms`)| model            | Pure predicate over `AuthUser`                                |
| `authService`                          | service          | Use-case orchestration (calls repo + token storage + google)  |
| `authValidationService`                | service          | Pure email + code-digit validation helpers                    |

## File map

```text
src/features/auth/
  graphql/
    fragments/
      authSession.fragment.graphql        # token, expiresAtUtc
      user.fragment.graphql               # id, email, displayName, verification status, terms timestamp, persona ids
    mutations/
      requestEmailSignIn.graphql          # send code to email
      verifyEmailSignIn.graphql           # exchange email + code for session+user
      signInWithGoogle.graphql            # exchange Google id-token for session+user
      acceptTerms.graphql                 # mark current user as having accepted ToS/Privacy
      signOut.graphql                     # invalidate session server-side
      startPersonaInquiry.graphql         # mint a Persona inquiry id for the verify flow
    queries/
      currentUser.graphql                 # bootstrap query — drives router guards
    generated/auth.generated.ts           # codegen output (Documents + types + enums)

  models/
    auth.types.ts                         # AuthUser, AuthSession, AuthCredentials, input aliases, enum re-exports
    authQueryKeys.ts                      # ['auth'] / ['auth','session'] / etc. — feature-scoped keys
    authTerms.ts                          # hasAcceptedCurrentTerms(user)

  repository/
    authRepository.ts                     # thin GraphQL passthrough — one method per operation

  services/
    authService.ts                        # use-cases: validate payloads, throw on `error`, persist token, return clean shapes
    authValidationService.ts              # pure helpers for email + code-digits

  hooks/
    useAuthSession.ts                     # useQuery(currentUser) — feeds router + terms gate
    useAuthActions.ts                     # useMutation bundle for all writes; cache updates on success
    useCreateAccountEmailForm.ts          # email screen state + submit + redirect to code screen
    useCreateAccountCodeForm.ts           # code screen state + auto-submit + resend

  presentation/
    components/
      AuthBrandHeader.tsx                 # shared visual header for auth screens
      TermsAcceptanceModal.tsx            # checkbox-gated accept/decline modal
    screens/
      CreateAccountEmailScreen.tsx
      CreateAccountCodeScreen.tsx

  index.ts                                # public surface (see table above)
```

## Routes that mount this feature

```text
app/_layout.tsx                                  → reads useAuthSession; toggles (public) vs (private) via Stack.Protected
app/(public)/auth/create-account-email.tsx       → renders <CreateAccountEmailScreen />
app/(public)/auth/create-account-code.tsx        → renders <CreateAccountCodeScreen />
app/(private)/_layout.tsx                        → mounts <TermsAcceptanceModal /> over the private stack until accepted
```

`app/_layout.tsx` is the routing gate. It calls `useAuthSession()` and, while pending, renders nothing (splash stays). Once resolved, `Stack.Protected` flips between `(public)` and `(private)` based on whether `data` (the user) is truthy.

## End-to-end flows

### 1. Email sign-in (the primary path)

```text
[CreateAccountEmailScreen]
   └─ useCreateAccountEmailForm
        ├─ authValidationService.normalizeEmail / isValidEmail
        └─ requestEmailSignIn.mutateAsync({ email })
              └─ authService.requestEmailSignIn
                    └─ authRepository.requestEmailSignIn (GraphQL)
                          ↳ on success → router.push('/auth/create-account-code', { email })

[CreateAccountCodeScreen]
   └─ useCreateAccountCodeForm
        ├─ authValidationService.sanitizeVerificationDigit / isVerificationCodeComplete
        ├─ auto-submits when 5 digits filled (de-duped via lastSubmittedCodeRef)
        └─ verifyEmailSignIn.mutateAsync({ email, code })
              └─ authService.verifyEmailSignIn
                    ├─ authRepository.verifyEmailSignIn (GraphQL)
                    ├─ throws if payload.error / missing session / missing user
                    └─ tokenStorage.setToken(session.token)
                    ↳ returns { session, user }

[useAuthActions onSuccess]
   └─ queryClient.setQueryData(authQueryKeys.session(), user)
         ↳ useAuthSession in app/_layout.tsx flips → Stack.Protected swaps to (private)
              ↳ PrivateLayout mounts → if !hasAcceptedCurrentTerms(user) → TermsAcceptanceModal opens
```

### 2. Google sign-in

```text
authService.signInWithGoogle
  ├─ googleAuth.getIdToken()                    # from src/lib/auth/google
  ├─ authRepository.signInWithGoogle({ idToken })
  ├─ throws on error / missing session / missing user
  ├─ tokenStorage.setToken(session.token)
  └─ returns { session, user }
        ↳ same cache-write + routing-flip as email path
```

(Currently only wired through `useAuthActions`; no screen calls it yet.)

### 3. Sign-out

```text
authService.signOut
  ├─ authRepository.signOut (GraphQL)
  ├─ throws if payload.success === false
  ├─ tokenStorage.clearToken()
  └─ googleAuth.signOut()
        ↳ useAuthActions onSuccess → setQueryData(session, null)
        ↳ app/_layout.tsx flips back to (public)
```

Triggered from two places today: the `TermsAcceptanceModal` "I Disagree" button, and (eventually) profile/settings.

### 4. Terms acceptance gate

```text
PrivateLayout (app/(private)/_layout.tsx)
  ├─ useAuthSession → user
  ├─ shouldShowTermsModal = Boolean(user) && !hasAcceptedCurrentTerms(user)
  ├─ acceptTerms.mutate()  → authService.acceptTerms → setQueryData(session, updated user)
  └─ signOut.mutate()      → as above
```

`hasAcceptedCurrentTerms` is a pure predicate: `Boolean(user.termsAcceptedAtUtc)`. The "current" in the name leaves room for versioned terms later (right now any acceptance counts).

### 5. Persona inquiry kickoff

```text
authService.startPersonaInquiry
  ├─ authRepository.startPersonaInquiry (GraphQL)
  ├─ throws if !success or missing inquiryId
  └─ returns StartPersonaInquiryPayload
        ↳ consumed by the verification feature (not by an auth screen)
```

## Cache & query-key conventions

- One canonical query: `authQueryKeys.session()` → `['auth', 'session']`. It holds the **`AuthUser | null`**, not `AuthCredentials`. The session token never lives in TanStack — it lives in `tokenStorage` only.
- All mutations write the user back into `authQueryKeys.session()` directly with `setQueryData`. There is no `invalidateQueries` round-trip; the server always returns the user fragment on successful mutations, so we trust it.
- `requestEmailCode` / `verifyEmailCode` / `signInWithGoogle` keys exist in the factory but are unused today. They're reserved for cases where we'd want a query (not a mutation) view on those calls — e.g. inspecting the last request. Safe to delete if we don't end up using them.

## Token storage

- Token is written via `tokenStorage.setToken` inside `authService` only — never in hooks, never in repository.
- Token is read by `lib/graphql/client` (`executeGraphQL`) and attached to outbound requests.
- `getCurrentUser` therefore depends on the token having been persisted from a prior session — the `currentUser` query returns `null` when there is none, which is what the router guard treats as "unauthenticated".

## Validation (pure)

`authValidationService` is the only piece of pure FP-shaped code in the feature today. All exports are pure, total functions:

```ts
normalizeEmail(email)              // trim
isValidEmail(email)                // regex test on normalized
createEmptyCodeDigits(length)      // ['', '', '', '', '']
sanitizeVerificationDigit(value)   // strip non-digits, take last char
isVerificationCodeComplete(digits) // every digit length === 1
joinVerificationCode(digits)       // ''.join
```

Code-screen behaviour (auto-advance focus, auto-submit when complete, dedupe via `lastSubmittedCodeRef`) lives in the hook, not the screen.

## Error handling shape (today)

`authService` methods all follow the same shape:

```ts
const payload = await authRepository.<op>(input);
if (payload.<op>.error)                throw new Error(payload.<op>.error);
if (!payload.<op>.session) throw new Error('… but no session was returned.');
if (!payload.<op>.user)    throw new Error('… but no user was returned.');
return { session, user };
```

The form hooks then `try/catch` and rely on `useMutation`'s `onError` (currently a `react-native` `Alert`) to surface the message. This works but it's the part that's furthest from where we want to land — see "Misalignments" below.

## How well it follows the architecture today

| Rule from `.claude/index.md`                    | Status                                                        |
| ----------------------------------------------- | ------------------------------------------------------------- |
| Routes are thin wrappers                        | ✅ both auth pages just render the feature screen             |
| Screens render only — no fetching/orchestration | ✅ both screens consume a hook and render                     |
| Components declared as `const ... = () =>`      | ✅ throughout                                                 |
| No classes                                      | ✅ services and repository are object-of-functions modules    |
| Side effects isolated to services/repository    | ✅ token storage, google sign-in, GraphQL all in service/repo |
| Feature-scoped query keys                       | ✅ `authQueryKeys`                                            |
| Pure data + pure helpers in `models/`/`services/` | ✅ `authValidationService`, `authTerms`                     |
| Discriminated unions over booleans + nulls      | ⚠️ partial — see misalignments                                |
| Total functions over throwing                   | ❌ services throw on every error path                         |
| Exhaustive switches with `assertNever`          | ❌ no use-sites yet (no union state to switch on)             |
| `readonly` everywhere                           | ❌ inputs/outputs are mutable shapes                          |

## Misalignments with the new style (things to change)

These are the deltas between what's in the repo and the ReasonReact/ReasonML/FP guidance in `.claude/index.md`. Listed for the next pass:

1. **Services throw instead of returning `Result`.** Every method in `authService` throws `new Error(...)` for expected failures (bad code, expired code, server error). We want `Result`-shaped returns: `{ ok: true; value } | { ok: false; error }`. The `useMutation` layer can adapt by either (a) treating `ok: false` as a thrown error inside `mutationFn` (cheapest), or (b) switching to a custom hook that returns the result variant directly.
2. **No discriminated state union for the code screen.** `useCreateAccountCodeForm` returns ~10 booleans/strings. The natural ReasonML model is `type CodeState = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'error'; message: string } | { kind: 'verified' }`. Same for the email screen.
3. **Alerts in `useAuthActions` couple a hook to RN `Alert`.** Surfacing errors is a presentation concern. The hook should expose the error variant; the screen decides whether that becomes an alert, an inline message, or a toast.
4. **`AuthCredentials` is unused after the cache write.** `authService.verifyEmailSignIn` returns `{ session, user }` but the only consumer (`useAuthActions`) only uses `user`. Either drop the session from the return type or actually expose it (e.g. for showing token expiry).
5. **`authQueryKeys.requestEmailCode` / `verifyEmailCode` / `signInWithGoogle` are dead.** Mutations don't need keys. Delete unless we adopt them.
6. **`hasAcceptedCurrentTerms` accepts `AuthUser | null | undefined`.** With non-null discipline at the call sites we can narrow this to `AuthUser` and let routing handle the null case, but the current callers (`PrivateLayout`) genuinely pass `data` from `useQuery` which is `AuthUser | null | undefined`, so this is OK to leave.
7. **`useCreateAccountCodeForm` mixes refs, effects, and async submit.** The auto-submit dedupe via `lastSubmittedCodeRef` works but it's stateful in a way that's hard to test. A small reducer (variant-based) would make the legal transitions explicit.
8. **No `readonly` on returned shapes.** Hook return values and service return values are mutable in the type system. Add `readonly` / `Readonly<...>` to the public surface.
9. **`signInWithGoogle` is wired but unscreened.** Either ship a button or remove it from `useAuthActions` until needed (so we don't carry untested code paths).
10. **`startPersonaInquiry` lives in `authService` but is consumed by the `verification` feature.** Could stay (it's a session-scoped server call) or move into `verification/services` for locality. Worth a deliberate decision.

## Open questions to resolve in the rewrite

- Versioned terms: should `hasAcceptedCurrentTerms` compare `termsAcceptedAtUtc` against a deployed `TERMS_VERSION_UPDATED_AT`?
- Do we want a refresh-token / token-expiry flow, or are server sessions long-lived enough that we can rely on `currentUser` returning `null` to signal expiry?
- Should `useAuthActions` split into per-screen hooks (`useEmailSignIn`, `useGoogleSignIn`, `useTermsAcceptance`) so each screen pulls only what it uses?
