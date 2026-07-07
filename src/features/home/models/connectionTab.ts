/**
 * Active pill on the welcome flow — `connections` shows the friends
 * list, `invites` flips to incoming + sent invites + blocked users.
 *
 * Lives in `models/` (not in the pill's presentation file) so that
 * `useBuzzTab` can own the active-tab state without the hook layer
 * importing from `presentation/` (lint boundary).
 */
export type ConnectionTab = 'connections' | 'invites';
