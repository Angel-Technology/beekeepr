# IdentityDeclinedSection

Body of the `declined` phase. Persona returned a terminal failure — verdict negative, technical error, or expired inquiry. Lets the user retry.

## Anatomy

```text
┌──────────────────────────────────────┐
│                                      │
│   We couldn't verify your identity   │
│                                      │
│   Try again to scan your government  │
│   ID and take a selfie.              │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Try again                    │   │
│   └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `isStarting` | `boolean` | Loading state for retry. |
| `onRetry` | `() => void` | Same handler as kickoff's `onStart` — relaunches Persona via `useVerificationActions.startPersonaVerification`. |

## When this renders

`identityVerificationStatus` is one of `Declined`, `Failed`, `Expired`. The parent flow's `phase === 'declined'`.

## What "retry" actually does

Per `beekeepr-api/.claude/features/identity-verification-persona.md`, retrying from a terminal status mints a *fresh* Persona inquiry on the backend (not a resume). That's why the same `startPersonaVerification` mutation works — the backend handles the new-vs-resume decision.

## Related

- [`IdentityKickoffSection`](./IdentityKickoffSection.tsx) — same CTA, different copy. They share the action.
- [`useVerificationActions`](../../hooks/useVerificationActions.ts) — the shared mutation.
