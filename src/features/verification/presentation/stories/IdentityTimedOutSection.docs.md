# IdentityTimedOutSection

Body of the `timed-out` phase. ~30s have elapsed in the waiting state without Persona's webhook landing. Soft fallback copy + an exit affordance so the user isn't stuck on a perpetual spinner.

## Anatomy

```text
┌──────────────────────────────────────┐
│                                      │
│   This is taking longer than usual   │
│                                      │
│   Our verification partner needs a   │
│   little extra time. We'll email     │
│   you when your identity is          │
│   confirmed — you can come back any  │
│   time.                              │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Back to home                 │   │
│   └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `onGoHome` | `() => void` | Exit the flow back to `/(main)`. Polling is paused; resumes if the user returns. |

## When this renders

`flow.phase === 'timed-out'`. Triggered by `pollCount >= POLL_TIMEOUT_COUNT` (15 polls × 2s ≈ 30s) while baseline is still `waiting`.

## Why we time out instead of polling forever

Without a ceiling, a dropped webhook leaves the user staring at a spinner. The timeout is a UX safety net — it doesn't cancel the verification, just reframes the wait so the user can go do something else. The backend will email them when it resolves.

## Related

- [`IdentityWaitingSection`](./IdentityWaitingSection.tsx) — the state before this.
- [`useVerificationFlow`](../../hooks/useVerificationFlow.ts) — owns `POLL_TIMEOUT_COUNT` and the poll-counter logic.
