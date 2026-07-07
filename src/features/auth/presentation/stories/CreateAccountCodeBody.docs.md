# CreateAccountCodeBody

Pure presentation body for the "Enter verification code" step of account creation. Rendered by `CreateAccountCodeScreen`, which owns the connection to `useCreateAccountCodeForm` and passes the OTP field state, completion gate, mutation state, and navigation callbacks in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│                                          │
│                [ BrandMark ]             │
│                                          │
│         Enter verification code          │
│    We sent a verification code to your   │
│    email {email}.                        │
│                                          │
│    ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐         │
│    │ 1 │ │ 2 │ │ 3 │ │   │ │   │         │
│    └───┘ └───┘ └───┘ └───┘ └───┘         │
│                                          │
│  ┌──────────────┐  ┌──────────────────┐  │
│  │   Go Back    │  │      Submit      │  │
│  └──────────────┘  └──────────────────┘  │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `email` | `string` | The trimmed email the code was sent to; rendered inline in the explainer copy. |
| `code` | `string` | Controlled value of the `OtpInput`. |
| `codeLength` | `number` | Number of digits the `OtpInput` renders. Fixed at 5 by the hook. |
| `isComplete` | `boolean` | `code.length === codeLength`. Gates the Submit CTA and drives the hook's auto-submit effect. |
| `isPending` | `boolean` | True while the `verifyEmailSignIn` mutation is in flight. Shows the button loader. |
| `onChangeCode` | `(next: string) => void` | OTP input change. Parent updates the hook's `code` state, which triggers auto-submit when complete. |
| `onSubmit` | `() => void` | Tapping the Submit CTA. Parent runs the mutation; the auth session advances the app past the login gate on success. |
| `onGoBack` | `() => void` | Tapping the Go Back outline button. Parent calls `router.back()`. |

## When this renders

Reached from the `/auth/create-account-code` route — the second and final step of the email + code account-creation flow. The hook redirects back to `/auth/create-account-email` if it lands here without an `email` param, so the screen renders `null` in that transient state and this body only mounts once `email` is known.

The user enters the 5-digit code they received. The hook auto-submits the moment the code becomes complete; the Submit button is a manual fallback for when the auto-submit failed and the user edits the code. Success advances the app past the login gate; failure is surfaced via the shared error modal, and Go Back returns to the email step.

## Why it's a body, not a screen

Same reason as `VerificationLearnMoreBody`: the connected screen depends on `useRouter` and `useLocalSearchParams` (via `useCreateAccountCodeForm`) which crash under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a thin adapter that maps the hook's `handleX` / `setX` names onto the body's `onX` prop convention.

## What isn't in the body

The current screen doesn't render a Resend CTA even though the hook exposes `handleResend` and `isResending`. Those stay on the hook until the resend UI is added; adding them to the body would change what the screen renders today.

## Related

- [`useCreateAccountCodeForm`](../../hooks/useCreateAccountCodeForm.ts) — owns OTP state, the auto-submit effect, the `verifyEmailSignIn` and `requestEmailSignIn` mutations, and the router.
- [`CreateAccountCodeScreen`](../screens/CreateAccountCodeScreen.tsx) — the connected wrapper.
- [`CreateAccountEmailBody`](./CreateAccountEmailBody.docs.md) — the prior step in the flow.
