# Storybook Conventions

> Reference implementation: `src/components/ui/button/Button.stories.tsx`. The Storybook setup lives in `.rnstorybook/`. Toggle Storybook with `EXPO_PUBLIC_STORYBOOK_ENABLED=true` (use `yarn storybook:ios` / `yarn storybook:android`).

## Where stories live

Two patterns, depending on how crowded the surrounding folder is.

### Co-located (default for shared UI primitives)

When the component lives in its own folder, keep its three files together:

```text
src/components/ui/button/
  Button.tsx          # the component
  Button.stories.tsx  # interactive story scenarios (controls + actions)
  Button.docs.md      # narrative usage doc — anatomy, props table, when to use, quirks
```

This is the right pattern under `src/components/ui/**` where each primitive owns its own folder.

### Sibling `stories/` folder (default for crowded feature dirs)

Once a feature's `presentation/components/` accumulates many components, co-location triples the file count and obscures the production surface. Move stories into a sibling `stories/` folder:

```text
src/features/verification/presentation/
  components/                              # production components only
    IdentityKickoffSection.tsx
    IdentityWaitingSection.tsx
    CriminalFormSection.tsx
    …
  stories/                                 # story files + docs companions
    IdentityKickoffSection.stories.tsx
    IdentityKickoffSection.docs.md
    IdentityWaitingSection.stories.tsx
    IdentityWaitingSection.docs.md
    VerificationFlowPreview.stories.tsx    # flow-level preview composition
    VerificationFlowPreview.docs.md
    …
  screens/
    VerificationFlowScreen.tsx
```

Imports inside a sibling `stories/` file reach into `../components/<Component>` instead of `./Component`.

Rule of thumb: **co-locate by default; flip to `stories/` once the production folder has more than ~5–6 components, or once stories+docs would more than double the file count.** The verification feature uses `stories/` (10+ section/modal components); onboarding/auth use co-location (smaller surface).

Story files match `*.stories.{ts,tsx}` under `src/**`. The glob in `.rnstorybook/main.ts` picks them up automatically — both patterns work without config changes. The `.docs.md` file is human-readable reference, not consumed by Storybook itself; link to it from the story's docstring.

## Coverage tiers

Add stories in this order. Don't skip ahead.

1. **UI primitives** — `src/components/ui/**` (`Button`, `FloatingLabelInput`, `VerificationStatusPill`, `BaseModal`, etc.). These are pure rendering, easy to story, no providers required.
2. **Feature presentation components** — `src/features/*/presentation/components/**` (`AuthBrandHeader`, `WhatWeDoSlide`, `TermsAcceptanceModal`). These render real product UI; some need light props but no data.
3. **Feature screens** — only if/when we add provider mocks (auth, query client, navigation). Most screens depend on hooks that need a backing store; storying them adds little value over snapshotting.

## Global preview decorator

`.rnstorybook/preview.tsx` wraps every story with:

- `p-lg` padding around the canvas
- The component title (`UI / Button`) and the scenario name (`Solid`) shown above the rendered story
- A flex container that centers the rendered component vertically and horizontally
- The `bg-bg-default` background, plus `global.css` imported so NativeWind classes work

You don't need to repeat that scaffolding inside each story — render the component as if it's already inside a centered, padded container.

## Anatomy of a story file

```tsx
/**
 * Stories for the shared `<Button />` primitive.
 *
 * Covers: solid + outline variants, every size, loading + disabled states.
 * Press the button in the canvas — `onPress` fires into the Actions panel.
 *
 * See `./Button.docs.md` for the full component flow and usage guide.
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
    variant: { control: { type: 'radio' }, options: ['solid', 'outline'] },
    size: { control: { type: 'radio' }, options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] },
    disabled: { control: { type: 'boolean' } },
    loading: { control: { type: 'boolean' } },
    onPress: { action: 'onPress' },
  },
  parameters: {
    notes: `
# Button

The shared CTA primitive. Solid + outline variants, six sizes, loading + disabled states.

For icon variants, use \`<ButtonWithIcon />\`.
    `.trim(),
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  parameters: {
    notes: `
## Solid (default)

Brand-honey background, dark label. The dominant CTA on a screen.

**When to use:** "Continue", "Save", "Submit".
    `.trim(),
  },
};

export const Outline: Story = {
  args: { variant: 'outline', label: 'Go back' },
  parameters: {
    notes: `
## Outline

Lower visual weight. Pair next to a \`solid\` button on a row ("Go back" + "Submit").
    `.trim(),
  },
};
```

### Required pieces

| Piece | Purpose |
| --- | --- |
| File-level docstring | One short paragraph: what this file covers and what to look for in the canvas. |
| `title` | Slash-separated path (`UI / Button`, `Onboarding / WhatWeDoSlide`). The first segment groups in the navigator. |
| `component` | The component reference. Drives the `Meta<typeof X>` type so `args` is type-checked. |
| `args` | Default props for the *meta-level* story. Inherited by every named story unless overridden. |
| `argTypes` | Maps each prop to a control type (`text`, `boolean`, `radio`, `select`, `color`, etc.) **or** an action. |
| `meta.parameters.notes` | Component-level markdown shown in the **Notes** tab on-device (rendered by `@storybook/addon-ondevice-notes` via `react-native-markdown-display`). Headings, bold, lists, and code spans all render. |
| Named stories | Each scenario as a top-level export (`Solid`, `Outline`, `Loading`). The export name is the scenario shown in the canvas header. |
| Per-story `parameters.notes` | Markdown for *this scenario* — when to use, when not to use, watch-outs. Shown in the same Notes tab when the story is selected. |
| Companion `.docs.md` | Long-form usage doc — anatomy, props table, when-to-use, behavior quirks. Lives next to the component; not loaded by Storybook (it's the canonical in-repo reference for code reviewers and future maintainers). |

### Controls

Every interactive prop needs an `argTypes` entry so it shows up as a control. Pick the type that matches:

| Prop type | Control |
| --- | --- |
| `string` (free text) | `{ control: { type: 'text' } }` |
| `string` (enum) | `{ control: { type: 'radio' }, options: [...] }` (≤ 4 options) or `'select'` (5+) |
| `boolean` | `{ control: { type: 'boolean' } }` |
| `number` | `{ control: { type: 'number' } }` or `'range'` with min/max/step |
| `string` (color) | `{ control: { type: 'color' } }` |

Anything matching the `controls.matchers` regex in `preview.tsx` (`color`/`background` named props, `Date` suffix) gets the right control inferred — but explicit is always clearer.

### Actions

For callback props (`onPress`, `onChange`, etc.), use `{ action: '<name>' }` in `argTypes`. Storybook auto-wires a function that logs to the Actions panel — you don't supply one in `args`.

```tsx
argTypes: {
  onPress: { action: 'onPress' },
}
```

When you tap the button in the canvas, `onPress` shows up in the Actions tab with timestamp and arguments. **Don't** pass `onPress: () => {}` in `args` — that overrides the action wiring and you'll see nothing logged.

### Multiple scenarios per component

Each *named export* is a scenario. Show what's worth seeing — typically:

- **Default** state (`Solid`)
- Each **variant** that changes layout/visuals (`Outline`)
- **Boundary states** (`Loading`, `Disabled`, `Error`)
- **Edge cases** that surprised us in production (long label, RTL, etc.)

Don't enumerate every prop combination — that's what controls are for. Stories are named, screenshot-able demonstrations of *meaningful* states.

### Things to avoid

1. **Don't pass JSX as `args`.** Storybook tries to serialize args and warns about cycles when they contain React nodes. If a prop accepts a `ReactNode` (icon, illustration, custom content), pass it via a `render` function instead:

   ```tsx
   export const WithIcon: Story = {
     render: (args) => <Button {...args} iconLeft={<Plus size={20} />} />,
   };
   ```

2. **Don't import expo-router hooks** (`useRouter`, `useLocalSearchParams`, etc.) in story files or in components rendered by stories. Storybook short-circuits the router; those hooks crash with `UnhandledLinkingContext`. Either refactor the component to take navigation callbacks as props, or wrap it in a small story-only adapter.

3. **Don't depend on QueryProvider / RevenueCat / auth context.** Storybook mode skips all providers. If a component reads from `useQuery` / `useAuthSession`, story it at the *presentation* level (props in, JSX out) — not the connected version.

4. **Don't hand-roll padding inside the story.** The global decorator already applies it. Doubling up makes layouts inconsistent.

5. **Don't wrap your component in `<View className="flex-1">` unless it actually needs flex.** The preview already centers content; `flex-1` on a small primitive makes it stretch awkwardly.

## Adding a new story

1. Decide where the story files live (see "Where stories live" above): co-located next to `Foo.tsx`, or in a sibling `stories/` folder if the feature has accumulated many components.
2. Create `Foo.stories.tsx` (importing `Foo` via `./Foo` for co-location, or `../components/Foo` for the sibling pattern).
3. Copy the structure from `Button.stories.tsx`.
4. Update `title`, `component`, `args`, `argTypes`, `parameters.notes` (markdown).
5. Add named scenarios — at least the default state — each with its own `parameters.notes`.
6. Create `Foo.docs.md` (copy `Button.docs.md` as a template) — anatomy, props table, when to use, when not to use, quirks, related components.
7. Save. Metro picks it up; reload Storybook on the device.

If a scenario needs ReactNode props, use `render` (see "Things to avoid" #1).

## Checklist before committing a story

- [ ] File-level docstring describes what's in the file and links to the `.docs.md` companion.
- [ ] `meta.parameters.notes` (markdown) describes the component.
- [ ] Every named story has `parameters.notes` (markdown) — what this scenario is and when to use it.
- [ ] Companion `Foo.docs.md` exists with anatomy, props table, when-to-use, and quirks sections.
- [ ] Every interactive prop has a control entry in `argTypes`.
- [ ] Every callback prop is wired via `{ action: '<name>' }`, not a stub.
- [ ] Named scenarios cover at least: default, the most-different variant, and any boundary states (loading/disabled/error).
- [ ] No JSX in `args`.
- [ ] No expo-router or context hooks in the rendered tree.
- [ ] `npx tsc --noEmit` passes.
