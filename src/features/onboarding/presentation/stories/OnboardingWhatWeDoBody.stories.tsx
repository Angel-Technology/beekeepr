/**
 * Stories for the onboarding "what we do" carousel body. Renders the
 * actual `OnboardingWhatWeDoBody` — the same component the connected
 * `OnboardingWhatWeDoScreen` mounts in production. No inline preview,
 * no duplicated JSX: the screen is a thin connected wrapper that calls
 * `useOnboardingWhatWeDo` and passes the finish handler into the body,
 * so storying the body is equivalent to storying the screen minus the
 * router hook.
 *
 * The story renders the full three-slide `PaperOnboarding` carousel.
 * Swipe between slides in the canvas — the "Let's go!" CTA on the third
 * slide fires `onFinish` into the Actions panel. See
 * `./OnboardingWhatWeDoBody.docs.md` for the full anatomy and usage
 * context.
 */
import type { Meta, StoryObj } from '@storybook/react-native';

import { OnboardingWhatWeDoBody } from '../components/OnboardingWhatWeDoBody';

const componentNotes = `
# OnboardingWhatWeDoBody

The three-slide onboarding carousel reached from the
\`/onboarding/what-we-do\` route. Introduces Buzzkeepr's positioning
(Welcome → Stand Out → Trust) and hands off to the create-account
screen via the "Let's go!" CTA on the final slide.

## Slides

1. **Welcome** — honey background, hero bee, "all-in-one platform to help
   you feel confident dating" copy.
2. **Stand Out** — lime background, verified-badge illustration, verify
   who you are copy.
3. **Trust** — honey background, connections illustration, "Trust is the
   new flex!" title, plus the final "Let's go!" \`BuzzButton\` CTA that
   fires \`onFinish\`.

## Callback

- \`onFinish\` — tapping "Let's go!" on the third slide. Parent calls
  \`router.replace('/onboarding/create-account')\` so the carousel is
  dropped from the back stack.
`.trim();

const meta = {
  title: 'Onboarding / OnboardingWhatWeDoBody',
  component: OnboardingWhatWeDoBody,
  args: {
    // Storybook's action addon replaces this at render time via the
    // `argTypes.action` declaration below — the stub satisfies TS.
    onFinish: () => {},
  },
  argTypes: {
    onFinish: { action: 'onFinish' },
  },
  parameters: {
    notes: componentNotes,
  },
} satisfies Meta<typeof OnboardingWhatWeDoBody>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    notes: `
## Default

The full three-slide carousel. Swipe left/right in the canvas to
navigate between slides; the "Let's go!" CTA on the final slide fires
\`onFinish\` into the Actions panel. In production the parent handler
routes into \`/onboarding/create-account\` via \`router.replace\`.
    `.trim(),
  },
};
