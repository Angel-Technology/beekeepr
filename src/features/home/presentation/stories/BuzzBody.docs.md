# BuzzBody

Pure presentation body for the Buzz tab — the post-auth landing screen on the bottom-tab navigation. Rendered by `BuzzScreen`, which owns `useBuzzTab` (flow derivation + CTA + refresh), `useAuthSession` (avatar), and the safety-disclaimer suppression logic.

## Anatomy

```text
┌──────────────────────────────────────────┐
│  [👤]        Buzz Badge          [☰]     │  ← collapsing AppHeader
├──────────────────────────────────────────┤
│                                          │
│           (flow-driven content)          │
│                                          │
│   flow: null       → BuzzScreenSkeleton  │
│   flow: 'verify'   → BuzzVerifyFlow      │
│   flow: 'denied'   → DeniedCard          │
│                       + BuzzVerifyFlow   │
│   flow: 'membership' → BuzzMembership +  │
│                        Lottie confetti   │
│   flow: 'renewal'  → BuzzRenewalFlow     │
│   flow: 'welcome'  → BuzzWelcomeFlow     │
│                                          │
├──────────────────────────────────────────┤
│  overlays:                               │
│    PromoCodeModal                        │
│    BuzzSafetyDisclaimerModal             │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `flow` | `BuzzFlow \| null` | Which of the five variants to draw. `null` renders the skeleton. Derived by `useBuzzTab`. |
| `ctaLabel` | `string` | Primary CTA copy for the verify / denied flow (`Get Started` / `Resume` / `Start membership` / `Renew membership`). |
| `onGetStarted` | `() => void` | Primary CTA press for the verify / denied flow. |
| `onLearnMore` | `() => void \| undefined` | Secondary "Learn more" CTA. Omitted when the primary CTA already points at the learn-more screen. |
| `membershipProps` | `ComponentProps<BuzzMembershipFlow>` | Trial-pitch flow props (`isPurchasing`, `reminderLabel`, `trialEndLabel`, `onStartTrial`, `onEnterPromoCode`). |
| `renewalProps` | `ComponentProps<BuzzRenewalFlow>` | Renew-CTA flow props (`isPurchasing`, `onRenew`, `onEnterPromoCode`). |
| `welcomeProps` | `ComponentProps<BuzzWelcomeFlow>` | Connections / invites / blocked lists + row callbacks + tab state + trial countdown. |
| `promoModalProps` | `ComponentProps<PromoCodeModal>` | Visible flag + form state + close callback for the shared promo modal. |
| `isRefreshing` | `boolean` | Pull-to-refresh spinner visibility. |
| `onRefresh` | `() => void` | Fires on pull-down. |
| `profileImageUrl` | `string \| null` | SvgUri source for the profile icon. Must be pre-filtered by `isRenderableAvatarUrl`. |
| `onOpenProfile` | `() => void` | Tapping the profile icon (top-left). |
| `onOpenMenu` | `() => void` | Tapping the hamburger (top-right). |
| `onAppealDecision` | `() => void` | Denied-card "Contact Support" — wraps `openInAppBrowser` in prod. |
| `showSafetyDisclaimer` | `boolean` | Visibility of the safety modal. Only ever true on `welcome`. |
| `onDismissSafetyDisclaimer` | `(shouldPersist: boolean) => void` | Fires on modal close. Argument mirrors the "Don't show again" checkbox. |

## When this renders

The default bottom-tab landing after a signed-in user opens the app. Every subsequent action (starting the trial, verifying, renewing, browsing connections) either happens here directly or navigates out and back.

## Flow priority

1. `null` while `useBuzzTab` is still resolving.
2. `'denied'` — terminal Persona / Checkr denial.
3. `'welcome'` — badge approved AND `isPro`.
4. `'renewal'` — approved, not `isPro`, was `isLapsed`.
5. `'membership'` — approved, not `isPro`, never subscribed.
6. `'verify'` — everything else (mid-verification, fresh account).

## Why it's a body, not a screen

Same reason as `VerificationLearnMoreBody`: the connected screen depends on `useRouter`, `useNavigation`, TanStack Query hooks, and RevenueCat providers — all of which crash under Storybook. Splitting into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a thin adapter that maps hook outputs onto the body's props.

## Related

- [`useBuzzTab`](../../hooks/useBuzzTab.ts) — flow derivation, CTA copy + destination, refresh, promo-code + welcome props.
- [`BuzzVerifyFlow`](../components/BuzzVerifyFlow.tsx) / [`BuzzMembershipFlow`](../components/BuzzMembershipFlow.tsx) / [`BuzzRenewalFlow`](../components/BuzzRenewalFlow.tsx) / [`BuzzWelcomeFlow`](../components/BuzzWelcomeFlow.tsx) — the five variant components composed by the body.
- [`BuzzScreenSkeleton`](../components/BuzzScreenSkeleton.tsx) — pre-flow placeholder.
- [`BuzzSafetyDisclaimerModal`](../components/BuzzSafetyDisclaimerModal.tsx) — the first-visit welcome modal.
- [`PromoCodeModal`](../../../account/presentation/components/PromoCodeModal.tsx) — shared promo redemption modal.
- [`BuzzScreen`](../screens/BuzzScreen.tsx) — the connected wrapper.
