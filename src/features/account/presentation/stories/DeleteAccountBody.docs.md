# DeleteAccountBody

Pure presentation body for the Delete Account confirmation screen. Rendered by `DeleteAccountScreen`, which owns the `useDeleteAccount` mutation, the RevenueCat manage-subscription entry point, and the router.

## Anatomy

```text
┌──────────────────────────────────────────┐
│ [<]        Delete Account                │  ← AppHeader
├──────────────────────────────────────────┤
│                                          │
│  Are you sure you want to delete your    │
│  account?                                │
│                                          │
│  Your account will be scheduled for      │
│  deletion and deactivated immediately…   │
│  … as outlined in our Privacy Policy.    │  ← inline link
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ What happens if you delete…        │  │
│  │  • Your profile, activity…         │  │  ← DetailCard tone="neutral"
│  │  • You will lose access…           │  │
│  │  • …                               │  │
│  └────────────────────────────────────┘  │
│                                          │
│  If you log back in within 72 hours…     │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  [💳]  Manage Subscription         │  │  ← optional
│  └────────────────────────────────────┘  │
├──────────────────────────────────────────┤
│  [ Cancel ]        [ Delete Account ]    │  ← BottomActionBar
└──────────────────────────────────────────┘

           ┌────────────────────────┐
           │  Delete account?   [X] │
           │  Once you confirm…     │  ← DeleteAccountConfirmModal
           │  [ Delete Account ]    │      (visible on tap)
           └────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `isDeleting` | `boolean` | Disables Cancel + Manage Subscription, shows spinner on Delete Account, blocks the confirm-modal dismissal. |
| `hasSubscriptionHistory` | `boolean` | `true` shows the Manage Subscription button; `false` hides it. Maps to `isPro \|\| isLapsed` in production. |
| `onGoBack` | `() => void` | Header back button. Parent calls `router.back()`. |
| `onOpenPrivacyPolicy` | `() => void` | Inline "Privacy Policy" link tap. Parent opens `environmentConfig.privacyPolicyURL` in a system browser popover. |
| `onManageSubscription` | `() => void` | Manage Subscription button tap. Parent opens the RevenueCat manage-subscription deep link. Only rendered when `hasSubscriptionHistory` is true. |
| `onCancel` | `() => void` | Bottom-bar Cancel tap. Parent calls `router.back()`. |
| `onConfirmDelete` | `() => void` | Fired from inside the confirm modal when the user confirms. Parent runs the `requestAccountDeletion` mutation. |

## When this renders

Reached from the Account settings hub via the destructive "Delete Account" row. This is the final read-through-and-confirm surface before the irreversible mutation fires. The two-step flow (screen → confirm modal → mutation) prevents accidental taps from destroying an account; the modal's dismissal is blocked once the mutation is in flight so a mid-request back-out can't leave the app in an inconsistent state.

## Local state hoisted into the body

Unlike the other account bodies, this one holds a real piece of local UI state — the confirm-modal open/closed flag. That's intentional: opening and closing the modal is pure UI toggling with no side effects, so it doesn't need to live in a feature hook. The destructive mutation itself (`useDeleteAccount`) stays in the connected screen and receives the confirm signal via `onConfirmDelete`.

## Preserving existing styling

The parent screen already used tk-tokens and `DetailCard tone="neutral"` — the body split preserves the class names and props exactly, so the visual is unchanged from before the refactor. Do not swap tokens without a design review.

## Why it's a body, not a screen

The connected screen depends on `useRouter`, `useDeleteAccount`, `useRevenueCat`, and `useErrorModal`. Splitting into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen becomes a small adapter that maps the hooks' outputs onto the body's `on*` prop convention.

## Related

- [`DeleteAccountScreen`](../screens/DeleteAccountScreen.tsx) — the connected wrapper.
- [`DeleteAccountConfirmModal`](../components/DeleteAccountConfirmModal.tsx) — the final confirmation dialog rendered inside the body.
- [`useDeleteAccount`](../../hooks/useDeleteAccount.ts) — mutation, global loader, sign-out cascade on success.
- [`AccountBody`](./AccountBody.docs.md) — hub the user comes from.
