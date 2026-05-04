# IdentityKickoffSection

Body of the `kickoff` phase of the consolidated verification flow. This is what the user sees on `/verify-identity/identity` before they tap "Start verification" to launch the Persona SDK.

## Anatomy

```text
┌──────────────────────────────────────┐
│  STEP 1 of 2                         │
│  Verify your identity                │
│  First we'll take you to our…        │
│                                      │
│  [   IllustrationLetsdothis    ]     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ • We only screen age to verify │  │
│  │ • We do not screen for gender  │  │
│  │ • We don't retain biometrics   │  │
│  │   More info                    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Start verification        →    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `isStarting` | `boolean` | Loading state for the CTA — true while the backend is minting the Persona inquiry. |
| `onStart` | `() => void` | Tapping the CTA. The parent calls `useVerificationFlow().handleStartVerification`. |
| `onMoreInfo` | `() => void` | Tapping "More info" on the privacy card. Parent toggles its `PrivacyComplianceModal`. |

## When this renders

In `VerificationFlowScreen`, this section renders when `flow.phase === 'kickoff'` — i.e. `user.identityVerificationStatus === NotStarted`. Other phases of the same flow render different sections (`IdentityWaitingSection`, `IdentityTimedOutSection`, etc.).

## Why it's a section, not a screen

The whole post-paywall flow is one screen with body sections that swap by phase. This section owns its visual layout but not the chrome (header, exit modal, privacy modal) — those live on the parent screen and stay stable across phases.

## Related

- [`IdentityWaitingSection`](./IdentityWaitingSection.tsx) — phase 2 of identity verification, polling state.
- [`IdentityTimedOutSection`](./IdentityTimedOutSection.tsx) — phase 3, ~30s timeout fallback.
- [`IdentityDeclinedSection`](./IdentityDeclinedSection.tsx) — terminal Persona failure with retry.
- [`CriminalIntroSection`](./CriminalIntroSection.tsx) — step 2 of the flow, after Persona approves.
