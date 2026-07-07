# OnboardingCreateAccountBody

Pure presentation body for the onboarding "create account" screen. Rendered by `OnboardingCreateAccountScreen`, which owns the connection to `useOnboardingCreateAccount` and passes the platform flag, pending states, and navigation callbacks in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│                                          │
│              [ BrandMark ]               │
│                                          │
│                                          │
│         ┌──────────────────┐             │
│         │                  │             │
│         │  Let's do this   │             │
│         │   illustration   │             │
│         │                  │             │
│         └──────────────────┘             │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │   Continue with Apple    (iOS)     │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │   Continue with Google             │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │   Continue with Email              │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `showAppleButton` | `boolean` | Whether to render the Apple CTA. `useOnboardingCreateAccount` reads `Platform.OS === 'ios'` in production. |
| `isApplePending` | `boolean` | Apple sign-in mutation is in flight. Drives the Apple button's spinner. |
| `isGooglePending` | `boolean` | Google sign-in mutation is in flight. Drives the Google button's spinner. |
| `onContinueWithApple` | `() => void` | Tapping the Apple CTA. Parent calls `signInWithApple.mutate()`. |
| `onContinueWithGoogle` | `() => void` | Tapping the Google CTA. Parent calls `signInWithGoogle.mutate()`. |
| `onContinueWithEmail` | `() => void` | Tapping the Email CTA. Parent routes to `/auth/create-account-email`. |

## When this renders

Reached from the `/onboarding/create-account` route, which sits between the "what we do" carousel and the auth flow. This is the first surface where the user commits to an identity — every path off this screen ends with a signed-in session (Apple/Google immediately; Email after the code prompt).

- Coming from: the "Let's go!" CTA on the third slide of `OnboardingWhatWeDoBody`.
- Going to (Apple/Google): the authenticated home flow, or the terms-acceptance gate if this is a new account.
- Going to (Email): `/auth/create-account-email`, then `/auth/create-account-code`.

## Why it's a body, not a screen

Same reason as `VerificationLearnMoreBody`: the connected screen depends on `useRouter` and `useAuthActions` (which pulls in TanStack Query and the error-modal provider). None of those exist under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a short adapter that maps the hook's `handleX` names onto the body's `onX` prop convention.

## Related

- [`useOnboardingCreateAccount`](../../hooks/useOnboardingCreateAccount.ts) — reads `Platform.OS`, owns the router hop into `/auth/create-account-email`, and forwards the auth mutations from `useAuthActions`.
- [`OnboardingCreateAccountScreen`](../screens/OnboardingCreateAccountScreen.tsx) — the connected wrapper.
- [`OnboardingWhatWeDoBody`](../components/OnboardingWhatWeDoBody.tsx) — the sibling body that hands off to this screen.
