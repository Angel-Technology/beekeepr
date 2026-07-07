/**
 * Stories for the "profile hidden" replacement card. Rendered in
 * `ProfileBody` in place of `ProfilePreviewCard` when the viewer has
 * toggled Share Profile off. Non-interactive on purpose — leaving it
 * static is what gates the profile-preview drawer shut.
 *
 * No props, so this is a single `Default` story. See
 * `./ProfilePreviewHiddenCard.docs.md` for the anatomy and when it
 * renders vs its pressable counterpart.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { ProfilePreviewHiddenCard } from '../components/ProfilePreviewHiddenCard';

const componentNotes = `
# ProfilePreviewHiddenCard

Static replacement for \`ProfilePreviewCard\` when the viewer's
\`profileVisibility\` is \`Private\`. Communicates two things:

1. **Why nothing opens.** The row is non-interactive, so users know the
   drawer is intentionally gated rather than broken.
2. **What to change.** The copy reads "Your profile is set to private
   and is not discoverable." — a hint to flip Share Profile back on
   in the toggle directly below it.

## No props

The card is a pure static presentation piece. All colors come from
the themed color hooks; the warning ring color is
\`themedColors.alerts.warning\` and the icon is \`AlertTriangle\` from
lucide.
`.trim();

const meta = {
  title: 'Account / ProfilePreviewHiddenCard',
  component: ProfilePreviewHiddenCard,
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ProfilePreviewHiddenCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

The only variant. Rendered inside \`ProfileBody\` whenever
\`profileVisibility === ProfileVisibility.Private\`. Flipping the
Share Profile toggle on swaps this card back to
\`ProfilePreviewCard\` in the same slot.

**When this renders:**

- User has toggled Share Profile off in the My Profile screen.
- User's account was created with the default privacy preference set
  to Private.

**When it doesn't render:**

- \`profileVisibility === ProfileVisibility.Public\` — the pressable
  \`ProfilePreviewCard\` takes this slot instead.
    `.trim(),
  },
};
