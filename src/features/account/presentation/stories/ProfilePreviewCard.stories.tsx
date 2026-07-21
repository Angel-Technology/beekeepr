/**
 * Stories for the small avatar + nickname + handle row that opens the
 * profile-preview drawer. Rendered inside `ProfileBody` (own profile),
 * the connections list, and any surface where a compact profile
 * summary needs to invite a tap.
 *
 * Cover: default (avatar + nickname + handle), long-nickname
 * truncation, no-avatar fallback, no-handle single-line row, and the
 * static (non-pressable) variant used when the row shouldn't trigger
 * a drawer. Tap the card in the canvas — `onPress` fires into the
 * Actions panel. See `./ProfilePreviewCard.docs.md` for anatomy.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { ProfilePreviewCard } from '../components/ProfilePreviewCard';

const componentNotes = `
# ProfilePreviewCard

Compact avatar + nickname + handle row with a right-side chevron.
The primary way to open the profile-preview drawer from a list.

## Pressable vs static

Passing \`onPress\` turns the row into a \`TouchableOpacity\` and shows
the chevron. Omitting \`onPress\` renders a plain \`View\` with no
chevron — used when the row is a read-only summary (e.g. inside a
sheet where the drawer is already open).

## Avatar fallback

\`imageUrl\` is passed through \`isRenderableAvatarUrl\` before being
handed to \`RemoteAvatar\`. Non-SVG URLs (Google's rasterised
\`picture\` field, Apple sign-in avatars) are rejected and the neutral
\`UserRound\` icon renders in the avatar circle instead.

## Handle formatting

The \`handle\` prop is the bare value — the component prepends the
\`@\` at display time. Passing an already-prefixed handle is fine
(it's collapsed to a single \`@\`), but the source of truth is the
un-prefixed string.
`.trim();

const meta = {
  title: 'Account / ProfilePreviewCard',
  component: ProfilePreviewCard,
  args: {
    nickname: 'Ava',
    handle: 'ava',
    imageUrl: null,
    // Storybook's action addon replaces this at render time via the
    // `argTypes.action` declaration below — the stub satisfies TS.
    onPress: () => {},
  },
  argTypes: {
    nickname: { control: { type: 'text' } },
    handle: { control: { type: 'text' } },
    imageUrl: { control: { type: 'text' } },
    onPress: { action: 'onPress' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ProfilePreviewCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

Pressable row with a nickname, a handle, and the fallback avatar icon
(no image URL). Chevron is visible because \`onPress\` is wired. This
is the standard shape rendered inside \`ProfileBody\`.
    `.trim(),
  },
};

export const LongNickname: Story = {
  args: {
    nickname: 'Alexandra Beatrix Cunningham-Delacroix III',
    handle: 'alexandra',
  },
  parameters: {
    notes: `
## Long nickname

Both the nickname and the handle are \`numberOfLines={1}\` — long
values are truncated with an ellipsis. The layout stays a single row
regardless of length; the min-width-0 flex container in the middle
absorbs the overflow.
    `.trim(),
  },
};

export const NoAvatar: Story = {
  args: {
    nickname: 'Ava',
    handle: 'ava',
    imageUrl: null,
  },
  parameters: {
    notes: `
## No avatar

\`imageUrl\` is null. Renders the neutral \`UserRound\` fallback icon.
Same behaviour when \`imageUrl\` points to a rasterised source that
\`isRenderableAvatarUrl\` rejects.
    `.trim(),
  },
};

export const NoHandle: Story = {
  args: {
    nickname: 'Ava',
    handle: '',
  },
  parameters: {
    notes: `
## No handle

User hasn't claimed a handle yet. The handle line is suppressed and
the nickname sits on its own vertically — this is the shape a
brand-new account renders until the handle field is submitted.
    `.trim(),
  },
};

export const Pressable: Story = {
  args: {
    nickname: 'Ava',
    handle: 'ava',
  },
  parameters: {
    notes: `
## Pressable

Explicit pressable variant. Tapping fires \`onPress\` into the Actions
panel. The chevron on the right is the affordance that indicates the
row is tappable.
    `.trim(),
  },
};

export const Static: Story = {
  args: {
    nickname: 'Ava',
    handle: 'ava',
    onPress: undefined,
  },
  parameters: {
    notes: `
## Static

No \`onPress\` prop — the component swaps its container from
\`TouchableOpacity\` to \`View\` and hides the chevron. Used when the
row is a read-only summary (the drawer is already open, or the
context doesn't want another navigation).
    `.trim(),
  },
};
