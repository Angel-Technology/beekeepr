import type { ReactNode } from 'react';
import { useCallback } from 'react';
import { Linking, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { SvgUri } from 'react-native-svg';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Info, Phone, UserRound } from 'lucide-react-native';
import { FormCard } from '../ui/card/FormCard';
import { SafetyDisclaimerCard } from '../ui/card/SafetyDisclaimerCard';
import { themedColors, useThemedColor } from '@common';
import { ContactVisibility } from '@features/auth';
import { useErrorModal } from '@src/lib/error-modal';
import { formatJoinedDate } from '@src/features/account/models/formatJoinedDate';
import { InfoSection } from '@src/features/account/presentation/components/InfoSection';
import BuzzBadge from '@assets/svg/BuzzBadge';
import GoogleVoiceIcon from '@assets/svg/GoogleVoiceIcon';
import InstagramIcon from '@assets/svg/InstagramIcon';
import SignalIcon from '@assets/svg/SignalIcon';
import TelegramIcon from '@assets/svg/TelegramIcon';
import WhatsAppIcon from '@assets/svg/WhatsAppIcon';
import type { ProfilePreviewUser } from './types';

const AVATAR_SIZE = 64;

const formatHandle = (handle: string | null | undefined) => {
  if (!handle) {
    return '';
  }
  const trimmed = handle.trim();
  return trimmed.startsWith('@') ? trimmed : `@${trimmed}`;
};

const onlyDigits = (value: string): string => value.replace(/\D+/g, '');

const stripHandle = (value: string): string => value.trim().replace(/^@+/, '');

const formatPhoneDisplay = (raw: string): string => {
  const digits = onlyDigits(raw);
  if (digits.length !== 10) {
    return raw;
  }
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const phoneTelUrl = (raw: string): string | null => {
  const digits = onlyDigits(raw);
  if (digits.length === 0) {
    return null;
  }
  return `tel:+${digits.length === 10 ? `1${digits}` : digits}`;
};

const whatsAppUrl = (raw: string): string | null => {
  const digits = onlyDigits(raw);
  if (digits.length === 0) {
    return null;
  }
  return `https://wa.me/${digits.length === 10 ? `1${digits}` : digits}`;
};

const instagramUrl = (handle: string): string | null => {
  const bare = stripHandle(handle);
  return bare ? `https://instagram.com/${bare}` : null;
};

const telegramUrl = (handle: string): string | null => {
  const bare = stripHandle(handle);
  return bare ? `https://t.me/${bare}` : null;
};

const signalUrl = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  if (trimmed.startsWith('http')) {
    return trimmed;
  }
  const digits = onlyDigits(trimmed);
  if (digits.length === 0) {
    return null;
  }
  return `https://signal.me/#p/+${digits.length === 10 ? `1${digits}` : digits}`;
};

const isNonEmpty = (value: string | null | undefined): value is string =>
  typeof value === 'string' && value.trim().length > 0;

type ContactRow = {
  readonly key: string;
  readonly label: string;
  readonly display: string;
  readonly url: string | null;
  readonly icon: ReactNode;
  /**
   * Signal stores a profile URL, not a typeable handle. Render as a
   * pill-shaped "Profile link" button per Figma rather than raw text.
   */
  readonly showAsPill?: boolean;
};

type ProfilePreviewBodyProps = {
  user: ProfilePreviewUser;
  // Fires on the inner ScrollView's `onScrollBeginDrag`. Connection
  // preview wires this to its actions-menu close so scrolling the body
  // also closes the kebab dropdown.
  onScrollBeginDrag?: () => void;
};

/**
 * Shared body for any drawer that shows a profile preview — own profile
 * (`ProfileDrawerContent`) or another user (`ConnectionPreviewDrawerContent`,
 * future search preview, etc). Header / actions stay in the consumer
 * because they vary per use case; this component owns everything below
 * the header.
 */
export const ProfilePreviewBody = ({
  user,
  onScrollBeginDrag,
}: ProfilePreviewBodyProps) => {
  const insets = useSafeAreaInsets();
  const errorModal = useErrorModal();
  const phoneIconColor = useThemedColor(themedColors.text.primary);
  const textSecondary = useThemedColor(themedColors.text.secondary);
  const avatarIconColor = useThemedColor(themedColors.text.tertiary);

  const displayName = user.nickname?.trim() || 'Member';
  const displayHandle = formatHandle(user.handle);
  const memberSince = formatJoinedDate(user.userCreatedAtUtc);
  const lastScreenedAt = formatJoinedDate(user.checkrLastCheckAtUtc);
  const nextScreeningAt = formatJoinedDate(
    user.backgroundCheckBadgeExpiresAtUtc,
  );

  const openUrl = useCallback(
    async (url: string | null) => {
      if (!url) {
        return;
      }
      try {
        await Linking.openURL(url);
      } catch (error) {
        errorModal.showFromError(error, 'Could not open link');
      }
    },
    [errorModal],
  );

  const contactRows: ContactRow[] = [];
  if (isNonEmpty(user.phoneNumber)) {
    contactRows.push({
      key: 'phone',
      label: 'Phone Number',
      display: formatPhoneDisplay(user.phoneNumber),
      url: phoneTelUrl(user.phoneNumber),
      icon: <Phone size={16} color={phoneIconColor} />,
    });
  }
  if (isNonEmpty(user.googleVoicePhone)) {
    contactRows.push({
      key: 'gvoice',
      label: 'Google Voice',
      display: formatPhoneDisplay(user.googleVoicePhone),
      url: phoneTelUrl(user.googleVoicePhone),
      icon: <GoogleVoiceIcon />,
    });
  }
  if (isNonEmpty(user.whatsAppPhone)) {
    contactRows.push({
      key: 'whatsapp',
      label: 'WhatsApp',
      display: formatPhoneDisplay(user.whatsAppPhone),
      url: whatsAppUrl(user.whatsAppPhone),
      icon: <WhatsAppIcon />,
    });
  }
  if (isNonEmpty(user.instagramHandle)) {
    contactRows.push({
      key: 'instagram',
      label: 'Instagram',
      display: `@${stripHandle(user.instagramHandle)}`,
      url: instagramUrl(user.instagramHandle),
      icon: <InstagramIcon />,
    });
  }
  if (isNonEmpty(user.telegramHandle)) {
    contactRows.push({
      key: 'telegram',
      label: 'Telegram',
      display: `@${stripHandle(user.telegramHandle)}`,
      url: telegramUrl(user.telegramHandle),
      icon: <TelegramIcon />,
    });
  }
  if (isNonEmpty(user.signalPhone)) {
    contactRows.push({
      key: 'signal',
      label: 'Signal',
      display: 'Profile link',
      url: signalUrl(user.signalPhone),
      icon: <SignalIcon />,
      showAsPill: true,
    });
  }

  const contactSharingOn =
    user.contactVisibility === ContactVisibility.ConnectionsOnly ||
    user.contactVisibility === ContactVisibility.Public;
  const showContactCard = contactSharingOn && contactRows.length > 0;

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{
        paddingBottom: insets.bottom + 32,
        paddingTop: 24,
        gap: 24,
      }}
      showsVerticalScrollIndicator={false}
      onScrollBeginDrag={onScrollBeginDrag}
    >
      <View className="flex-row items-center gap-3 px-6">
        <View className="bg-tk-bg-elevated-secondary size-[64px] items-center justify-center overflow-hidden rounded-round">
          {user.imageUrl ? (
            <SvgUri
              uri={user.imageUrl}
              width={AVATAR_SIZE}
              height={AVATAR_SIZE}
            />
          ) : (
            <UserRound size={30} color={avatarIconColor} />
          )}
        </View>
        <View className="flex-1">
          <Text
            className="text-tk-text-primary font-poppins-semiBold text-2xl leading-tight"
            numberOfLines={1}
          >
            {displayName}
          </Text>
          {displayHandle ? (
            <Text
              className="text-tk-text-primary font-lexend-regular text-footnote leading-[18px]"
              numberOfLines={1}
            >
              {displayHandle}
            </Text>
          ) : null}
          {memberSince ? (
            <Text className="text-tk-text-tertiary font-lexend-regular text-footnote leading-[18px]">
              member since: {memberSince}
            </Text>
          ) : null}
        </View>
      </View>

      <View className="bg-tk-bg-primary border-tk-border-secondary mx-6 gap-4 rounded-5 border p-4">
        <View className="w-full flex-row items-start justify-center gap-3">
          <BuzzBadge width={35.875} height={41} />
          <View className="flex-1 justify-center">
            <Text className="text-tk-text-primary font-lexend-semiBold text-base leading-6">
              Buzz Badge
            </Text>
            <Text className="text-tk-text-secondary font-lexend-regular text-caption leading-4">
              (status updated every 6 months)
            </Text>
          </View>
          <Info size={20} color={textSecondary} />
        </View>
        <View className="gap-1">
          <View className="bg-tk-bg-elevated-secondary flex-row gap-2 rounded-1 px-1 pb-1.5 pt-1">
            <Text className="text-tk-text-secondary flex-1 font-lexend-regular text-footnote leading-none">
              Last screened
            </Text>
            <Text className="text-tk-text-primary font-lexend-regular text-footnote leading-none">
              {lastScreenedAt ?? '—'}
            </Text>
          </View>
          <View className="bg-tk-bg-primary flex-row gap-2 rounded-1 px-1 pb-1.5 pt-1">
            <Text className="text-tk-text-secondary flex-1 font-lexend-regular text-footnote leading-none">
              Next screening
            </Text>
            <Text className="text-tk-text-primary font-lexend-regular text-footnote leading-none">
              {nextScreeningAt ?? '—'}
            </Text>
          </View>
        </View>
      </View>

      {showContactCard ? (
        <View className="px-6">
          <InfoSection title="CONTACT INFORMATION">
            <FormCard className="flex gap-4 p-5">
              {contactRows.map((row) => (
                <TouchableOpacity
                  key={row.key}
                  accessibilityRole="link"
                  accessibilityLabel={`Open ${row.label}`}
                  onPress={() => openUrl(row.url)}
                  disabled={row.url === null}
                  activeOpacity={0.6}
                  className="w-full flex-row items-center gap-3"
                >
                  <View className="size-5 items-center justify-center">
                    {row.icon}
                  </View>
                  <Text className="text-tk-text-secondary flex-1 font-lexend-regular text-footnote leading-[18px]">
                    {row.label}
                  </Text>
                  {row.showAsPill ? (
                    <View className="bg-tk-bg-elevated-primary border-tk-actions-neutral-border-default min-h-[24px] flex-row items-center justify-center rounded-round border px-3 py-1.5">
                      <Text className="text-tk-actions-neutral-text-default font-lexend-semiBold text-xs">
                        {row.display}
                      </Text>
                    </View>
                  ) : (
                    <Text
                      className="text-tk-text-primary text-right font-lexend-regular text-footnote leading-[18px]"
                      numberOfLines={1}
                    >
                      {row.display}
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </FormCard>
          </InfoSection>
        </View>
      ) : null}

      <View className="px-6">
        <SafetyDisclaimerCard />
      </View>
    </ScrollView>
  );
};
