# CreateAccountEmailBody

Pure presentation body for the "Enter email" step of account creation. Rendered by `CreateAccountEmailScreen`, which owns the connection to `useCreateAccountEmailForm` and passes the field state, validation gate, mutation state, and navigation callbacks in.

## Anatomy

```text
┌──────────────────────────────────────────┐
│                                          │
│                [ BrandMark ]             │
│                                          │
│                Enter email               │
│      We’ll send you a One Time           │
│      Verification Code via this email    │
│                                          │
│  ┌────────────────────────────────────┐  │
│  │ Email Address                      │  │
│  │ name@website.com                   │  │
│  └────────────────────────────────────┘  │
│  (Please enter a valid email address.)   │  <- shouldShowEmailError
│                                          │
│  {serverError}                           │  <- red inline, when non-null
│                                          │
│  ┌──────────────┐  ┌──────────────────┐  │
│  │   Go Back    │  │       Send       │  │
│  └──────────────┘  └──────────────────┘  │
└──────────────────────────────────────────┘
```

## Props

| Prop | Type | Notes |
| --- | --- | --- |
| `email` | `string` | Controlled value of the email `Input`. |
| `canSubmit` | `boolean` | Gates the Send CTA. Hook computes as `trimmedEmail.length > 0 && isValidEmail`. |
| `isPending` | `boolean` | True while the `requestEmailSignIn` mutation is in flight. Shows the button loader. |
| `shouldShowEmailError` | `boolean` | Whether to render the inline "Please enter a valid email address." message under the field. |
| `serverError` | `string \| null` | Server-side OTP-request error message. Rendered as a red line below the form when non-null. |
| `onChangeEmail` | `(next: string) => void` | Text input change. Parent updates the hook's `email` state. |
| `onValidate` | `() => void` | Fires on blur and submit-editing. Parent uses it to arm inline validation. |
| `onSend` | `() => void` | Tapping the Send CTA. Parent runs the mutation and routes to `/auth/create-account-code`. |
| `onGoBack` | `() => void` | Tapping the Go Back outline button. Parent calls `router.back()`. |

## When this renders

Reached from the `/auth/create-account-email` route — the first step of the email + code account-creation flow. Typically opened from the onboarding "Create account" CTA. The user enters their email, taps Send, and (on success) advances to `CreateAccountCodeBody` at `/auth/create-account-code`.

## Why it's a body, not a screen

Same reason as `VerificationLearnMoreBody`: the connected screen depends on `useRouter` (via `useCreateAccountEmailForm`) which crashes under Storybook. Splitting the screen into a presentation body + a connected wrapper means we get the same JSX in stories without provider mocks. The screen is a thin adapter that maps the hook's `handleX` / `setX` names onto the body's `onX` prop convention.

## Related

- [`useCreateAccountEmailForm`](../../hooks/useCreateAccountEmailForm.ts) — owns field state, validation gate, the `requestEmailSignIn` mutation, and the router.
- [`CreateAccountEmailScreen`](../screens/CreateAccountEmailScreen.tsx) — the connected wrapper.
- [`CreateAccountCodeBody`](./CreateAccountCodeBody.docs.md) — the next step in the flow.
