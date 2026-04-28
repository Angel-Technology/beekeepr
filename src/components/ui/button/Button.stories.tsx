/**
 * Stories for the shared `<Button />` primitive.
 *
 * Covers: solid + outline variants, every size, loading + disabled states.
 * Press the button in the canvas — `onPress` fires into the Actions panel.
 *
 * The `Notes` tab (📝 in the addons toolbar) shows a markdown summary of each
 * scenario. See `./Button.docs.md` for the full component flow and usage guide.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './Button';

const componentNotes = `
# Button

The shared CTA primitive. Renders a \`TouchableOpacity\` with a centered \`<Text>\`
label, optionally swapping the label for a \`<BounceLoader />\` while loading.

## Variants

- **\`solid\`** — brand-honey background, dark label. Primary CTA.
- **\`outline\`** — bg-default with a neutral border, secondary text. Pair next
  to a solid Button on a row.

## Sizes

\`xs\` · \`sm\` · \`md\` · \`lg\` (default) · \`xl\` · \`2xl\`. Each maps to a fixed
padding + text scale; \`xl\` and \`2xl\` have explicit min-heights for hero CTAs.

## States

- \`disabled\` — reduced opacity, presses blocked.
- \`loading\` — implies disabled, replaces label with the bounce loader.
- These are *mutually exclusive*; don't set both.

For icon variants, use \`<Button />\`. For circular icon-only targets,
use \`<IconButton />\`.
`.trim();

const meta = {
  title: 'UI / Button',
  component: Button,
  args: {
    label: 'Continue',
    variant: 'solid',
    disabled: false,
    loading: false,
  },
  argTypes: {
    label: { control: { type: 'text' } },
    variant: {
      control: { type: 'radio' },
      options: ['solid', 'outline'],
    },
    disabled: { control: { type: 'boolean' } },
    loading: { control: { type: 'boolean' } },
    onPress: { action: 'onPress' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  parameters: {
    notes: `
## Solid (default)

Brand-honey background, dark label. The dominant CTA on a screen.

**When to use:** "Continue", "Save", "Submit" — the action you want the user to take.

**When not to use:** any secondary or tertiary action — those should be \`outline\` or a plain text link.
    `.trim(),
  },
};

export const Outline: Story = {
  args: { variant: 'outline', label: 'Go back' },
  parameters: {
    notes: `
## Outline

Bg-default surface, neutral border, secondary text colour. Lower visual weight than \`solid\`.

**When to use:** "Go back", "Cancel", "Skip" — paired next to a solid CTA on a row.

**Tip:** if you need full-strength label colour, pass \`textClassName="text-text-default"\`.
    `.trim(),
  },
};

export const Loading: Story = {
  args: { loading: true },
  parameters: {
    notes: `
## Loading

Replaces the label with \`<BounceLoader />\` and disables presses automatically.

**When to use:** while an async action is in flight (form submit, mutation, file upload).

**Watch out:** \`loading\` already implies \`disabled\` — don't set both. \`onPress\` is a no-op while loading.
    `.trim(),
  },
};

export const Disabled: Story = {
  args: { disabled: true },
  parameters: {
    notes: `
## Disabled

Reduced opacity, presses blocked. Distinct from \`loading\` — no spinner.

**When to use:** the action is *unavailable* right now (form not yet valid, missing permission, idle state).

**When not to use:** while waiting on an async action — that's \`loading\`.
    `.trim(),
  },
};
