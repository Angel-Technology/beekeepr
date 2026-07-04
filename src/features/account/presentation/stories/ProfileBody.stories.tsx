/**
 * Stories for the My Profile body. Renders the actual `ProfileBody` —
 * the same component the connected `ProfileScreen` mounts in production.
 * No inline preview: the screen is a thin connected wrapper that reads
 * the auth session, wires up `useProfileForm` and `useContactForm`, and
 * threads them into the body.
 *
 * The body takes the two form bindings as objects with stub `setField`
 * / `submitField` callbacks — perfect for exercising the visual states
 * (empty vs filled inputs, success vs error status icons, empty vs
 * filled contact icons, disabled vs enabled connections switch, hidden
 * vs shared preview card). See `./ProfileBody.docs.md` for the full
 * anatomy.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { ProfileBody } from '../components/ProfileBody';

const emptyProfileValues = {
  nickname: '',
  handle: '',
} as const;

const emptyContactValues = {
  phoneNumber: '',
  googleVoicePhone: '',
  whatsAppPhone: '',
  instagramHandle: '',
  telegramHandle: '',
  signalPhone: '',
} as const;

const idleProfileStatus = {
  nickname: 'idle',
  handle: 'idle',
} as const;

const idleContactStatus = {
  phoneNumber: 'idle',
  googleVoicePhone: 'idle',
  whatsAppPhone: 'idle',
  instagramHandle: 'idle',
  telegramHandle: 'idle',
  signalPhone: 'idle',
} as const;

const noContactErrors = {
  phoneNumber: undefined,
  googleVoicePhone: undefined,
  whatsAppPhone: undefined,
  instagramHandle: undefined,
  telegramHandle: undefined,
  signalPhone: undefined,
} as const;

const componentNotes = `
# ProfileBody

The My Profile surface reached from the account/menu drawer. Renders:

1. A preview card (or hidden placeholder) reflecting the user's Public /
   Private visibility.
2. The Profile section — avatar row, nickname + handle inputs with
   inline field-status icons, and the Share Profile privacy toggle.
3. A tip card asking users what fields they'd want next.
4. The Contact Information section — six brand-icon inputs (phone,
   Google Voice, WhatsApp, Instagram, Telegram, Signal) with per-field
   error text and inline status icons, plus the "Share with connections"
   privacy toggle. The switch is disabled when the entire contact set is
   empty.

## Form bindings

The body takes two objects (\`profileForm\`, \`contactForm\`) so the
surface stays scannable — each bundle mirrors the shape returned by its
hook. The stories stub these with empty values and idle statuses; edit
individual fields inside the bundles via the JSON control if you want
to preview a specific state.

## Local state

The avatar picker sheet's open/closed flag is local to the body —
opening and closing is pure UI toggling with no side effects. Picking
an avatar fires \`onSelectAvatar\` and the sheet closes automatically.
`.trim();

const meta = {
  title: 'Account / ProfileBody',
  component: ProfileBody,
  args: {
    profileForm: {
      values: emptyProfileValues,
      fieldStatus: idleProfileStatus,
      setField: () => {},
      submitField: () => {},
    },
    contactForm: {
      values: emptyContactValues,
      fieldStatus: idleContactStatus,
      fieldError: noContactErrors,
      setField: () => {},
      submitField: () => {},
    },
    imageUrl: null,
    profileShared: true,
    connectionsOn: false,
    // Storybook's action addon replaces these at render time via the
    // `argTypes.action` declarations below — the stubs satisfy TS.
    onGoBack: () => {},
    onOpenProfileDrawer: () => {},
    onSelectAvatar: () => {},
    onProfileSharedChange: () => {},
    onConnectionsChange: () => {},
  },
  argTypes: {
    imageUrl: { control: { type: 'text' } },
    profileShared: { control: { type: 'boolean' } },
    connectionsOn: { control: { type: 'boolean' } },
    onGoBack: { action: 'onGoBack' },
    onOpenProfileDrawer: { action: 'onOpenProfileDrawer' },
    onSelectAvatar: { action: 'onSelectAvatar' },
    onProfileSharedChange: { action: 'onProfileSharedChange' },
    onConnectionsChange: { action: 'onConnectionsChange' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof ProfileBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  parameters: {
    notes: `
## Empty (default)

Brand-new user. No nickname, no handle, no contact info, no avatar. The
profile is Public (default enum value) so the preview card renders
above the empty form. The connections-only switch is disabled because
there's nothing to share yet.
    `.trim(),
  },
};

export const Filled: Story = {
  args: {
    profileForm: {
      values: { nickname: 'Jane', handle: 'jane' },
      fieldStatus: { nickname: 'success', handle: 'success' },
      setField: () => {},
      submitField: () => {},
    },
    contactForm: {
      values: {
        phoneNumber: '(555) 123-4567',
        googleVoicePhone: '',
        whatsAppPhone: '(555) 987-6543',
        instagramHandle: 'janedoe',
        telegramHandle: '',
        signalPhone: '',
      },
      fieldStatus: {
        phoneNumber: 'success',
        googleVoicePhone: 'idle',
        whatsAppPhone: 'success',
        instagramHandle: 'success',
        telegramHandle: 'idle',
        signalPhone: 'idle',
      },
      fieldError: noContactErrors,
      setField: () => {},
      submitField: () => {},
    },
    imageUrl: 'https://api.dicebear.com/9.x/adventurer/svg?seed=jane',
    profileShared: true,
    connectionsOn: true,
  },
  parameters: {
    notes: `
## Filled

Established user. Nickname + handle both saved (success ticks visible),
three contact channels populated, avatar picked, and the contact
share-with-connections switch is on — allowed because there's contact
info to share.
    `.trim(),
  },
};

export const ProfileHidden: Story = {
  args: { profileShared: false },
  parameters: {
    notes: `
## Profile hidden

User has toggled Share Profile off. The preview card swaps to
\`ProfilePreviewHiddenCard\` and the toggle copy switches to "Profile
hidden" / "Only I can see my profile."
    `.trim(),
  },
};

export const WithFieldError: Story = {
  args: {
    contactForm: {
      values: {
        ...emptyContactValues,
        phoneNumber: '(555) 1',
      },
      fieldStatus: { ...idleContactStatus, phoneNumber: 'error' },
      fieldError: {
        ...noContactErrors,
        phoneNumber: 'Enter a valid 10-digit phone number.',
      },
      setField: () => {},
      submitField: () => {},
    },
  },
  parameters: {
    notes: `
## With field error

User blurred a phone-style field with a partial value. The
\`FieldStatusIcon\` shows the error state and the inline error copy
renders under the input. In production this comes from
\`useContactForm\`'s validation branch — the field stays editable so
the user can correct it.
    `.trim(),
  },
};
