# SettingsBody

Pure presentation body for the Settings screen. Rendered by `SettingsScreen`, which owns the router and passes navigation callbacks in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│ [<]         Settings                     │  ← AppHeader
├──────────────────────────────────────────┤
│                                          │
│  THEME                                   │
│  Choose how the app looks. System        │
│  follows your device's appearance.       │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │  [ 📱  ]  [ ☀ ]  [ 🌙 ]          │  │  ← ThemeMenuRow (segmented pill)
│  └────────────────────────────────────┘  │
│                                          │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `onGoBack` | `() => void` | Tapping the header back button. Parent calls `router.back()`. |

## When this renders

Reached from the account/menu drawer's "Settings" entry. This is the app-level configuration surface — not the account (subscription / email) surface. The theme picker was moved out of the drawer to live here so the drawer stays focused on navigation entry points, not settings.

## Why theme preference isn't a prop

`ThemeMenuRow` reads and writes through `useThemePreferenceContext`, which is a pure theming primitive (part of `@common`, not a feature hook). It behaves the same in production and in Storybook — no feature-hook mocking required — so it stays inside the body rather than being hoisted to the screen wrapper. The only concern for the wrapper is the header back button.

## Why it's a body, not a screen

The connected screen depends on `useRouter`, which crashes under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a two-line adapter.

## Related

- [`SettingsScreen`](../screens/SettingsScreen.tsx) — the connected wrapper.
- [`ThemeMenuRow`](../components/ThemeMenuRow.tsx) — segmented pill picker with animated indicator.
- `useThemePreferenceContext` (in `@common`) — the theming primitive the picker writes through.
