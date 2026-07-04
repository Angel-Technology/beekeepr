# ProfilePreviewHiddenCard

Static replacement for `ProfilePreviewCard` rendered when the viewer's `profileVisibility` is `Private`. Communicates that the drawer is intentionally gated shut, plus a hint to flip Share Profile back on in the toggle directly below it.

## Anatomy

```text
┌──────────────────────────────────────────┐
│  ⚠   No preview available.               │
│      Your profile is set to private and  │
│      is not discoverable.                │
└──────────────────────────────────────────┘
```

The warning icon sits inside a `themedColors.alerts.warning`-ringed circle. The label uses a two-weight sentence — the lead ("No preview available.") is semi-bold, the trailing explanation is regular weight.

## Props

None. The component is a pure static presentation piece.

## When this renders

Inside `ProfileBody`, in the slot that would otherwise show `ProfilePreviewCard`, whenever:

- `profileVisibility === ProfileVisibility.Private`, i.e. the viewer has toggled Share Profile off.
- Or the viewer's account was created with the default privacy preference set to Private.

Flipping Share Profile back on in the toggle directly below swaps this card back to the pressable `ProfilePreviewCard`. No state managed here — the parent renders one or the other based on the visibility flag.

## Why it's non-interactive

`ProfilePreviewCard` is the only entry point to the preview drawer from the My Profile surface. Leaving this card static is the gate that keeps the drawer shut for private profiles — no `onPress`, no chevron, no tap target.

## Related

- [`ProfilePreviewCard`](../components/ProfilePreviewCard.tsx) — the pressable counterpart rendered when the profile is public.
- [`ProfileBody`](../components/ProfileBody.tsx) — the parent that picks between the two cards based on `profileShared`.
- [`ProfilePreviewBody`](../../../../components/profile-preview/ProfilePreviewBody.tsx) — the drawer body that would otherwise open from the pressable card.
