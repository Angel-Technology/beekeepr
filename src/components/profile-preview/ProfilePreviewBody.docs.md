# ProfilePreviewBody

Shared body every profile-preview drawer mounts inline. Owns everything below the drawer header: avatar + nickname + handle row, Buzz Badge summary card, optional contact-information card, and safety disclaimer. Header and per-source actions (Flag / Block / Invite / kebab) stay in the drawer consumer because they differ per variant.

## Anatomy

```text
┌────────────────────────────────────────────┐
│  ⭘  Ava                                    │
│     @ava                                   │
│     member since: Jun 1, 2025              │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │ 🐝  Buzz Badge                    ⓘ  │  │
│  │     (status updated every 6 months)  │  │
│  │  ┌────────────────────────────────┐  │  │
│  │  │ Last screened     Jan 1, 2026  │  │  │
│  │  │ Next screening    Jul 1, 2026  │  │  │
│  │  └────────────────────────────────┘  │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  CONTACT INFORMATION                       │
│  ┌──────────────────────────────────────┐  │
│  │ 📞  Phone Number     (555) 123-4567  │  │
│  │ 💬  WhatsApp         (555) 111-2222  │  │
│  │ 📸  Instagram        @ava            │  │
│  │ ✈️  Telegram         @ava_tg         │  │
│  │ ✳️  Signal        [ Profile link ]   │  │
│  └──────────────────────────────────────┘  │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  ⚠  Safety disclaimer                │  │
│  └──────────────────────────────────────┘  │
└────────────────────────────────────────────┘
```

## Props

| Prop                | Type                     | Notes                                                                                                                                                                        |
| ------------------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `user`              | `ProfilePreviewUser`     | Preview-friendly subset that every drawer source can satisfy. Both `UserConnectionDto` and `UserGraph` are structurally assignable — no adapter required at the call site.  |
| `onScrollBeginDrag` | `() => void` (optional)  | Fires on the inner `ScrollView`'s first drag. Connection preview wires this to its actions-menu close so scrolling the body also dismisses the kebab dropdown.               |

### `ProfilePreviewUser` shape (excerpt)

| Field                              | Purpose                                                                          |
| ---------------------------------- | -------------------------------------------------------------------------------- |
| `nickname`, `handle`               | Header row — display name and `@handle`. Handle is display-only (`@` prepended). |
| `imageUrl`                         | SVG avatar. Non-SVG URLs (Google `picture`) are rejected by `isRenderableAvatarUrl` and fall back to `UserRound`. |
| `backgroundCheckBadge`             | Drives the Buzz Badge card. `Approved` / `None` / `Denied`.                       |
| `backgroundCheckBadgeExpiresAtUtc` | "Next screening" date. Rendered as an em-dash if null.                            |
| `checkrLastCheckAtUtc`             | "Last screened" date. Rendered as an em-dash if null.                             |
| `userCreatedAtUtc`                 | "member since:" label under the handle.                                           |
| `profileVisibility`                | `Public` / `Private`. Body renders regardless — gating happens upstream.          |
| `contactVisibility`                | `ConnectionsOnly` / `Private`. When `Private`, the contact card is suppressed even if fields are populated. |
| `phoneNumber`, `googleVoicePhone`, `whatsAppPhone`, `instagramHandle`, `telegramHandle`, `signalPhone` | Contact rows. Only rendered when non-empty. |

## When this renders

Whenever a drawer previews a profile:

- **Own profile** — the viewer opens the profile drawer from the account menu.
- **Connection preview** — the viewer taps a connection row from the connections list.
- **Search preview** — the viewer taps a row inside the search tab.

The drawer consumer supplies the correct `ProfilePreviewUser` (currentUser payload for self, `UserConnectionDto` for a friend, `UserGraph` for a search hit) plus its own header and action buttons above this body.

## Contact card gating rule

The Contact Information card only renders when **both** conditions hold:

1. `contactVisibility === ContactVisibility.ConnectionsOnly`, and
2. At least one of the six contact fields on the user is non-empty.

That's why the `PrivateProfile` story still shows the badge card and disclaimer but suppresses the contact card even with populated fields — the visibility flag is the master switch.

## Signal is a "Profile link" pill, not text

Signal handles are opaque profile URLs (`https://signal.me/#p/+…`), not typeable identifiers. Per Figma, the Signal row renders a pill-shaped button labelled "Profile link" instead of the raw URL. Every other channel renders the display value inline.

## Why the header lives in the consumer

Each drawer variant has a different action set:

- Own profile: no actions row, just a title.
- Connection preview: kebab menu with Unfriend / Block, plus a Flag button.
- Search preview: Flag / Block / Invite tri-action row driven by `PreviewSource: 'search'`.

Hoisting the header out of the body means each drawer owns the actions surface it needs, and the body stays a single reusable component.

## Related

- [`ProfileDrawerContent`](../../features/account/presentation/components/ProfileDrawerContent.tsx) — own-profile drawer.
- [`ProfilePreviewCard`](../../features/account/presentation/components/ProfilePreviewCard.tsx) — the small tappable row that opens the drawer.
- [`ProfilePreviewHiddenCard`](../../features/account/presentation/components/ProfilePreviewHiddenCard.tsx) — the "private profile" replacement for the card.
- [`ProfilePreviewUser`](./types.ts) — the preview-friendly shape both `UserConnectionDto` and `UserGraph` satisfy.
- [`SafetyDisclaimerCard`](../ui/card/SafetyDisclaimerCard.tsx) — the static footer card.
