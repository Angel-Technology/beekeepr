/**
 * Stories for the Explore tab body — the "dating advice" content surface
 * reached from the bottom-tab bar. Renders the actual `ExploreBody`, the
 * same component the connected `ExploreScreen` mounts in production.
 * No inline preview, no duplicated JSX: the screen is a thin wrapper that
 * loads the static `DATING_ADVICE` list and hands it to the body, so
 * storying the body is equivalent to storying the screen minus the
 * navigation hook.
 *
 * Tap the hamburger in the canvas — `onOpenMenu` fires into the Actions
 * panel. Edit the `items` fixture to preview empty, single, or long
 * lists. See `./ExploreBody.docs.md` for anatomy + usage context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { ExploreBody, type DatingAdviceItem } from '../components/ExploreBody';

const FIXTURE_ITEMS: readonly DatingAdviceItem[] = [
  {
    id: 'verify-identity',
    title: 'Verify your date’s identity',
    statistic:
      'Statistics: A study by the Online Dating Association found that verifying online dates’ identities reduces the risk of deceptive situations by 50%.',
    source:
      'Source: Online Dating Association, “Identity Verification and Online Dating,” Online Dating Association',
    advice: [
      'Before meeting anyone for the first time in-person, always search for them in the Buzz Badge community. If they’re not there, ask them to get verified by us before meeting them in-person.',
    ],
  },
  {
    id: 'public-place',
    title: 'Meet in a public place',
    statistic:
      'STATISTICS: A Pew Research Center survey found that 43% of women have experienced online harassment. Meeting in public spaces can mitigate these risks.',
    source:
      'SOURCE: Pew Research Center, “Online Harassment 2017,” Pew Research Center.',
    advice: [
      'DO NOT meet for the first time in a park or for a walk, or at a hiking trailhead... and definitely, NOT AT THEIR HOME!',
    ],
  },
  {
    id: 'share-plans',
    title: 'Share your plans with someone',
    statistic:
      'Statistics: A study by the University of Washington showed that women who inform someone about their plans are 50% less likely to experience violent incidents.',
    source:
      'Source: University of Washington, “Safety Strategies for Dating,” University of Washington',
    advice: [
      'Not only should you share your plans (date, time and location) with a couple trusted friends and/or family members, we also recommend sharing your device location with them.',
    ],
  },
];

const componentNotes = `
# ExploreBody

The Explore tab's presentation body. Renders the collapsing \`AppHeader\`
(title + menu button), the shared \`SafetyDisclaimerCard\`, and one
\`DatingAdviceCard\` per item in the \`items\` fixture.

## What the tab is for

Explore is the "read the safety guide" surface — static tiles from
\`models/datingAdvice.ts\` giving the user practical advice for meeting
someone new (verify identity, meet in public, share plans, trust
instincts, etc.). No lists, no data fetches: it's a scrolling doc.

## Interactive bits

- **Menu (top-right)** — dispatches the drawer open in production; here
  it fires \`onOpenMenu\` into the Actions panel.
- The header collapses on scroll (translate + fade) — scroll the canvas
  to see it retract.
`.trim();

const meta = {
  title: 'Explore / ExploreBody',
  component: ExploreBody,
  args: {
    items: FIXTURE_ITEMS,
    // Storybook's action addon replaces this at render time via the
    // `argTypes.action` declaration below — the stub satisfies TS.
    onOpenMenu: () => {},
  },
  argTypes: {
    onOpenMenu: { action: 'onOpenMenu' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ExploreBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

The full Explore tab as it appears in production — safety disclaimer up
top, a stack of dating-advice cards below. Scroll the canvas to watch
the header collapse.
    `.trim(),
  },
};

export const Empty: Story = {
  args: { items: [] },
  parameters: {
    notes: `
## Empty

Edge case: the advice list is empty. Only the \`SafetyDisclaimerCard\`
and the trailing spacer remain. Not a state the production app enters —
\`DATING_ADVICE\` is a hard-coded constant — but useful for spotting
layout regressions when someone edits the model file.
    `.trim(),
  },
};

export const SingleItem: Story = {
  args: { items: FIXTURE_ITEMS.slice(0, 1) },
  parameters: {
    notes: `
## Single item

Renders just the first advice tile below the disclaimer. Confirms the
\`gap-24\` spacing between the header block and a lone card still reads
correctly.
    `.trim(),
  },
};
