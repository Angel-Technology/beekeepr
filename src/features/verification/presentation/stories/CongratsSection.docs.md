# CongratsSection

Body of the `congrats` phase. The user has cleared every verification step and is choosing how to proceed — start the 30-day free trial or redeem a promo code.

## Anatomy

```text
┌──────────────────────────────────────┐
│                                      │
│   Congrats, You're in!                │
│   You can proudly display your Buzz  │
│   badge on any partnered dating app. │
│                                      │
│              ✨  Congrats  ✨          │
│              (illustration)          │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ What's included              │   │
│   │  ✓ Buzz Badge on your profile│   │
│   │  ✓ Access to TheBuzz Community│  │
│   └──────────────────────────────┘   │
│                                      │
│   ┌──────────────────────────────┐   │
│   │ Start 30-day free trial   →  │   │
│   └──────────────────────────────┘   │
│   ┌──────────────────────────────┐   │
│   │ Enter promo code             │   │
│   └──────────────────────────────┘   │
│                                      │
└──────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `isStartingTrial` | `boolean` | Loading state for the trial purchase. When `true`, the primary button shows the bounce loader and the outline "Enter promo code" button is disabled. |
| `onStartTrial` | `() => void` | Kicks off `useTrialPurchase.startTrial.mutateAsync()`. |
| `onEnterPromoCode` | `() => void` | Opens the promo code entry surface backed by `useRedeemPromoCode`. |

## When this renders

The parent flow's `phase === 'congrats'`. The user has finished screening, identity verification, and any post-verification submission, and the backend has flipped them into the celebration state. From here they either start the trial or enter a promo code — both paths lead to an active membership.

## Why the outline button disables during trial

`isStartingTrial` disables the outline "Enter promo code" CTA to prevent racing the trial purchase mutation with a promo redemption. Only one path should be in flight at a time.

## Related

- [`VerificationFlowBody`](../components/VerificationFlowBody.tsx) — parent that renders this section when `phase === 'congrats'`.
- [`useTrialPurchase`](../../hooks/useTrialPurchase.ts) — mutation invoked by `onStartTrial`.
- [`useRedeemPromoCode`](../../hooks/useRedeemPromoCode.ts) — mutation invoked once the user submits a promo code from the entry surface opened by `onEnterPromoCode`.
