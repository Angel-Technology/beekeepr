# IdentityNeedsReviewSection

Body of the `needs-review` phase. Persona flagged the inquiry for manual review by a human — this isn't a transient wait, it's a decision that can take hours or days. We tell the user we'll let them know when it's done and give them a way out of the flow.

## Anatomy

```text
┌──────────────────────────────────────┐
│                                      │
│   We're reviewing your verification  │
│                                      │
│   Our verification partner is        │
│   taking a closer look at your       │
│   submission. This usually finishes  │
│   within a day. We'll let you know   │
│   when it's done.                    │
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
| `onGoHome` | `() => void` | Exit the flow back to `/(main)`. The next session refresh (or a push notification, once wired) will route the user past this screen once Persona resolves the review. |

## When this renders

`flow.phase === 'needs-review'`. Mounted by `VerificationFlowBody` when the derived phase equals `'needs-review'` — Persona returned a `NeedsReview` verdict on the inquiry, meaning it wasn't cleanly approved or declined and a human reviewer at Persona has to take a closer look.

## How this differs from `IdentityWaitingSection`

Both sections describe "we're waiting on Persona," but the waits are fundamentally different, and so are the affordances:

| | `IdentityWaitingSection` | `IdentityNeedsReviewSection` |
| --- | --- | --- |
| Trigger | SDK closed on-device; backend hasn't seen the webhook yet | Webhook landed with a `NeedsReview` verdict |
| Wait length | Seconds (usually < 30s) | Hours to days |
| Who's working | Automated poll for a webhook | Human reviewer at Persona |
| UI | Spinner + reassurance copy, no CTA | Title + copy + "Back to home" CTA |
| How it resolves | Section swaps itself out when status flips | User returns later; screen re-derives phase from current status |

## Why the "Back to home" CTA

Resolution isn't imminent, so blocking the user on a screen they can't do anything with would be pointlessly hostile. Letting them exit — and picking up wherever Persona lands them on the next session refresh — is both kinder and honest about the wait.

## Related

- [`IdentityWaitingSection`](./IdentityWaitingSection.tsx) — the transient webhook-poll wait; different affordances, different timescale.
- [`VerificationFlowBody`](../components/VerificationFlowBody.tsx) — dispatches to this section when `phase === 'needs-review'`.
- [`useVerificationFlow`](../../hooks/useVerificationFlow.ts) — derives `phase` from `identityVerificationStatus`.
