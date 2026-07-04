# AccountBody

Pure presentation body for the account settings hub. Rendered by `AccountScreen`, which owns the connection to `useAuthSession` + `useRevenueCat` and passes the read-only email, subscription-history flag, and callbacks in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│ [<]         Account                      │  ← AppHeader
├──────────────────────────────────────────┤
│                                          │
│  EMAIL ADDRESS                           │
│  This is the email address being used    │
│  for your login and email communication. │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  jane@example.com  (disabled)      │  │  ← Input
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Restore Purchase          [icon]  │  │
│  │  Manage Subscription       [icon]  │  │  ← optional row
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Delete Account (red)      [trash] │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `email` | `string` | Read-only address shown in the disabled `Input`. Empty string when the auth session hasn't loaded yet. |
| `hasSubscriptionHistory` | `boolean` | `true` shows the Manage Subscription row; `false` hides it. Maps to `isPro \|\| isLapsed` in production. |
| `onGoBack` | `() => void` | Tapping the header back button. Parent calls `router.back()`. |
| `onRestorePurchases` | `() => void` | Tapping Restore Purchase. Parent runs the RevenueCat restore and surfaces the result via the global error modal. |
| `onManageSubscription` | `() => void` | Tapping Manage Subscription. Parent opens the RevenueCat manage-subscription deep link. |
| `onDeleteAccount` | `() => void` | Tapping the destructive Delete Account row. Parent routes to `/delete-account`. |

## When this renders

Reached from the menu drawer's "Account" entry. Holds the auth email (read-only), subscription controls, and the destructive Delete Account entry point. These used to live inline in the menu drawer — splitting them into a dedicated screen keeps the drawer focused on navigation targets and keeps the account-level actions in one predictable place.

## Manage Subscription gating

RevenueCat's `openManageSubscription` deep link errors for accounts with no subscription history at all — it needs an active or lapsed entitlement to know where to route the user. `hasSubscriptionHistory` (`isPro || isLapsed` in production) guards the row so never-paid users don't get pushed into a failing deep link. Restore Purchase stays visible in both states — that's the recovery path if their entitlement lives on a different account.

## Why it's a body, not a screen

The connected screen depends on `useRouter`, `useAuthSession`, `useRevenueCat`, and `useErrorModal` — none of which have provider mocks under Storybook. Splitting into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a small adapter that maps the hooks' outputs onto the body's `on*` prop convention.

## Related

- [`AccountScreen`](../screens/AccountScreen.tsx) — the connected wrapper.
- [`MenuSection`](../components/MenuSection.tsx) — the row-list primitive rendered inside the body.
- `useAuthSession` (in `@features/auth`) — source of the email address.
- `useRevenueCat` (in `@src/lib/revenuecat`) — source of `isPro`, `isLapsed`, `restorePurchases`, `openManageSubscription`.
