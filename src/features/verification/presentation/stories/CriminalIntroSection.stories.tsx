/**
 * Stories for the criminal-intro body — phase 5 of the consolidated
 * verification flow. The user has been Approved by Persona and now sees
 * the explainer for the criminal-record search step before the form opens.
 *
 * Press the CTA in the canvas — `onStartSearch` and `onMoreInfo` fire into
 * the Actions panel. See `./CriminalIntroSection.docs.md` for context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { CriminalIntroSection } from '../components/CriminalIntroSection';

const componentNotes = `
# CriminalIntroSection

Body of the \`criminal-intro\` phase. Step 2 of 2 — explains the upcoming
criminal-record search and presents a "Start search" CTA that flips the
flow into the form section.

## Callbacks

- \`onStartSearch\` — flips the flow to \`criminal-form\`. Pure local state
  in \`useVerificationFlow\` (\`criminalIntroAcknowledged\`); no network call.
- \`onMoreInfo\` — opens the parent screen's privacy modal.
`.trim();

const meta = {
  title: 'Verification / CriminalIntroSection',
  component: CriminalIntroSection,
  args: {
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onStartSearch: () => {},
    onMoreInfo: () => {},
  },
  argTypes: {
    onStartSearch: { action: 'onStartSearch' },
    onMoreInfo: { action: 'onMoreInfo' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof CriminalIntroSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

The only state. The CTA is always enabled — there's no async work behind
"Start search," just a state transition to the form section.
    `.trim(),
  },
};
