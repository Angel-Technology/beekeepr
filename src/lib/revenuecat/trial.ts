// Single source of truth for the free-trial length shown in the app. The
// actual trial is configured on the store product (App Store Connect /
// Play Console) — keep this in sync with that offer. Lives in its own
// module (not the provider) so presentation components and stories can
// read it without pulling in the RevenueCat SDK.
export const TRIAL_LENGTH_DAYS = 7;

// How many days before the trial ends we send the reminder email.
export const REMINDER_LEAD_DAYS = 5;

// "7-Day" / "7-day" — used in titles and CTA copy.
export const TRIAL_LENGTH_TITLE = `${TRIAL_LENGTH_DAYS}-Day`;
export const TRIAL_LENGTH_LABEL = `${TRIAL_LENGTH_DAYS}-day`;
