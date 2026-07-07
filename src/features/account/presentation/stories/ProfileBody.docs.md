# ProfileBody

Pure presentation body for the My Profile screen. Rendered by `ProfileScreen`, which owns the connection to `useAuthSession`, `useProfileForm`, `useContactForm`, and the router / drawer navigation.

## Anatomy

```text
┌──────────────────────────────────────────┐
│ [<]        My Profile                    │  ← AppHeader
├──────────────────────────────────────────┤
│                                          │
│  PREVIEW                                 │
│  ┌────────────────────────────────────┐  │
│  │ [avatar]  Jane  @jane          >  │  │  ← ProfilePreviewCard or
│  └────────────────────────────────────┘  │      ProfilePreviewHiddenCard
│                                          │
│  PROFILE                                 │
│  Customize your name and handle…         │
│  ┌────────────────────────────────────┐  │
│  │  Select Avatar          ✓    >    │  │
│  │  Nickname [………]              ✓    │  │
│  │  Handle   [@…………]             ✓    │  │
│  │  handle rules helper text          │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │  PRIVACY SETTINGS            │  │  │
│  │  │  Share Profile   [PUBLIC]  ⚫ │  │  │
│  │  └──────────────────────────────┘  │  │
│  └────────────────────────────────────┘  │
│                                          │
│  ┌ TipCard: What are we missing? ──────┐│
│  └────────────────────────────────────  ┘│
│                                          │
│  CONTACT INFORMATION                     │
│  This is not required…                   │
│  ┌────────────────────────────────────┐  │
│  │  Phone [………]                      │  │
│  │  [gv]  Google Voice [………]         │  │
│  │  [wa]  WhatsApp [………]             │  │
│  │  [ig@] Instagram [………]            │  │
│  │  [tg@] Telegram [………]             │  │
│  │  [sg]  Signal (link) [………]        │  │
│  │  footer prompt → support email     │  │
│  │  ┌──────────────────────────────┐  │  │
│  │  │  PRIVACY SETTINGS            │  │  │
│  │  │  Share with connections    ⚫ │  │  │
│  │  │  (disabled if all empty)     │  │  │
│  │  └──────────────────────────────┘  │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘

              ┌──────────────────────┐
              │ Avatar Picker Sheet  │  ← AvatarPickerSheet
              │  [preview] [grid]    │      (local open flag)
              │  [Shuffle] [Save]    │
              └──────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `profileForm` | `ProfileFormBinding` | Bundle of `values`, `fieldStatus`, `setField`, `submitField` from `useProfileForm`. Boxed as one prop so the surface stays scannable. |
| `contactForm` | `ContactFormBinding` | Bundle of `values`, `fieldStatus`, `fieldError`, `setField`, `submitField` from `useContactForm`. Mirrors `profileForm`. |
| `imageUrl` | `string \| null` | Current avatar URL. Threaded into the preview card and the picker's starting selection. |
| `profileShared` | `boolean` | `true` when `profileVisibility === Public`. Controls preview card vs hidden placeholder + the toggle value. |
| `connectionsOn` | `boolean` | `true` when `contactVisibility === ConnectionsOnly`. Seeds the connections-only switch. |
| `onGoBack` | `() => void` | Header back button. Parent calls `router.back()`. |
| `onOpenProfileDrawer` | `() => void` | Preview-card tap. Parent dispatches `DrawerActions.openDrawer()`. |
| `onSelectAvatar` | `(avatarUrl: string) => void` | Picker sheet returned a choice. Parent calls `useProfileForm.setImageUrl`. |
| `onProfileSharedChange` | `(next: boolean) => void` | Share Profile switch. Parent maps to `ProfileVisibility.Public` / `Private`. |
| `onConnectionsChange` | `(next: boolean) => void` | Share-with-connections switch. Parent maps to `ContactVisibility.ConnectionsOnly` / `Private`. |

## When this renders

Reached from the account/menu drawer's "My Profile" entry. This is where users tweak their public identity (nickname, handle, avatar) and their contact-sharing surface (six brand-channel inputs + a connections-only switch). Both sections write on blur — the hooks diff the current value against the saved baseline and only fire the mutation when it changed, so accidental focus-then-blur can't wipe stored values.

## Local state hoisted into the body

The avatar-picker sheet's open/closed flag is local UI toggling with no side effects, so it lives in the body (like `DeleteAccountBody`'s confirm-modal flag). The picker's `onSelect` closes the sheet automatically after firing `onSelectAvatar` — the wrapper doesn't need to know the sheet exists.

## Why the form hooks are passed as bundles

The two form hooks each return 4–5 values that all belong together. Passing them as objects (`profileForm.values`, `profileForm.setField(...)`) rather than 10+ top-level props keeps the body's signature scannable and makes the boundary between the two hooks obvious in the JSX. It also mirrors the shape returned by the hooks so the wrapper's mapping is trivial (`{ values, setField, submitField, fieldStatus }`).

## Why it's a body, not a screen

The connected screen depends on `useRouter`, `useNavigation`, `useAuthSession`, `useMutation`, and TanStack Query cache reads. Splitting into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks.

## Related

- [`ProfileScreen`](../screens/ProfileScreen.tsx) — the connected wrapper.
- [`useProfileForm`](../../hooks/useProfileForm.ts) — nickname/handle/avatar/visibility state + mutations.
- [`useContactForm`](../../hooks/useContactForm.ts) — six contact-channel field state + mutations.
- [`AvatarPickerSheet`](../components/AvatarPickerSheet.tsx) — the DiceBear picker rendered inside the body.
- [`ProfilePreviewCard`](../components/ProfilePreviewCard.tsx) / [`ProfilePreviewHiddenCard`](../components/ProfilePreviewHiddenCard.tsx) — the two preview states.
- [`PrivacyOptionRow`](../components/PrivacyOptionRow.tsx) — the reusable badge + copy + switch row.
