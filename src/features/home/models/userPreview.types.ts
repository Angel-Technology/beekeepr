// Back-compat re-export — the canonical `ProfilePreviewUser` type now
// lives alongside the shared profile-preview components so it's
// reachable from any feature that needs to render a preview. Update
// imports to `@components` over time and delete this file once all
// home-side callers have moved.
export type { ProfilePreviewUser } from '@components';
