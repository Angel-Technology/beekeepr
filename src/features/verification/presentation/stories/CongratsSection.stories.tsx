/**
 * Stories for the celebration body of the verification flow — shown once
 * the user has cleared every prior step (screening, identity, submission)
 * and the backend has flipped them into the `congrats` phase. From here
 * the user either starts the 30-day free trial or enters a promo code.
 *
 * See `./CongratsSection.docs.md` for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { CongratsSection } from '../sections/CongratsSection';

const componentNotes = `
# CongratsSection

Body of the \`congrats\` phase. The user has finished all verification
steps and is choosing how to proceed — start the 30-day free trial or
redeem a promo code.

## When to use

Render this section when the parent flow's \`phase === 'congrats'\`. The
"Start 30-day free trial" CTA triggers \`useTrialPurchase\`; the outline
"Enter promo code" CTA opens the promo code entry surface backed by
\`useRedeemPromoCode\`.

## States

- \`isStartingTrial === false\` (default) — both CTAs are enabled.
- \`isStartingTrial === true\` — trial purchase is in flight; the primary
  button shows the bounce loader and the outline button is disabled to
  prevent racing the trial mutation with a promo redemption.

## Callbacks

- \`onStartTrial\` — kicks off \`useTrialPurchase.startTrial.mutateAsync()\`.
- \`onEnterPromoCode\` — opens the promo code entry surface.
`.trim();

const meta = {
  title: 'Verification / CongratsSection',
  component: CongratsSection,
  args: {
    isStartingTrial: false,
    // Storybook's action addon replaces these at render time via
    // `argTypes.action` below — the stubs satisfy TS.
    onStartTrial: () => {},
    onEnterPromoCode: () => {},
  },
  argTypes: {
    isStartingTrial: { control: { type: 'boolean' } },
    onStartTrial: { action: 'onStartTrial' },
    onEnterPromoCode: { action: 'onEnterPromoCode' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof CongratsSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Idle congrats state. Both CTAs are enabled — the user can either start
the 30-day free trial or enter a promo code.

**When this is what you see:** the parent flow's \`phase === 'congrats'\`
and no trial mutation is in flight.
    `.trim(),
  },
};

export const StartingTrial: Story = {
  args: { isStartingTrial: true },
  parameters: {
    notes: `
## StartingTrial

The user tapped "Start 30-day free trial" and we're awaiting the trial
purchase mutation. The primary button shows the bounce loader and the
outline "Enter promo code" button is disabled to keep the two paths from
racing.
    `.trim(),
  },
};
