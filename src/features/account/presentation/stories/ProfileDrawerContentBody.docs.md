# ProfileDrawerContentBody

Pure presentation body for the right-side drawer that shows the signed-in user's own profile preview. Rendered by `ProfileDrawerContent`, which owns the connection to `useAuthSession`, memoizes the `ProfilePreviewUser` reshape, and passes it in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│              Preview                     │  ← AppHeader (top inset)
├──────────────────────────────────────────┤
│    This is how others see you.           │  ← green banner
├──────────────────────────────────────────┤
│  ┌────┐  Ada                             │
│  │ 🙂 │  @ada                            │
│  └────┘  member since: Nov 2025          │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  🐝  Buzz Badge                    │  │
│  │  (status updated every 6 months)   │  │
│  │  ── Last screened     Jun 2026 ──  │  │
│  │  ── Next screening    Dec 2026 ──  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  CONTACT INFORMATION                     │
│  ┌────────────────────────────────────┐  │
│  │  📞 Phone number     (555) 123-... │  │
│  │  💬 WhatsApp         (555) 123-... │  │
│  │  📷 Instagram        @ada.codes    │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  ⚠️  Safety disclaimer             │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `previewUser` | `ProfilePreviewUser \| null` | Memoized preview shape derived from `useAuthSession`. `null` when the auth query hasn't resolved yet — the header + banner still render, the profile card below is suppressed. |

## When this renders

The drawer opens from the "Preview my profile" affordance on the account tab (right-drawer navigator). The user sees their own profile exactly as another member would in the connection preview drawer, plus the green "This is how others see you." banner so it's clear which context they're looking at. Closing the drawer returns to whichever screen opened it.

## Why the `createdAtUtc` → `userCreatedAtUtc` reshape lives in the wrapper

`useAuthSession` returns the auth user with a `createdAtUtc` field (the shape codegen produces for the `currentUser` query). Every other consumer of `ProfilePreviewBody` — connection rows, search results — carries the same date under `userCreatedAtUtc`, because that's the field name on the connection / search list fragments. Rather than teaching the shared preview body about two field names, the connected wrapper does a one-line reshape and hands the body a uniform shape.

## Why it's a body, not a full drawer content

Same reason as the verification bodies: the connected wrapper depends on `useAuthSession`, which requires a TanStack `QueryProvider` and a signed-in session — neither is available under Storybook. Splitting the connected drawer content into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The wrapper is a ~15-line adapter that reads the query and maps the field name.

## Related

- [`ProfileDrawerContent`](../components/ProfileDrawerContent.tsx) — the connected wrapper this body lives under.
- [`ProfilePreviewBody`](../../../../components/profile-preview/ProfilePreviewBody.tsx) — the shared body reused across own-profile / connection-preview / search-preview drawers.
- [`ProfilePreviewUser`](../../../../components/profile-preview/types.ts) — the shared preview-friendly shape.
- [`ConnectionPreviewDrawerContent`](../../../home/presentation/components/drawer/ConnectionPreviewDrawerContent.tsx) — the sibling drawer for viewing another member's profile.
