# ProfilePreviewCard

Compact avatar + nickname + handle row with a right-side chevron. The primary entry point to the profile-preview drawer from any list. Also renders inside `ProfileBody` at the top of the My Profile screen as a "here's how you look" summary.

## Anatomy

```text
┌──────────────────────────────────────────┐
│ ⭘    Ava                              ›  │
│      @ava                                │
└──────────────────────────────────────────┘
```

## Props

| Prop       | Type                     | Notes                                                                                                            |
| ---------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| `nickname` | `string`                 | Display name. Truncated to a single line with an ellipsis.                                                        |
| `handle`   | `string`                 | Bare handle (no `@`). The component prepends `@` at display time. Passing an already-prefixed value is collapsed. |
| `imageUrl` | `string \| null \| undefined` (optional) | SVG avatar URL. Non-SVG sources (Google `picture`, Apple sign-in) are rejected by `isRenderableAvatarUrl` and the neutral `UserRound` icon renders instead. |
| `onPress`  | `() => void` (optional)  | When supplied, the row is a `TouchableOpacity` and the chevron renders. When omitted, the row is a plain `View` with no chevron. |

## When this renders

- **My Profile screen** — as the top card summarising the viewer's own display name + avatar.
- **Connections list** — every connection row (though the connections list typically uses richer variants; the base card is fine when the row shouldn't advertise a friendship-state pill).
- **Anywhere a compact profile summary needs to invite a tap.**

The pressable variant opens the profile-preview drawer via whatever callback the parent wires up. The static variant is used when the row is already inside a drawer or sheet and shouldn't trigger another navigation.

## Pressable vs static behaviour

The component branches on `Boolean(onPress)`:

- `onPress` supplied → container is `TouchableOpacity`; chevron renders on the right.
- `onPress` omitted → container is `View`; chevron is suppressed.

That's the only branch — everything else (avatar, nickname, handle) renders identically.

## Handle rules

- The prop is the bare handle value; the component prepends `@` at display time. If the caller passes `"@ava"` it collapses to a single `@`.
- Empty handle → the handle line is suppressed and the nickname sits on its own vertically.
- Whitespace-only handle → treated as empty.

## Related

- [`ProfilePreviewHiddenCard`](../components/ProfilePreviewHiddenCard.tsx) — the "private profile" replacement rendered when the viewer's profile visibility is `Private`.
- [`ProfilePreviewBody`](../../../../components/profile-preview/ProfilePreviewBody.tsx) — the drawer body this card typically opens.
- [`isRenderableAvatarUrl`](../../../../lib/common) — the guard that rejects non-SVG avatar sources.
