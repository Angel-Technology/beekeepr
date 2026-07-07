# OnboardingWhatWeDoBody

Pure presentation body for the onboarding "what we do" carousel. Rendered by `OnboardingWhatWeDoScreen`, which owns the connection to `useOnboardingWhatWeDo` and passes the finish callback in.

## Anatomy

```text
┌──────────────────────────────────────────┐  ┌──────────────────────────────────────────┐  ┌──────────────────────────────────────────┐
│      (honey #FCD216)                     │  │      (lime #EDF903)                      │  │      (honey #FCD216)                     │
│                                          │  │                                          │  │                                          │
│         ┌──────────────────┐             │  │         ┌──────────────────┐             │  │         ┌──────────────────┐             │
│         │   welcome bee    │             │  │         │ verified badge   │             │  │         │   connections    │             │
│         │   illustration   │             │  │         │   illustration   │             │  │         │   illustration   │             │
│         └──────────────────┘             │  │         └──────────────────┘             │  │         └──────────────────┘             │
│                                          │  │                                          │  │                                          │
│              Welcome!                    │  │            Stand out!                    │  │       Trust is the new flex!             │
│  Buzzkeepr™ is your all-in-one           │  │  Verify who you are, so your date        │  │  Get ready for more confidence and       │
│  platform to help you feel               │  │  knows you're real, invested, …          │  │  more matches.                           │
│  confident dating.                       │  │                                          │  │                                          │
│                                          │  │                                          │  │       ┌──────────────────┐               │
│           ● ○ ○                          │  │            ○ ● ○                         │  │       │  Let's go!  →    │               │
│                                          │  │                                          │  │       └──────────────────┘               │
│                                          │  │                                          │  │           ○ ○ ●                          │
└──────────────────────────────────────────┘  └──────────────────────────────────────────┘  └──────────────────────────────────────────┘
   Slide 1 — Welcome                              Slide 2 — Stand Out                          Slide 3 — Trust (CTA)
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `onFinish` | `() => void` | Tapping the "Let's go!" CTA on the third slide. Parent calls `router.replace('/onboarding/create-account')` so the carousel is dropped from the back stack. |

## When this renders

Reached from the `/onboarding/what-we-do` route — the first surface a new user sees after the app's intro screen. Three swipeable slides introduce Buzzkeepr's positioning (Welcome → Stand Out → Trust), ending on a CTA that hands off to `OnboardingCreateAccountBody`.

- Coming from: the `/onboarding` intro screen.
- Going to: `/onboarding/create-account`.

## Why it's a body, not a screen

Same reason as `VerificationLearnMoreBody`: the connected screen depends on `useRouter`, which crashes under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without a router mock. The screen is a three-line adapter that maps `handleFinish` onto `onFinish`.

The three slides — including the honey/lime backgrounds, illustration frames, and the `BuzzButton` on the final page — are built inline in the body's `useMemo`, mirroring the original screen. The only value the body pulls from outside is `onFinish`, which the memo depends on so a callback-identity change swaps the CTA cleanly.

## Related

- [`useOnboardingWhatWeDo`](../../hooks/useOnboardingWhatWeDo.ts) — owns the router hop into `/onboarding/create-account`.
- [`OnboardingWhatWeDoScreen`](../screens/OnboardingWhatWeDoScreen.tsx) — the connected wrapper.
- [`WhatWeDoSlide`](../components/WhatWeDoSlide.tsx) — the per-slide layout primitive.
- [`OnboardingCreateAccountBody`](../components/OnboardingCreateAccountBody.tsx) — the sibling body this screen hands off to.
