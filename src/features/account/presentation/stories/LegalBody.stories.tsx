/**
 * Stories for the Legal hub body. Renders the actual `LegalBody` — the
 * same component the connected `LegalScreen` mounts in production. No
 * inline preview: the screen is a thin connected wrapper that reads
 * URLs from `environmentConfig` and calls `openInAppBrowser`, so
 * storying the body is equivalent to storying the screen minus the
 * router hook and the browser side effect.
 *
 * Tap any legal row in the canvas — `onOpenPrivacyPolicy`,
 * `onOpenTermsOfUse`, or `onOpenChildSafetyPolicy` fire into the
 * Actions panel. See `./LegalBody.docs.md` for the full anatomy.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { LegalBody } from '../components/LegalBody';

const componentNotes = `
# LegalBody

Reached from the account/menu drawer. Renders a single \`MenuSection\`
with three rows: Privacy Policy, Terms of Use, and Child Safety Policy.
Each row is a passive tap target — the parent decides which URL to open.

## Callbacks

- \`onGoBack\` — header back button. Parent calls \`router.back()\`.
- \`onOpenPrivacyPolicy\` — opens \`environmentConfig.privacyPolicyURL\`.
- \`onOpenTermsOfUse\` — opens \`environmentConfig.termsOfUseURL\`.
- \`onOpenChildSafetyPolicy\` — opens \`environmentConfig.childrenPrivacyURL\`.

All three route through \`openInAppBrowser\` in production so the user
never leaves the app.
`.trim();

const meta = {
  title: 'Account / LegalBody',
  component: LegalBody,
  args: {
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGoBack: () => {},
    onOpenPrivacyPolicy: () => {},
    onOpenTermsOfUse: () => {},
    onOpenChildSafetyPolicy: () => {},
  },
  argTypes: {
    onGoBack: { action: 'onGoBack' },
    onOpenPrivacyPolicy: { action: 'onOpenPrivacyPolicy' },
    onOpenTermsOfUse: { action: 'onOpenTermsOfUse' },
    onOpenChildSafetyPolicy: { action: 'onOpenChildSafetyPolicy' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof LegalBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Idle state with all three rows visible. Tap any row to see the
corresponding \`onOpen…\` callback fire in the Actions panel; the
production \`LegalScreen\` maps each of these to
\`openInAppBrowser(environmentConfig.<url>)\`.
    `.trim(),
  },
};
