# ExploreBody

Pure presentation body for the Explore bottom-tab. Rendered by `ExploreScreen`, which owns the drawer-navigation side effect and feeds the static `DATING_ADVICE` list into the body.

## Anatomy

```text
┌──────────────────────────────────────────┐
│                Explore            [☰]    │  ← collapsing AppHeader
├──────────────────────────────────────────┤
│  ┌────────────────────────────────────┐  │
│  │  Safety is not a guarantee!        │  │  ← SafetyDisclaimerCard
│  └────────────────────────────────────┘  │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Verify your date’s identity        │  │
│  │ Statistics: …                      │  │  ← DatingAdviceCard #1
│  │ Source: …                          │  │
│  │ ─────────                          │  │
│  │ 🐝 Before meeting anyone…          │  │
│  └────────────────────────────────────┘  │
│  ┌────────────────────────────────────┐  │
│  │ Meet in a public place             │  │  ← DatingAdviceCard #2
│  │ …                                  │  │
│  └────────────────────────────────────┘  │
│                    ⋮                     │  ← more advice cards
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `items` | `readonly DatingAdviceItem[]` | Ordered list of advice tiles. In production this is the static `DATING_ADVICE` constant from `models/datingAdvice.ts`. Order matches the Figma. |
| `onOpenMenu` | `() => void` | Tapping the hamburger in the top-right. Parent dispatches `DrawerActions.toggleDrawer()`. |

Each `DatingAdviceItem` shape:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | `string` | Stable list key. |
| `title` | `string` | Card headline. |
| `statistic` | `string` | Long-form quote / stat above the divider. |
| `source` | `string` | Attribution line. |
| `advice` | `readonly string[]` | One-or-more paragraphs shown after the divider under the Buzz Badge crest. |

## When this renders

Reached from the bottom-tab bar under the "Explore" tab. It's the "read the safety guide" surface — a static, scrollable list of tips for meeting someone new (verify identity, meet in public, share plans, trust instincts, etc.). No lists, no data fetches: the content lives entirely in `models/datingAdvice.ts`. Users land here between browsing Buzz and running a search when they want the "how to date safely" primer.

## Why it's a body, not a screen

Same reason as `VerificationLearnMoreBody`: the connected screen depends on `useNavigation` for the drawer toggle, which crashes under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a five-line adapter that passes the static advice list plus a drawer-toggle callback.

## Related

- [`DATING_ADVICE`](../../models/datingAdvice.ts) — the static content shown in production.
- [`DatingAdviceCard`](../components/DatingAdviceCard.tsx) — the single-tile visual.
- [`SafetyDisclaimerCard`](../../../../components/ui/card/SafetyDisclaimerCard.tsx) — the top-of-page disclaimer.
- [`ExploreScreen`](../screens/ExploreScreen.tsx) — the connected wrapper.
