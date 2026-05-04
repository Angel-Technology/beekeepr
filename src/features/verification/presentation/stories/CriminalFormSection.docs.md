# CriminalFormSection

Terminal body of the verification flow. The user fills in their phone number; everything else is server-locked from Persona's verified payload. Submit kicks off Checkr's instant criminal check — on success the parent navigates home and the home tab swaps to `BuzzWelcomeFlow` once the badge lands.

## Anatomy

```text
┌──────────────────────────────────────┐
│  Find my records                     │
│  To search for your records, please  │
│  provide your phone number…          │
│                                      │
│  LEGAL NAME                          │
│  ┌──────────────────────────────┐    │
│  │ First name        Jane       │    │
│  │ Middle name       A          │    │
│  │ Last name         Smith      │    │
│  └──────────────────────────────┘    │
│                                      │
│  PHONE & DOB                         │
│  ┌──────────────────────────────┐    │
│  │ Phone Number   (555)…        │    │
│  │ Date of Birth  01/15/1992    │    │
│  └──────────────────────────────┘    │
│                                      │
│  STATE OF RESIDENCE                  │
│  ┌──────────────────────────────┐    │
│  │ Select State    CA           │    │
│  └──────────────────────────────┘    │
│                                      │
│  ┌──────────────────────────────┐    │
│  │          Submit              │    │
│  └──────────────────────────────┘    │
└──────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `firstName` | `string` | Read-only. From `user.verifiedFirstName`. |
| `middleName` | `string` | Read-only. From `user.verifiedMiddleName`. |
| `lastName` | `string` | Read-only. From `user.verifiedLastName`. |
| `dateOfBirth` | `string` | Read-only. Pre-formatted `mm/dd/yyyy` (backend stores `YYYY-MM-DD`). |
| `licenseState` | `string` | Read-only. From `user.verifiedLicenseState`. |
| `phoneNumber` | `string` | Editable. Seeded from `user.phoneNumber` if present. |
| `isSubmitting` | `boolean` | Submit is in flight. |
| `canSubmit` | `boolean` | Verified first/last name + non-empty phone. Disables submit otherwise. |
| `onChangePhoneNumber` | `(value: string) => void` | Phone-input change handler. |
| `onSubmit` | `() => void` | Triggers `useVerificationActions.startCriminalCheck`. |

## When this renders

`flow.phase === 'criminal-form'`. Triggered by `identityVerificationStatus === Approved` AND the user tapped "Start search" on the criminal-intro section (sets `criminalIntroAcknowledged === true` in `useVerificationFlow`).

## Server-locked fields, why

Per `beekeepr-api/.claude/features/identity-verification-checkr.md`, the backend ignores client-side name/DOB/state on the `startInstantCriminalCheck` mutation — it locks those to the Persona-verified payload server-side. The form disables those inputs to make the contract obvious to the user.

## On submit

Mutation chain: `useCriminalCheckForm.handleSubmit` → `useVerificationActions.startCriminalCheck` → `verificationService.startCriminalCheck` → `verificationRepository.startInstantCriminalCheck` (GraphQL). On success the form hook `router.replace('/(main)')`s; the home tab re-derives `flow` and renders `BuzzWelcomeFlow` once `backgroundCheckBadge` is non-`None`.

## Related

- [`CriminalIntroSection`](./CriminalIntroSection.tsx) — what came before this.
- [`useCriminalCheckForm`](../../hooks/useCriminalCheckForm.ts) — connected hook for the parent screen.
