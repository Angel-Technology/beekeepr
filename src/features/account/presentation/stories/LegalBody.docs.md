# LegalBody

Pure presentation body for the Legal hub. Rendered by `LegalScreen`, which owns the router and the `environmentConfig` URL lookup and passes navigation + open-URL callbacks in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│ [<]         Legal                        │  ← AppHeader
├──────────────────────────────────────────┤
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  Privacy Policy               >    │  │
│  │  Terms of Use                 >    │  │
│  │  Child Safety Policy          >    │  │
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `onGoBack` | `() => void` | Tapping the header back button. Parent calls `router.back()`. |
| `onOpenPrivacyPolicy` | `() => void` | Tapping the Privacy Policy row. Parent calls `openInAppBrowser(environmentConfig.privacyPolicyURL)`. |
| `onOpenTermsOfUse` | `() => void` | Tapping the Terms of Use row. Parent calls `openInAppBrowser(environmentConfig.termsOfUseURL)`. |
| `onOpenChildSafetyPolicy` | `() => void` | Tapping the Child Safety Policy row. Parent calls `openInAppBrowser(environmentConfig.childrenPrivacyURL)`. |

## When this renders

Reached from the menu drawer's "Legal" entry point. The drawer used to stack these three links inline with every other setting; splitting them into their own screen keeps the drawer scannable and lines up with the platform convention of a dedicated Legal surface. Each row opens the corresponding URL in the in-app browser (same behaviour as when they lived on the drawer — no navigation-away side effect).

## Why it's a body, not a screen

The connected screen depends on `useRouter`, which crashes under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a small adapter that maps `router.back()` and each `openInAppBrowser(<url>)` call onto the body's `on*` prop convention.

## Related

- [`LegalScreen`](../screens/LegalScreen.tsx) — the connected wrapper.
- [`MenuSection`](../components/MenuSection.tsx) — the row-list primitive rendered inside the body.
- [`openInAppBrowser`](../../../../lib/browser.ts) — in-app browser wrapper the parent hands to each row.
- [`environmentConfig`](../../../../lib/config/environment.ts) — where the URLs live per app variant.
