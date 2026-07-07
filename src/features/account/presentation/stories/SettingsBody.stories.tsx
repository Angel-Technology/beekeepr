/**
 * Stories for the Settings body. Renders the actual `SettingsBody` — the
 * same component the connected `SettingsScreen` mounts in production.
 *
 * The theme picker inside the body writes through
 * `useThemePreferenceContext`, which is a pure theming primitive (not a
 * feature hook), so it works under Storybook without any provider
 * mocks. Tap the header back button and `onGoBack` fires into the
 * Actions panel; tap a segment in the theme pill and the picker
 * animates the active indicator over. See `./SettingsBody.docs.md` for
 * the full anatomy and usage context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { SettingsBody } from '../components/SettingsBody';

const componentNotes = `
# SettingsBody

The single-page Settings surface reached from the account/menu drawer.
Currently holds only the theme picker — everything else the drawer
used to expose here (newsletter, marketing, notifications) is either
owned by the OS or not yet a real product concept. Rows will land here
as those become concrete.

## Theme picker

Rendered by \`ThemeMenuRow\`, which owns the animated segmented pill
(System / Light / Dark) and writes the active preference through
\`useThemePreferenceContext\`. The picker keeps its own local state — this
body doesn't drive it.

## Callbacks

- \`onGoBack\` — parent calls \`router.back()\`.
`.trim();

const meta = {
  title: 'Account / SettingsBody',
  component: SettingsBody,
  args: {
    // Storybook's action addon replaces this at render time via the
    // `argTypes.action` declaration below — the stub satisfies TS.
    onGoBack: () => {},
  },
  argTypes: {
    onGoBack: { action: 'onGoBack' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof SettingsBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Idle state. The theme picker reflects whatever the current theme
preference context reports — usually "System" on a fresh install.
Tap the segments to see the sliding indicator animate; the write
persists through the theme-preference provider.
    `.trim(),
  },
};
