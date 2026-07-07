import { useRouter } from 'expo-router';
import type { ProfilePreviewUser } from '@components';
import { useAuthSession } from '@features/auth';
import { isVerificationDenied } from '@features/verification';
import { useCancelInvite } from '@features/home/hooks/useCancelInvite';
import { useOpenProfilePreview } from '@features/home/hooks/useOpenProfilePreview';
import { openInAppBrowser } from '@src/lib/browser';
import { environmentConfig } from '@src/lib/config/environment';
import { useRevenueCat } from '@src/lib/revenuecat';
import type { SearchResultUser } from '../models/search.types';
import { useSearchUsers } from './useSearchUsers';

export type SearchGateState = 'profile' | 'member' | null;

const toPreviewUser = (user: SearchResultUser): ProfilePreviewUser => ({
  id: user.id,
  nickname: user.nickname,
  displayName: user.displayName,
  handle: user.handle,
  imageUrl: user.imageUrl,
  backgroundCheckBadge: user.backgroundCheckBadge,
  backgroundCheckBadgeExpiresAtUtc: user.backgroundCheckBadgeExpiresAtUtc,
  checkrLastCheckAtUtc: user.checkrLastCheckAtUtc,
  // Search DTO names the field `createdAtUtc`; the preview surface uses
  // `userCreatedAtUtc` (matches `UserConnectionDto`).
  userCreatedAtUtc: user.createdAtUtc,
  profileVisibility: user.profileVisibility,
  contactVisibility: user.contactVisibility,
  googleVoicePhone: user.googleVoicePhone,
  whatsAppPhone: user.whatsAppPhone,
  instagramHandle: user.instagramHandle,
  telegramHandle: user.telegramHandle,
  snapchatHandle: user.snapchatHandle,
  signalPhone: user.signalPhone,
});

/**
 * Orchestration hook for the Search tab. Bundles the debounced query,
 * denial banner state, profile/membership gating, and the per-row
 * callbacks (open drawer, unsend invite). Mirrors `useBuzzTab` so the
 * SearchScreen stays a pure render.
 *
 * Gating priority — profile before membership: a user without a claimed
 * nickname / handle can't be discovered at all, so funnelling them
 * through the membership purchase first would be a dead end.
 */
export const useSearchTab = (query: string) => {
  const router = useRouter();
  const { data: user, isPending: isUserPending } = useAuthSession();
  const { isReady: isRevenueCatReady, isPro } = useRevenueCat();
  const openPreview = useOpenProfilePreview();
  const { cancel: cancelInvite, cancelPendingId } = useCancelInvite();

  // Until BOTH the auth session and RevenueCat customer info land,
  // `isPro` and the badge state are stale defaults — `gateState` would
  // briefly point at 'member' even for paying users, flashing a
  // "Become a member" CTA before snapping back. Mirror the
  // `useBuzzTab` resolve flag and let callers render a skeleton.
  const isResolving = isUserPending || !isRevenueCatReady;

  const isDenied = isVerificationDenied(user);
  // Heuristic until a dedicated `isProfileComplete` lands: a member has a
  // profile once they've claimed a nickname AND a handle. Fresh accounts
  // pass through the create-account flow with both blank.
  // TODO: replace with a server-derived flag once available.
  const hasProfile = Boolean(user?.nickname && user?.handle);
  const isMember = isPro;
  const gateState: SearchGateState = !hasProfile
    ? 'profile'
    : !isMember
      ? 'member'
      : null;
  const isSearchDisabled = gateState !== null || isDenied;

  // Don't even debounce a query the user can't run — gated state forces
  // the underlying hook to settle on an empty fetch.
  const { results, isLoading } = useSearchUsers(isSearchDisabled ? '' : query);

  const onPressUser = (target: SearchResultUser) =>
    // Forward the row's friendship state to the drawer store so the
    // header can pick Invite vs Unsend without a second query.
    openPreview(toPreviewUser(target), 'search', target.viewerFriendshipState);

  const onUnsendInvite = (otherUserId: string) => cancelInvite(otherUserId);

  const onAppealDecision = () => openInAppBrowser(environmentConfig.supportURL);

  const onGatePress = () => {
    if (gateState === 'profile') {
      // TODO: route to a dedicated create-profile flow once it exists.
      router.push('/profile');
      return;
    }
    if (gateState === 'member') {
      router.push('/verify-learn-more');
    }
  };

  return {
    isResolving,
    isDenied,
    gateState,
    isSearchDisabled,
    results,
    isLoading,
    cancelPendingId,
    onPressUser,
    onUnsendInvite,
    onAppealDecision,
    onGatePress,
  };
};
