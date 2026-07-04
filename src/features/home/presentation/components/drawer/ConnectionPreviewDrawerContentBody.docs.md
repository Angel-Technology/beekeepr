# ConnectionPreviewDrawerContentBody

Pure presentation body for the right-side connection-preview drawer. Rendered by `ConnectionPreviewDrawerContent`, which runs the seven friendship-mutation hooks + `useConfirmDestructive` and passes a callback bundle in.

Used by BOTH the home Buzz tab (Connections / Invites / Blocked lists) AND the Search tab (search-result rows). Same body, different header per `source` × `friendshipState`.

## Anatomy

```text
┌──────────────────────────────────────────────┐
│  ◀   [ source-dependent action row ]    ⋮   │  ← AppHeader
│                                              │     (back chevron, action, kebab)
├──────────────────────────────────────────────┤
│                                              │
│  ┌──┐  Ava Palmer                            │
│  │🙂│  @ava                                  │  ← ProfilePreviewBody
│  └──┘  member since: Nov 1, 2025             │     (avatar + name block)
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  🐝  Buzz Badge                        │  │
│  │     (status updated every 6 months)    │  │
│  │  Last screened   Feb 15, 2026          │  │
│  │  Next screening  Aug 15, 2026          │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  CONTACT INFORMATION                         │
│  ┌────────────────────────────────────────┐  │
│  │  📞 Phone Number         (555) 123-… │  │
│  │  💬 WhatsApp             (555) 123-… │  │
│  │  📷 Instagram             @ava.palmer  │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  ⚠️  Safety disclaimer                        │
└──────────────────────────────────────────────┘

                            ┌──────────────────┐
                            │ 🚫 Block          │  ← ProfileActionsMenu
                            │ 🚩 Flag           │     (kebab dropdown, absolute)
                            └──────────────────┘
```

The **action row** in the header swaps based on `source` (and, when `source === 'search'`, on `friendshipState`):

| `source`      | `friendshipState`       | Action row rendered |
| ------------- | ----------------------- | -------------------- |
| `connection`  | any                     | `[Remove]` (outline, trash icon) |
| `invite`      | any                     | `[Decline] [Approve]` (outline + solid) |
| `sent-invite` | any                     | `[Unsend]` (outline, X icon) |
| `blocked`     | any                     | `[Unblock]` (outline) |
| `search`      | `REQUEST_SENT`          | `[Unsend]` (outline, X icon) |
| `search`      | `NONE` / other          | `[Send Invite]` (solid, send icon) |
| `null` / other| any                     | `[Remove]` (fallback — same as `connection`) |

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `user` | `ProfilePreviewUser` | Memoized preview subset shared with `ProfilePreviewBody`. Codegen fragments for both `UserConnectionDto` and `UserGraph` satisfy this shape as-is. |
| `source` | `PreviewSource \| null` | Which list the row came from. Drives the header action layout. |
| `friendshipState` | `PreviewFriendshipState \| null` | Viewer's friendship with `user`. Only pivots behavior on `source === 'search'`. |
| `onClose` | `() => void` | Back chevron tap. Wrapper calls `navigation.closeDrawer()`. |
| `onRemove` | `() => void` | Remove-friend from the `connection` header. Wrapper wraps in `useConfirmDestructive`. |
| `onAccept` | `() => void` | Approve an incoming invite (from the `invite` header). |
| `onDecline` | `() => void` | Decline an incoming invite (from the `invite` header). |
| `onUnsend` | `() => void` | Cancel an outgoing invite (from `sent-invite` or search `REQUEST_SENT`). |
| `onUnblock` | `() => void` | Unblock from the `blocked` header. |
| `onSendInvite` | `() => void` | Send an invite from the search `NONE` header. |
| `onBlock` | `() => void` | Block from the kebab menu. Wrapper wraps in `useConfirmDestructive`. |
| `onFlag` | `() => void` | Flag from the kebab menu. Wrapper wraps in `useConfirmDestructive`. |

## When this renders

The right-side drawer content when the user taps a row that calls `setDrawerPreview(user, source, friendshipState)`. Two entry points today:

1. **Home Buzz tab** — Connections / Invites / Blocked lists inside `BuzzConnectionsCard`. Row press sets `source` to one of `connection` / `invite` / `sent-invite` / `blocked`.
2. **Search tab** — `SearchResultsList` row press sets `source: 'search'` and forwards the row's `viewerFriendshipState` as `friendshipState`.

The drawer itself is opened by `DrawerContentSwitcher`, which reads `previewUser` from `drawerPreviewStore` and mounts this component when it's non-null.

## The `source` × `friendshipState` matrix

`source` alone is enough to pick the header for four of the five values. `search` is the odd one — the row can represent any friendship stage (no relationship, invite pending both directions, already friends), so the header pivots on `friendshipState` too. The store's `PreviewFriendshipState` mirrors the backend `ViewerFriendshipState` enum verbatim (`FRIENDS` / `NONE` / `REQUEST_RECEIVED` / `REQUEST_SENT`) — spelled out inline in `drawerPreviewStore.ts` to avoid pulling a feature's `*.generated` enum into a cross-feature store.

For the home sources (`connection` / `invite` / `sent-invite` / `blocked`), `friendshipState` is redundant — it's `FRIENDS` for `connection`, `REQUEST_RECEIVED` for `invite`, etc. — but the store still carries it so a future consolidation could collapse the sources into a single `friendshipState`-driven header.

## Local UI state

The body owns three pieces of local UI state:

- **Actions-menu visibility** — a `useState<boolean>` for the kebab dropdown. Toggled by the kebab icon; closed by:
  - The outside-tap `Pressable` overlay that starts below the header.
  - The scroll gesture on the body's `ScrollView` (via `onScrollBeginDrag`).
  - Tapping a menu item — the body closes the menu before delegating to `onBlock` / `onFlag`.
- **Destructive-confirm sheets** — NOT owned here. The connected wrapper's `useConfirmDestructive` returns a Promise that resolves to `true` / `false`; the body just fires the callback and the wrapper awaits.

All feature hooks (`useBlockUser`, `useCancelInvite`, `useFlagUser`, `useRemoveFriend`, `useRespondToInvite`, `useSendInvite`, `useUnblockUser`, `useConfirmDestructive`) live in the wrapper. The body has no knowledge of TanStack Query, GraphQL, or navigation — Storybook renders it with plain stubs.

## Why it's a body, not a screen

Same reason as `BuzzBody` and `VerificationLearnMoreBody`: the connected version depends on GraphQL mutations and a React Navigation drawer prop that Storybook can't satisfy. Splitting the drawer into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The wrapper is a ~40-line adapter that runs the mutation hooks + confirm modal and forwards a flat callback bundle.

## Related

- [`DrawerContentSwitcher`](./DrawerContentSwitcher.tsx) — the parent that reads `drawerPreviewStore` and mounts this drawer when a row is tapped.
- [`ProfilePreviewBody`](../../../../../components/profile-preview/ProfilePreviewBody.tsx) — the shared body rendered below the header.
- [`ProfileActionsMenu`](./ProfileActionsMenu.tsx) — the kebab dropdown (Block + Flag).
- [`ConnectionPreviewDrawerContent`](./ConnectionPreviewDrawerContent.tsx) — the connected wrapper.
- [`drawerPreviewStore`](../../../state/drawerPreviewStore.ts) — Zustand store owning `previewUser` / `previewSource` / `previewFriendshipState`.
- [`useSendInvite`](../../../hooks/useSendInvite.ts) / [`useBlockUser`](../../../hooks/useBlockUser.ts) / [`useCancelInvite`](../../../hooks/useCancelInvite.ts) / [`useFlagUser`](../../../hooks/useFlagUser.ts) / [`useRemoveFriend`](../../../hooks/useRemoveFriend.ts) / [`useRespondToInvite`](../../../hooks/useRespondToInvite.ts) / [`useUnblockUser`](../../../hooks/useUnblockUser.ts) — the mutation hooks the wrapper runs.
- [`useConfirmDestructive`](../../../../../components/ui/modal/ConfirmDestructiveProvider.tsx) — the confirm-then-fire helper the wrapper uses for Block / Flag / Remove.
