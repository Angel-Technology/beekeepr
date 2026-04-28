/**
 * Stories for the shared `<Button />` primitive.
 *
 * Covers: solid + outline variants, every size, loading + disabled states.
 * Press the button in the canvas — `onPress` fires into the Actions panel.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { Button } from './Button';

const meta = {
  title: 'UI / Button',
  component: Button,
  args: {
    label: 'Continue',
    variant: 'solid',
    size: 'lg',
    disabled: false,
    loading: false,
  },
  argTypes: {
    label: { control: { type: 'text' } },
    variant: {
      control: { type: 'radio' },
      options: ['solid', 'outline'],
    },
    size: {
      control: { type: 'radio' },
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
    },
    disabled: { control: { type: 'boolean' } },
    loading: { control: { type: 'boolean' } },
    onPress: { action: 'onPress' },
  },
  parameters: {
    notes:
      'The shared Button. Supports `solid` and `outline` variants and six sizes. ' +
      'Disabled and loading states are mutually exclusive in practice (loading implies disabled).',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Default solid variant. The brand-honey background; primary CTA.
 */
export const Solid: Story = {
  parameters: { notes: 'Primary call-to-action style. Use for the dominant action on a screen.' },
};

/**
 * Outline variant for secondary actions ("Go back", "Cancel").
 */
export const Outline: Story = {
  args: { variant: 'outline', label: 'Go back' },
  parameters: { notes: 'Secondary action. Pair next to a `Solid` Button on a row.' },
};

/**
 * Loading state. Replaces the label with a `BounceLoader` and disables presses.
 */
export const Loading: Story = {
  args: { loading: true },
  parameters: { notes: 'Use while an async action is in flight. Disables presses automatically.' },
};

/**
 * Explicitly disabled — distinct from loading. No spinner.
 */
export const Disabled: Story = {
  args: { disabled: true },
  parameters: { notes: 'Reserved for blocked-by-validation states (e.g., form not yet valid).' },
};
