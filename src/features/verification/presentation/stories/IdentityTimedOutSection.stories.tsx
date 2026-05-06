/**
 * Stories for the timed-out body of the verification flow — what we show
 * when ~30s have elapsed in the waiting phase without Persona's webhook
 * landing. Soft "we'll email you" copy plus a "Back to home" CTA.
 *
 * See `./IdentityTimedOutSection.docs.md` for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { IdentityTimedOutSection } from '../components/IdentityTimedOutSection';

const componentNotes = `
# IdentityTimedOutSection

Body of the \`timed-out\` phase. The poll didn't resolve within the
threshold (15 polls × 2s ≈ 30s). We assume Persona's webhook is delayed or
dropped, surface a soft "we'll email you when it's ready" message, and let
the user bail to the home tab without losing their place — the polling
will pick back up on the next visit.

## Callbacks

- \`onGoHome\` — exits to the home route (\`/(main)\`). Parent screen wires
  this to \`router.replace\`.
`.trim();

const meta = {
  title: 'Verification / IdentityTimedOutSection',
  component: IdentityTimedOutSection,
  args: {
    // Storybook's action addon replaces this at render time via
    // `argTypes.action` below — the stub satisfies TS.
    onGoHome: () => {},
  },
  argTypes: {
    onGoHome: { action: 'onGoHome' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof IdentityTimedOutSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

The user has been on the waiting screen for ~30s. Tapping "Back to home"
fires \`onGoHome\` and exits the flow without losing progress — when they
return, the screen re-derives the phase from current status and either
resumes waiting or moves them forward.
    `.trim(),
  },
};
