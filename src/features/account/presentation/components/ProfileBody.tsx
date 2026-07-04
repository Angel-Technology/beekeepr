import { useState, type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, FormCard, IconButton, Input } from '@components';
import { themedColors, useThemedColor } from '@common';
import GoogleVoiceIcon from '@assets/svg/GoogleVoiceIcon';
import GoogleVoiceIconMono from '@assets/svg/GoogleVoiceIconMono';
import InstagramIcon from '@assets/svg/InstagramIcon';
import InstagramIconMono from '@assets/svg/InstagramIconMono';
import SignalIcon from '@assets/svg/SignalIcon';
import SignalIconMono from '@assets/svg/SignalIconMono';
import SnapchatIcon from '@assets/svg/SnapchatIcon';
import SnapchatIconMono from '@assets/svg/SnapchatIconMono';
import TelegramIcon from '@assets/svg/TelegramIcon';
import TelegramIconMono from '@assets/svg/TelegramIconMono';
import type { FieldStatus } from '../../models/account.types';
// eslint-disable-next-line no-restricted-imports
import type {
  ContactField,
  ContactFormValues,
} from '../../hooks/contactFormReducer';
// eslint-disable-next-line no-restricted-imports
import type {
  ProfileField,
  ProfileFormValues,
} from '../../hooks/profileFormReducer';
import { AvatarPickerSheet } from './AvatarPickerSheet';
import { DisabledSettingHint } from './DisabledSettingHint';
import { FieldStatusIcon } from './FieldStatusIcon';
import { InfoSection } from './InfoSection';
import { PrivacyOptionRow } from './PrivacyOptionRow';
import { ProfilePreviewCard } from './ProfilePreviewCard';
import { ProfilePreviewHiddenCard } from './ProfilePreviewHiddenCard';
import { TipCard } from './TipCard';

const PROFILE_DESCRIPTION =
  'Customize your name and handle. This is what others will see when searching for you in the Buzz Badge Community.';

const CONTACT_DESCRIPTION =
  'This is not required. It’s up to you if you want to share any contact information. Only add contact information you’d want to share with others.';

const HANDLE_HELPER =
  'Your nickname and handle must be unique and can be a combination of letters, numbers and emojis.';

const CONTACT_FOOTER_PROMPT =
  'Don’t see what you’re looking for? Please let us know! Send feedback to ';

/**
 * Nickname + handle form slice as returned from `useProfileForm`. Passed
 * through as an object rather than six top-level props so the body's
 * signature stays scannable and reflects the hook boundary.
 */
export type ProfileFormBinding = {
  readonly values: ProfileFormValues;
  readonly fieldStatus: Record<ProfileField, FieldStatus>;
  readonly setField: (field: ProfileField, value: string) => void;
  readonly submitField: (field: ProfileField) => void;
};

/**
 * Contact info form slice as returned from `useContactForm`. Mirrors
 * `ProfileFormBinding` — same object-shape, one per hook.
 */
export type ContactFormBinding = {
  readonly values: ContactFormValues;
  readonly fieldStatus: Record<ContactField, FieldStatus>;
  readonly fieldError: Record<ContactField, string | undefined>;
  readonly setField: (field: ContactField, value: string) => void;
  readonly submitField: (field: ContactField) => void;
};

type ProfileBodyProps = {
  /** Nickname + handle form slice from `useProfileForm`. */
  profileForm: ProfileFormBinding;
  /** Contact info form slice from `useContactForm`. */
  contactForm: ContactFormBinding;
  /**
   * The signed-in user's current avatar URL. Threaded into the preview
   * card and the `AvatarPickerSheet`'s starting selection. `null` when
   * the user hasn't set an avatar yet.
   */
  imageUrl: string | null;
  /**
   * `true` when the user's profile is set to Public — controls whether
   * the preview shows the real card or the hidden placeholder, and
   * seeds the Share Profile switch value.
   */
  profileShared: boolean;
  /**
   * `true` when the user's contact visibility is `ConnectionsOnly`.
   * Seeds the connections-only switch value in the contact section.
   */
  connectionsOn: boolean;
  /** Header back button. Parent calls `router.back()`. */
  onGoBack: () => void;
  /**
   * Tapping the profile-preview card. Parent opens the drawer that
   * previews the shared profile from another user's perspective.
   */
  onOpenProfileDrawer: () => void;
  /**
   * The user picked an avatar in the picker sheet. Parent persists it
   * via `useProfileForm.setImageUrl` and the sheet closes automatically.
   */
  onSelectAvatar: (avatarUrl: string) => void;
  /** Share Profile switch flipped. Parent writes through `useProfileForm.setProfileVisibility`. */
  onProfileSharedChange: (next: boolean) => void;
  /** Share-with-connections switch flipped. Parent writes through `useProfileForm.setContactVisibility`. */
  onConnectionsChange: (next: boolean) => void;
};

/**
 * Pure presentation body for the My Profile screen. Renders the preview
 * card / hidden placeholder, the nickname + handle form with inline
 * status icons, the profile-privacy toggle, the tip card, and the
 * contact-info form with the six brand-icon inputs and the
 * contact-privacy toggle.
 *
 * Owns one piece of local UI state — the avatar-picker sheet's
 * open/closed flag. Everything else (form state, mutations, visibility
 * writes) lives in the two form hooks handed in via `profileForm` and
 * `contactForm`. The connected screen (`ProfileScreen`) wires the hooks
 * and the navigation callbacks.
 */
export const ProfileBody = ({
  profileForm,
  contactForm,
  imageUrl,
  profileShared,
  connectionsOn,
  onGoBack,
  onOpenProfileDrawer,
  onSelectAvatar,
  onProfileSharedChange,
  onConnectionsChange,
}: ProfileBodyProps) => {
  const insets = useSafeAreaInsets();
  const chevronColor = useThemedColor(themedColors.text.primary);
  const atSignColor = useThemedColor(themedColors.text.secondary);
  // Empty-state color for the contact-brand icons. Passed as the `color`
  // prop on each brand icon, which switches the SVG from its multi-color
  // brand variant to a flat silhouette.
  const emptyIconColor = useThemedColor(themedColors.text.quaternary);

  // Nothing to share = nothing to toggle. The share-with switches need
  // at least one contact field filled in, otherwise turning them on
  // would make an empty contact set visible to others.
  const { values: contactValues } = contactForm;
  const hasContactInfo =
    contactValues.googleVoicePhone.trim().length > 0 ||
    contactValues.whatsAppPhone.trim().length > 0 ||
    contactValues.instagramHandle.trim().length > 0 ||
    contactValues.telegramHandle.trim().length > 0 ||
    contactValues.snapchatHandle.trim().length > 0 ||
    contactValues.signalPhone.trim().length > 0;

  // Avatar-picker sheet is local UI state — opens over the profile
  // screen and slides back down on save / dismiss.
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const openAvatarPicker = () => setAvatarPickerOpen(true);
  const closeAvatarPicker = () => setAvatarPickerOpen(false);
  const handleAvatarSelected = (avatarUrl: string) => {
    onSelectAvatar(avatarUrl);
    setAvatarPickerOpen(false);
  };

  // Contact-icon swap: the user-typed value picks which component
  // renders — the colored brand icon when filled, the Figma "Black
  // Default" mono variant when empty. Trimmed check so a whitespace-only
  // value still counts as empty.
  const isFilled = (value: string): boolean => value.trim().length > 0;
  const renderHandleAccessory = (icon: ReactNode) => (
    <View className="flex-row items-center gap-2">
      {icon}
      <Text
        className="font-lexend-regular text-base"
        style={{ color: atSignColor, letterSpacing: -0.3 }}
      >
        @
      </Text>
    </View>
  );

  const {
    values: profileValues,
    fieldStatus: profileFieldStatus,
    setField: setProfileField,
    submitField: submitProfileField,
  } = profileForm;

  const {
    fieldStatus: contactFieldStatus,
    fieldError: contactFieldError,
    setField: setContactField,
    submitField: submitContactField,
  } = contactForm;

  return (
    <View className="bg-tk-bg-primary flex-1">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Go back"
            className="border-none bg-transparent"
            icon={
              <ChevronLeft size={24} strokeWidth={2.2} color={chevronColor} />
            }
            onPress={onGoBack}
          />
        }
        center={
          <Text className="text-tk-text-primary font-poppins-semiBold text-base">
            My Profile
          </Text>
        }
      />

      <KeyboardAwareScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 24,
          paddingBottom: insets.bottom + 32,
          gap: 24,
        }}
        bottomOffset={100}
        keyboardShouldPersistTaps="handled"
      >
        {/* here */}
        <InfoSection title="Preview">
          {profileShared ? (
            <ProfilePreviewCard
              nickname={profileValues.nickname}
              handle={profileValues.handle}
              imageUrl={imageUrl}
              onPress={onOpenProfileDrawer}
            />
          ) : (
            <ProfilePreviewHiddenCard />
          )}
        </InfoSection>

        <InfoSection title="Profile" description={PROFILE_DESCRIPTION}>
          <FormCard>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Select avatar"
              onPress={openAvatarPicker}
              className="border-tk-border-secondary bg-tk-bg-primary w-full flex-row items-center gap-3 rounded-3 border py-4 pl-4 pr-2"
            >
              <Text className="text-tk-text-primary flex-1 font-lexend-semiBold text-sm">
                Select Avatar
              </Text>
              {/* CircleCheck reads as the FieldStatusIcon success state, so
                  the avatar row matches the visual language of the other
                  saved fields below. */}
              {imageUrl ? <CircleCheck size={24} color="#00A93E" /> : null}
              <ChevronRight size={24} color={chevronColor} />
            </TouchableOpacity>

            <Input
              label="Nickname"
              value={profileValues.nickname}
              onChangeText={(next) => setProfileField('nickname', next)}
              onBlur={() => submitProfileField('nickname')}
              placeholder="Nickname 123"
              rightAccessory={
                <FieldStatusIcon status={profileFieldStatus.nickname} />
              }
            />
            <Input
              label="Handle"
              value={profileValues.handle}
              onChangeText={(next) => setProfileField('handle', next)}
              onBlur={() => submitProfileField('handle')}
              placeholder="handle123"
              autoCapitalize="none"
              autoCorrect={false}
              leftAccessory={
                <Text
                  className="font-lexend-regular text-base"
                  style={{ color: atSignColor, letterSpacing: -0.3 }}
                >
                  @
                </Text>
              }
              rightAccessory={
                <FieldStatusIcon status={profileFieldStatus.handle} />
              }
            />
            <Text className="text-tk-text-tertiary px-1 font-lexend-regular text-caption leading-4">
              {HANDLE_HELPER}
            </Text>

            <View className="bg-tk-bg-secondary gap-6 rounded-5 p-4">
              <Text className="text-tk-text-secondary font-lexend-regular text-footnote uppercase leading-[18px]">
                Privacy Settings
              </Text>
              {/* Single backend-driven toggle. Per the Figma + product spec
                  the "Share Profile" switch directly maps to
                  ProfileVisibility.PUBLIC vs PRIVATE — no third option. */}
              <PrivacyOptionRow
                badgeLabel={profileShared ? 'public' : 'private'}
                title={profileShared ? 'Share Profile' : 'Profile hidden'}
                description={
                  profileShared
                    ? 'Allow Buzz Badge members to search for you and see your profile in the Buzz Badge Community.'
                    : 'Toggle on to allow Buzz Badge members to search for you and see your profile in the Buzz Badge Community. This will also allow you to search for others.'
                }
                value={profileShared}
                onChange={onProfileSharedChange}
              />
            </View>
          </FormCard>
        </InfoSection>

        <TipCard title="What are we missing?">
          {' Tell us what else you’d want to share with others. Send ideas to '}
          <Text className="text-tk-text-informational">
            design@buzzkeepr.com
          </Text>
          .
        </TipCard>

        <InfoSection
          title="Contact Information"
          description={CONTACT_DESCRIPTION}
        >
          <FormCard>
            <Input
              label="Google Voice Number"
              type="phone"
              value={contactValues.googleVoicePhone}
              onChangeText={(next) => setContactField('googleVoicePhone', next)}
              onBlur={() => submitContactField('googleVoicePhone')}
              placeholder="(123) 456-7890"
              error={contactFieldError.googleVoicePhone}
              rightAccessory={
                <FieldStatusIcon status={contactFieldStatus.googleVoicePhone} />
              }
              leftAccessory={
                isFilled(contactValues.googleVoicePhone) ? (
                  <GoogleVoiceIcon />
                ) : (
                  <GoogleVoiceIconMono color={emptyIconColor} />
                )
              }
            />
            {/* <Input
              label="WhatsApp Number"
              type="phone"
              value={contactValues.whatsAppPhone}
              onChangeText={(next) => setContactField('whatsAppPhone', next)}
              onBlur={() => submitContactField('whatsAppPhone')}
              placeholder="(123) 456-7890"
              error={contactFieldError.whatsAppPhone}
              rightAccessory={
                <FieldStatusIcon status={contactFieldStatus.whatsAppPhone} />
              }
              leftAccessory={
                isFilled(contactValues.whatsAppPhone) ? (
                  <WhatsAppIcon />
                ) : (
                  <WhatsAppIconMono />
                )
              }
            /> */}
            <Input
              label="Instagram Handle"
              value={contactValues.instagramHandle}
              onChangeText={(next) => setContactField('instagramHandle', next)}
              onBlur={() => submitContactField('instagramHandle')}
              placeholder="handle"
              autoCapitalize="none"
              autoCorrect={false}
              error={contactFieldError.instagramHandle}
              leftAccessory={renderHandleAccessory(
                isFilled(contactValues.instagramHandle) ? (
                  <InstagramIcon />
                ) : (
                  <InstagramIconMono />
                ),
              )}
              rightAccessory={
                <FieldStatusIcon status={contactFieldStatus.instagramHandle} />
              }
            />
            <Input
              label="Telegram"
              value={contactValues.telegramHandle}
              onChangeText={(next) => setContactField('telegramHandle', next)}
              onBlur={() => submitContactField('telegramHandle')}
              placeholder="handle"
              autoCapitalize="none"
              autoCorrect={false}
              error={contactFieldError.telegramHandle}
              leftAccessory={renderHandleAccessory(
                isFilled(contactValues.telegramHandle) ? (
                  <TelegramIcon />
                ) : (
                  <TelegramIconMono color={emptyIconColor} />
                ),
              )}
              rightAccessory={
                <FieldStatusIcon status={contactFieldStatus.telegramHandle} />
              }
            />
            <Input
              label="Snapchat"
              value={contactValues.snapchatHandle}
              onChangeText={(next) => setContactField('snapchatHandle', next)}
              onBlur={() => submitContactField('snapchatHandle')}
              placeholder="handle"
              autoCapitalize="none"
              autoCorrect={false}
              error={contactFieldError.snapchatHandle}
              leftAccessory={renderHandleAccessory(
                isFilled(contactValues.snapchatHandle) ? (
                  <SnapchatIcon />
                ) : (
                  <SnapchatIconMono color={emptyIconColor} />
                ),
              )}
              rightAccessory={
                <FieldStatusIcon status={contactFieldStatus.snapchatHandle} />
              }
            />
            <Input
              label="Signal (profile link)"
              value={contactValues.signalPhone}
              onChangeText={(next) => setContactField('signalPhone', next)}
              onBlur={() => submitContactField('signalPhone')}
              placeholder='https://signal.me/#eu/ "link"'
              autoCapitalize="none"
              autoCorrect={false}
              error={contactFieldError.signalPhone}
              leftAccessory={
                isFilled(contactValues.signalPhone) ? (
                  <SignalIcon />
                ) : (
                  <SignalIconMono color={emptyIconColor} />
                )
              }
              rightAccessory={
                <FieldStatusIcon status={contactFieldStatus.signalPhone} />
              }
            />

            <Text className="text-tk-text-tertiary px-1 font-lexend-regular text-caption leading-4">
              {CONTACT_FOOTER_PROMPT}
              <Text className="text-tk-text-informational">
                support@buzzkeepr.com
              </Text>
              .
            </Text>

            <View className="bg-tk-bg-secondary gap-6 rounded-5 p-4">
              <Text className="text-tk-text-secondary font-lexend-regular text-footnote uppercase leading-[18px]">
                Privacy Settings
              </Text>

              {profileShared ? (
                <PrivacyOptionRow
                  badgeLabel={connectionsOn ? 'connections only' : 'private'}
                  title={
                    connectionsOn
                      ? 'Share with connections'
                      : 'Contact info hidden'
                  }
                  description={
                    connectionsOn
                      ? 'Share my contact information with my connections in the Buzz Badge Community.'
                      : 'Toggle on to share your contact information with your connections in the Buzz Badge Community.'
                  }
                  value={connectionsOn}
                  onChange={onConnectionsChange}
                  disabled={!hasContactInfo}
                />
              ) : (
                <DisabledSettingHint requiredSetting="Profile" />
              )}
            </View>
          </FormCard>
        </InfoSection>
      </KeyboardAwareScrollView>

      <AvatarPickerSheet
        visible={avatarPickerOpen}
        onClose={closeAvatarPicker}
        onSelect={handleAvatarSelected}
        currentImageUrl={imageUrl}
      />
    </View>
  );
};
