# CriminalIntroSection

Body of the `criminal-intro` phase — step 2 of 2 in the post-paywall flow. Explains the upcoming criminal-record search and gives the user a "Start search" CTA before the form opens.

## Anatomy

```text
┌──────────────────────────────────────┐
│  STEP 2 of 2                         │
│  Criminal record search              │
│  Now we'll check our criminal…       │
│                                      │
│  [   IllustrationLetsdothis    ]     │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ • This search is strictly      │  │
│  │   confidential                 │  │
│  │ • We do not retain any info…   │  │
│  │   More info                    │  │
│  └────────────────────────────────┘  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ Start search             →     │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `onStartSearch` | `() => void` | Transition to `criminal-form` phase. Pure local state — no network call. |
| `onMoreInfo` | `() => void` | Opens the parent's privacy modal. |

## When this renders

`flow.phase === 'criminal-intro'`. Triggered by `identityVerificationStatus === Approved` AND `criminalIntroAcknowledged === false`.

## Why this is its own phase rather than auto-advancing

We could skip the explainer and drop the user straight into the form once Persona approves. Product chose to keep the intro because (a) the FCRA copy on the form makes more sense after this primer, and (b) it gives the user a moment to set expectations about what's about to happen.

## Related

- [`IdentityKickoffSection`](./IdentityKickoffSection.tsx) — step 1 sibling, same layout pattern.
- [`CriminalFormSection`](./CriminalFormSection.tsx) — what comes after this.
