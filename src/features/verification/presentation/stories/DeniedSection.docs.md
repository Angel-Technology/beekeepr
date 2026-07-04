# DeniedSection

Body of the `denied` phase. Terminal "not approved" screen shown after the Checkr criminal-record search returns a fail verdict. Explains the 30-day appeal window and offers a path to support.

## Anatomy

```text
┌──────────────────────────────────────┐
│                                      │
│   Oh no! Something went wrong.       │
│   Looks like we weren't able to get  │
│   you into TheBuzz Community…        │
│                                      │
│           (  SadBee SVG  )           │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ NextStepsCard                │   │
│   │  • not approved based on the │   │
│   │    background screening      │   │
│   │  • tap below to resolve      │   │
│   │  • 30 days to appeal         │   │
│   │  [ Appeal decision ]         │   │
│   └──────────────────────────────┘   │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ PrivacyComplianceCard        │   │
│   │  • strictly confidential     │   │
│   │  • we won't disclose         │   │
│   │  [ More info ]               │   │
│   └──────────────────────────────┘   │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Got it                       │   │
│   └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `onGotIt` | `() => void` | Dismisses the flow. Wired to `onExit` in `VerificationFlowBody`. |
| `onAppealDecision` | `() => void` | Opens the support URL in an in-app browser. See below. |
| `onMoreInfo` | `() => void` | Opens the parent screen's privacy modal. |

## When this renders

The `denied` phase in the consolidated verification flow — reached after the Checkr criminal-record search comes back with a fail verdict. In `VerificationFlowBody`, this is gated on `phase === 'denied'`, and the header's chevron-left dismisses straight to home (terminal state, no abandon modal).

## What "appeal decision" actually does

`onAppealDecision` is wired at the screen level to `openInAppBrowser(environmentConfig.supportURL)` (see `VerificationFlowScreen`) — the user is taken to the support site inside an in-app browser rather than kicked out to Safari. Users have 30 days from the denial to appeal, per the copy in the `NextStepsCard`.

## Related

- [`VerificationFlowBody`](../components/VerificationFlowBody.tsx) — owns the phase switch and wires `onGotIt` / `onMoreInfo`.
- [`NextStepsCard`](../components/NextStepsCard.tsx) — the appeal-window card.
- [`PrivacyComplianceCard`](../components/PrivacyComplianceCard.tsx) — the confidentiality card.
