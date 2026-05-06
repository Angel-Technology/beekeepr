# Button

The shared CTA primitive. Use this for almost every clickable affordance with a labelled rectangular target. For circular icon-only targets, see [`IconButton`](./IconButton.tsx). For the inline pill CTA used inside a page (the "Let's go!" pattern), see [`BuzzButton`](./BuzzButton.tsx).

## Anatomy

```text
┌──────────────────────────────────────┐
│  [iconLeft]   label   [iconRight]    │
└──────────────────────────────────────┘
   pill (rounded-round) · 56px min-height · self-stretch
```

`Button` renders a `TouchableOpacity` containing an optional left icon, a single-line `<Text>` label, and an optional right icon. When `loading` is true, the label and icons are replaced with a `BounceLoader`.

## Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `label` | `string` | required | Single-line. Lexend SemiBold 16px. |
| `onPress` | `() => void` | — | Wired into the Storybook Actions panel. |
| `variant` | `'solid' \| 'outline'` | `'solid'` | Solid uses black bg + white text. Outline uses bg-default + 12% black border + black text. |
| `iconLeft` | `ReactNode` | — | Optional. Triggers the icon-padding layout (`px-4 py-2 gap-6`). |
| `iconRight` | `ReactNode` | — | Optional. |
| `disabled` | `boolean` | `false` | 60% opacity, blocks presses. |
| `loading` | `boolean` | `false` | Implies disabled. Renders `BounceLoader` in place of label + icons. |
| `className` | `string?` | — | Tailwind override on the touchable container. |
| `textClassName` | `string?` | — | Tailwind override on the label. |

## Single size by design

There used to be six sizes (`xs` … `2xl`). The Buzzkeepr 2026 redesign uses a single 56px pill across the app, so `Button` no longer takes a `size` prop. If you need a smaller variant for a specific context, override via `className` (e.g., `className="min-h-[44px] rounded-md"`) — but consider whether you actually need a different shape, or whether the design system should grow to accommodate it.

## Layout: with vs without an icon

| Has icon? | Padding | Gap |
| --- | --- | --- |
| No (just label) | `px-6 py-4` (24/16) | `gap-2` (8) |
| Yes (`iconLeft` and/or `iconRight`) | `px-4 py-2` (16/8) | `gap-6` (24) |

The icon-present padding is tighter so the icon can sit closer to the edge while the label gets generous breathing room.

## When to use

- **Solid (default)** for the primary CTA on a screen ("Continue", "Save", "Submit").
- **Outline** as the secondary action paired next to a Solid button on a row.
- **Solid with `iconLeft`** for "Continue with Google", "Continue with Apple" — the icon is the brand logo (32×32 typical).

## When *not* to use

- **Inline within page content** with leading + trailing icons → use `BuzzButton` (compact, fixed-width pill).
- **Icon-only circular target** → use `IconButton`.
- **List rows** with leading icons + trailing chevrons → use `TabButton`.
- **Don't pass JSX into `label`.** The label is `string` only by design — for richer content rethink the use case.

## Loading vs Disabled

These look superficially similar but mean different things:

- **`loading`** → "you tapped this, an async action is running, please wait." Renders `BounceLoader`, presses no-op.
- **`disabled`** → "this can't be tapped right now (validation, permissions, idle state)." 60% opacity, no spinner.

Pick the one that matches the *cause* of the un-tappable state. They're mutually exclusive in practice — `loading` already implies `disabled`.

## Behaviour quirks

- `self-stretch` makes the button fill its parent's cross-axis. Inside a `<View>` with a fixed width, you get that width; inside a centred container, you get full available width.
- Pressed/active state isn't customised — relies on `TouchableOpacity`'s default 0.2 opacity dim.
- The outline variant's border colour is hard-coded `rgba(0,0,0,0.12)` per the design spec. Override with `className` if needed.

## Related

- [`BuzzButton`](./BuzzButton.tsx) — compact pill with leading + trailing icons (the "Let's go!" CTA pattern).
- [`IconButton`](./IconButton.tsx) — circular icon-only target.
- [`TabButton`](./TabButton.tsx) — list-row composition with leading icon, label, optional trailing content.
