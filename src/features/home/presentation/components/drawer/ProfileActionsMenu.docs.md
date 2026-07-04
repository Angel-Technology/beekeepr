# ProfileActionsMenu

Pure inline dropdown anchored under the kebab in the connection-preview drawer header. Owns nothing beyond its own render — dismissal, positioning of the anchor, and the confirm-dialog flow around each action all live in the parent (`ConnectionPreviewDrawerContent`).

## Anatomy

```text
                        ┌──────────────┐
                        │  🚫  Block   │
                        │  🚩  Flag    │
                        └──────────────┘
                              ↑
                    absolute: top-right,
                    below the app header
```

The menu is 115px wide, rounded, elevated with a shadow (`shadowOpacity 0.2`, `elevation 8`), and positioned via:

```text
top   = insets.top + APP_HEADER_HEIGHT + MENU_GAP   (56 + 4)
right = 16
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `visible` | `boolean` | `false` short-circuits to a `null` render — nothing appears at all. `true` renders the dropdown. |
| `onBlock` | `() => void` | Fired when the user taps **Block**. Parent wraps this in a confirm dialog before running the block mutation. |
| `onFlag` | `() => void` | Fired when the user taps **Flag**. Parent wraps this in a confirm dialog before running the flag mutation. |

## Dismissal (owned by the parent)

Dismissal is **not** handled by this component. `ConnectionPreviewDrawerContent` closes the menu via two mechanisms wired up above and behind it:

1. **Full-screen `Pressable` overlay** rendered below the menu (last-rendered-wins z order puts the menu on top). The overlay starts at `top = insets.top + APP_HEADER_HEIGHT` — this leaves the kebab tappable so a second tap on the kebab toggles the menu off through its own `onPress`, rather than through the overlay swallowing the touch. The overlay uses `onPress` to close on touch END anywhere outside the menu.
2. **`onScrollBeginDrag` on the profile body's ScrollView** — the parent forwards a close handler into `ProfilePreviewBody`, so starting to scroll the profile card also closes the menu.

The menu items themselves use `onPress` (not `onPressIn`) so a drag-cancel away from an item before press-end doesn't fire the action — an important detail when the overlay is racing to close on the same touch.

## Why it's already pure

`ProfileActionsMenu` reads only `useSafeAreaInsets` and `useThemedColor` — both pure helpers, no auth / query / router dependencies. No extraction step is needed: the story imports the component directly and toggles `visible` from the controls panel.

## Related

- [`ConnectionPreviewDrawerContent`](./ConnectionPreviewDrawerContent.tsx) — the parent that owns `isActionsMenuOpen` state, wires up the touch-capture overlay + the scroll-close handler, and runs the confirm dialogs around `onBlock` / `onFlag`.
- [`ProfilePreviewBody`](../../../../../components/profile-preview/ProfilePreviewBody.tsx) — accepts the parent's `onScrollBeginDrag` handler so scrolling the profile card also closes this menu.
