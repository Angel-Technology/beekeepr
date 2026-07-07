# VerificationLearnMoreBody

Pure presentation body for the "30-Day Free Trial" learn-more screen. Rendered by `VerificationLearnMoreScreen`, which owns the connection to `useVerificationLearnMore` and passes computed date labels plus navigation callbacks in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│ ┌───────┐   ┌────────────────────┐   [X] │
│ │       │   │      30-Day        │       │
│ │  🐝   │   │    Free Trial      │       │
│ │       │   │                    │       │
│ │       │   │ Try 30 days for    │       │
│ │       │   │ free, then         │       │
│ │       │   │ $9.99/month.       │       │
│ └───────┘   └────────────────────┘       │
│                                          │
│  How your trial works                    │
│  ┌────────────────────────────────────┐  │
│  │  ● Today — trial starts            │  │
│  │  ● {reminderLabel} — reminder      │  │
│  │  ● {trialEndLabel} — billing       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Get started              →        │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `reminderLabel` | `string` | "In N days" phrasing shown inside the stepper for the reminder step. Computed by `useVerificationLearnMore` as trial length minus reminder lead time (currently `In 25 days`). |
| `trialEndLabel` | `string` | Long-form date string shown inside the stepper for when the trial ends and billing starts. Computed by `useVerificationLearnMore` as today + 30 days. |
| `onGetStarted` | `() => void` | Tapping the primary CTA. Parent routes to `/verify-identity` (Persona kickoff). |
| `onGoBack` | `() => void` | Tapping the X close button. Parent calls `router.back()`. |

## When this renders

Reached from the `/verification/learn-more` route. Typically opened from a paywall or CTA that wants to explain the 30-day trial mechanics (what happens today, when we send the reminder email, and when billing starts). The user reads the explainer and either taps "Get started" to advance to Persona ID verification or the X to dismiss back to whatever surface opened it.

## What `reminderLabel` and `trialEndLabel` represent

Both labels are displayed inside the `VerificationTrialStepper` and correspond to two steps of the trial timeline:

- **`reminderLabel`** — when we email the user a heads-up that their trial is ending. In production this is `"In {TRIAL_LENGTH_DAYS - REMINDER_LEAD_DAYS} days"`, i.e. `In 25 days` under the current constants.
- **`trialEndLabel`** — the actual calendar date the free trial ends and the RevenueCat subscription starts billing. In production this is today + 30 days, formatted as a long US date (e.g. `March 22, 2026`).

Both are strings so the body has no date-formatting or timezone logic of its own — that stays in the hook.

## Why it's a body, not a screen

Same reason as `VerificationFlowBody`: the connected screen depends on `useRouter`, which crashes under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a five-line adapter that maps the hook's `handleX` names onto the body's `onX` prop convention.

## Related

- [`useVerificationLearnMore`](../../hooks/useVerificationLearnMore.ts) — computes the reminder + trial-end labels and owns the router.
- [`VerificationTrialStepper`](../components/VerificationTrialStepper.tsx) — the stepper widget that renders the two date labels.
- [`VerificationLearnMoreScreen`](../screens/VerificationLearnMoreScreen.tsx) — the connected wrapper.
