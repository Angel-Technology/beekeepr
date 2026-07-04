# SearchBody

Pure presentation body for the Search bottom-tab. Rendered by `SearchScreen`, which owns the local `query` state (so `useSearchTab` can consume it), runs the hook, and passes every output plus a drawer-toggle callback in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│                Search             [☰]    │  ← AppHeader
├──────────────────────────────────────────┤
│  (denied?) ┌──────────────────────────┐  │
│            │ Screening denied         │  │  ← BuzzScreeningDeniedCard
│            └──────────────────────────┘  │
│                                          │
│  BUZZ BADGE COMMUNITY                    │  ← InfoSection title
│  ┌────────────────────────────────────┐  │
│  │ Search members                     │  │  ← FormCard
│  │ [🔍] @handle123, Nickname 123  [X] │  │
│  │                                    │  │
│  │ (gate copy + CTA when gated)       │  │
│  └────────────────────────────────────┘  │
│                                          │
│  SearchResultsList (query, results, …)   │
│   • ● above 3 chars → row list           │
│   • ● loading → SearchResultsSkeleton    │
│   • ● empty → "No members found"         │
│   • ● below 3 chars → nothing            │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `query` | `string` | Current input value. Owned by the screen so `useSearchTab` can consume it. |
| `onChangeQuery` | `(next: string) => void` | Fires on keystroke and on the X-clear button. |
| `isResolving` | `boolean` | Auth + RevenueCat still resolving. Renders `SearchScreenSkeleton`. |
| `isDenied` | `boolean` | Terminal denial. Renders `BuzzScreeningDeniedCard` above the input. |
| `gateState` | `'profile' \| 'member' \| null` | Which gate is active. Profile before member — a nameless user can't be discovered. |
| `isSearchDisabled` | `boolean` | `gateState !== null`. Disables the input + hides the results list. |
| `results` | `readonly SearchResultUser[]` | Rows from `useSearchUsers`. |
| `isLoading` | `boolean` | Row-level fetch in flight. |
| `cancelPendingId` | `string \| null` | ID of the row currently unsending. Shows the Unsend loader. |
| `onPressUser` | `(user) => void` | Row press. Opens the drawer preview via `useOpenProfilePreview` in prod. |
| `onUnsendInvite` | `(userId: string) => void` | Unsend button on a `REQUEST_SENT` row. |
| `onAppealDecision` | `() => void` | Denied-card "Contact Support". Wraps `openInAppBrowser` in prod. |
| `onGatePress` | `() => void` | Gate CTA press. Routes to `/profile` or `/verify-learn-more`. |
| `onOpenMenu` | `() => void` | Hamburger → toggles the right-side drawer. |

## When this renders

Reached from the bottom-tab bar under "Search". Used to discover other Buzz Badge members by nickname or handle. Gated behind a claimed profile AND an active membership — the two most common blockers, in that priority.

## Search-specific rules

- **`MIN_QUERY_LENGTH = 3`** — the results list renders nothing below three characters, and `useSearchUsers` short-circuits so we don't burn a network round-trip on a one- or two-char substring. Constant lives in `models/searchConstants.ts` alongside the hook — it's a product-side floor, not a shared platform value.
- **Handle prefix is display-only** — the input accepts `ava` or `@ava`. Whatever the user types is what the hook sees; the `@` (if any) is stripped in the row's rendering, not on send. See `feedback_handle_prefix.md`.
- **Drawer inline actions live under `search/`** — the row's Unsend button, the approved / muted badge visuals, and the drawer's Flag / Block / Invite header (fired via `PreviewSource: 'search'`) are all owned by this feature, not by `account`. See `project_search_feature.md`.

## Why it's a body, not a screen

Same reason as `VerificationLearnMoreBody`: the connected screen depends on `useNavigation` for the drawer toggle and `useSearchTab` for the GraphQL round-trip — both crash under Storybook. Splitting into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a thin adapter that owns the query `useState` (so the hook has an input) and hands everything into the body's props.

## Related

- [`useSearchTab`](../../hooks/useSearchTab.ts) — resolves state, derives `gateState`, wires row callbacks.
- [`useSearchUsers`](../../hooks/useSearchUsers.ts) — the debounced substring lookup.
- [`SearchResultsList`](../components/SearchResultsList.tsx) — the result rendering + empty / loading branches.
- [`SearchResultRow`](../components/SearchResultRow.tsx) — the per-row visual (badge + Unsend button).
- [`SearchScreenSkeleton`](../components/SearchScreenSkeleton.tsx) — pre-flow placeholder.
- [`BuzzScreeningDeniedCard`](../../../home/presentation/components/BuzzScreeningDeniedCard.tsx) — the denied banner (shared with the Buzz tab).
- [`SearchScreen`](../screens/SearchScreen.tsx) — the connected wrapper.
