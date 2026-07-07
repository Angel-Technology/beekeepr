/**
 * Stories for the connection-preview kebab dropdown. `ProfileActionsMenu`
 * is already pure — just a `visible` flag plus `onBlock` / `onFlag`
 * callbacks — so this story renders the component as-is with no
 * extraction step.
 *
 * Cover: `Hidden` (visible=false, null render), `Visible` (menu open,
 * both actions rendered). Tap Block / Flag in the canvas — the actions
 * fire into the Actions panel. See `./ProfileActionsMenu.docs.md` for
 * dismissal semantics and positioning notes.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { ProfileActionsMenu } from './ProfileActionsMenu';

const componentNotes = `
# ProfileActionsMenu

Inline dropdown anchored under the kebab in the connection-preview
drawer header. Pure presentation — the menu owns nothing beyond its
own render; **dismissal is owned by the parent**
(\`ConnectionPreviewDrawerContent\`) via:

- a touch-capture handler on its outer wrapper (closes on touch START
  anywhere outside the menu), and
- an \`onScrollBeginDrag\` on the body's ScrollView (closes when the
  user starts scrolling the profile card).

The menu items themselves use \`onPress\` so a drag-cancel away from
an item before press-end doesn't fire the action.

## Positioning

Absolute-positioned: \`top = insets.top + APP_HEADER_HEIGHT + MENU_GAP\`,
\`right = 16\`. The parent renders a full-screen \`Pressable\` overlay
underneath (started at \`top = insets.top + APP_HEADER_HEIGHT\`) so the
kebab stays tappable to toggle the menu off — the menu renders after
the overlay so RN's last-rendered-wins z order puts it on top.

## Actions

- \`onBlock\` — parent runs a confirm dialog, then calls the block
  mutation.
- \`onFlag\` — parent runs a confirm dialog, then calls the flag
  mutation.
`.trim();

const meta = {
  title: 'Home / ProfileActionsMenu',
  component: ProfileActionsMenu,
  args: {
    visible: true,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onBlock: () => {},
    onFlag: () => {},
  },
  argTypes: {
    visible: { control: { type: 'boolean' } },
    onBlock: { action: 'onBlock' },
    onFlag: { action: 'onFlag' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ProfileActionsMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Visible: Story = {
  args: { visible: true },
  parameters: {
    notes: `
## Visible (open)

Menu is rendered with both action rows: **Block** (with the ban icon)
and **Flag** (with the flag icon). Tap either row to fire the
corresponding action — in production the parent wraps each in a
confirm dialog before running the mutation.

**Positioning in the canvas:** absolute-positioned near the top-right,
under where the app header would sit. The story canvas doesn't render
the header, so the menu appears floating relative to the top-right of
the preview area.
    `.trim(),
  },
};

export const Hidden: Story = {
  args: { visible: false },
  parameters: {
    notes: `
## Hidden

\`visible={false}\` short-circuits to \`null\` — nothing renders. This
is the resting state of the menu; the parent flips \`visible\` to
\`true\` when the user taps the kebab in the header.

Empty canvas is expected here.
    `.trim(),
  },
};
