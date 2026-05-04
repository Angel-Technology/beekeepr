# IdentityWaitingSection

Body of the `waiting` phase. The Persona SDK has closed on the user's side; the backend hasn't received Persona's webhook yet. We poll `currentUser` every 2s and re-render this section until the status flips.

## Anatomy

```text
┌──────────────────────────────────────┐
│                                      │
│         [  ActivityIndicator  ]      │
│                                      │
│         Verifying you…               │
│                                      │
│   This usually takes a few seconds.  │
│   We're waiting for confirmation     │
│   from our verification partner.     │
│                                      │
└──────────────────────────────────────┘
```

## Props

None. Pure rendering — the parent decides when to mount/unmount this section based on `flow.phase === 'waiting'`.

## When this renders

`identityVerificationStatus` is one of `Created`, `Pending`, `Completed`, `NeedsReview`. The parent's polling query is active.

## When it stops rendering

- Status flips to `Approved` → parent swaps to `CriminalIntroSection`.
- Status flips to `Declined` / `Failed` / `Expired` → parent swaps to `IdentityDeclinedSection`.
- 15 polls (~30s) elapse without a change → parent swaps to `IdentityTimedOutSection`.

## Related

- [`IdentityKickoffSection`](./IdentityKickoffSection.tsx) — what came before this state.
- [`IdentityTimedOutSection`](./IdentityTimedOutSection.tsx) — what comes next if the webhook is slow.
- [`IdentityDeclinedSection`](./IdentityDeclinedSection.tsx) — what comes next if Persona rejects.
