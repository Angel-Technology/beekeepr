# Verification Flow story

Renders `VerificationFlowBody` — the same presentation component that production's `VerificationFlowScreen` mounts. No inline preview, no parallel JSX. The body has zero feature-hook dependencies (only `useState` for modal state) so Storybook can import it directly without provider mocks.

## Layering

```text
VerificationFlowScreen.tsx           # connected wrapper (production)
  ├─ useVerificationFlow()           # phase machine
  ├─ useCriminalCheckForm()          # form state
  ├─ useVerificationGate(...)        # subscription gate
  ├─ useRouter()                     # exit navigation
  └─ <VerificationFlowBody {...} />  # SAME body the story renders

VerificationFlowPreview.stories.tsx  # this file
  └─ <VerificationFlowBody ... />    # same component, props from controls
```

## Props the controls drive

| Prop | Control | Notes |
| --- | --- | --- |
| `phase` | radio/select | `kickoff` / `waiting` / `timed-out` / `declined` / `criminal-intro` / `criminal-form` |
| `isStarting` | boolean | Drives the loader on Kickoff and Declined CTAs. |
| `firstName` … `licenseState` | text | Read-only fields shown in `criminal-form`. |
| `phoneNumber` | text | The one editable field in production; driven by the controls panel here since the change handler is a stub. |
| `isSubmitting` / `canSubmit` | boolean | Form-state toggles. |

## Action panel wires

- `onExit` (chevron-left → confirm → "Yes, exit", or "Back to home" on `timed-out`)
- `onStartVerification` (kickoff and declined CTAs)
- `onStartCriminalSearch` (intro → form transition)
- `onChangePhoneNumber` / `onSubmit` (form interactions)

## Why this story exists at all

The connected screen can't be storied — `useRouter`, `useAuthSession`, `useRevenueCat`, and `useVerificationGate` all crash without their providers. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks.

## What this story does NOT cover

- Real Persona/Checkr backend behaviour — those mutations live behind the screen, not the body.
- Phase transitions over time (e.g. waiting → approved). The story is a snapshot per phase; flip the `phase` control to walk through them manually.
- The actual form input wiring — `onChangePhoneNumber` is a stub here, so typing in the field doesn't update the value. Edit the `phoneNumber` control instead.

## Related

- [`VerificationFlowBody`](../components/VerificationFlowBody.tsx) — the storied component.
- [`VerificationFlowScreen`](../screens/VerificationFlowScreen.tsx) — the connected wrapper.
- Each section's own `*.stories.tsx` (`IdentityKickoffSection.stories.tsx`, etc.) for testing a single body in isolation.
