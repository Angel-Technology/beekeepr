import { useState, type ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { ChevronLeft, ChevronRight, CircleCheck } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Divider, FormCard, IconButton, Input } from '@components';
import { themedColors, useThemedColor } from '@common';
import {
  ContactVisibility,
  ProfileVisibility,
  useAuthSession,
} from '@features/auth';
import GoogleVoiceIcon from '@assets/svg/GoogleVoiceIcon';
import GoogleVoiceIconMono from '@assets/svg/GoogleVoiceIconMono';
import InstagramIcon from '@assets/svg/InstagramIcon';
import InstagramIconMono from '@assets/svg/InstagramIconMono';
import SignalIcon from '@assets/svg/SignalIcon';
import SignalIconMono from '@assets/svg/SignalIconMono';
import TelegramIcon from '@assets/svg/TelegramIcon';
import TelegramIconMono from '@assets/svg/TelegramIconMono';
import WhatsAppIcon from '@assets/svg/WhatsAppIcon';
import WhatsAppIconMono from '@assets/svg/WhatsAppIconMono';
import { useContactForm } from '../../hooks/useContactForm';
import { useProfileForm } from '../../hooks/useProfileForm';
import { AvatarPickerSheet } from '../components/AvatarPickerSheet';
import { FieldStatusIcon } from '../components/FieldStatusIcon';
import { InfoSection } from '../components/InfoSection';
import { PrivacyOptionRow } from '../components/PrivacyOptionRow';
import { ProfilePreviewCard } from '../components/ProfilePreviewCard';
import { ProfilePreviewHiddenCard } from '../components/ProfilePreviewHiddenCard';
import { TipCard } from '../components/TipCard';

const PROFILE_DESCRIPTION =
  'Customize your name and handle. This is what others will see when searching for you in the Buzz Badge Community.';

const CONTACT_DESCRIPTION =
  'This is not required. It’s up to you if you want to share any contact information. Only add contact information you’d want to share with others.';

const HANDLE_HELPER =
  'Your nickname and handle must be unique and can be a combination of letters, numbers and emojis.';

const CONTACT_FOOTER_PROMPT =
  'Don’t see what you’re looking for? Please let us know! Send feedback to ';

export const ProfileScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: user } = useAuthSession();
  const {
    values,
    setField,
    submitField,
    fieldStatus,
    profileVisibility,
    contactVisibility,
    setProfileVisibility,
    setContactVisibility,
    setImageUrl,
  } = useProfileForm(user ?? null);

  const {
    values: contactValues,
    setField: setContactField,
    submitField: submitContactField,
    fieldError: contactFieldError,
    fieldStatus: contactFieldStatus,
  } = useContactForm(user ?? null);

  const chevronColor = useThemedColor(themedColors.text.primary);
  const atSignColor = useThemedColor(themedColors.text.secondary);
  // Empty-state color for the contact-brand icons. We pass it as the
  // `color` prop on each brand icon, which switches the SVG from its
  // multi-color brand variant to a flat silhouette.
  const emptyIconColor = useThemedColor(themedColors.text.quaternary);

  const profileShared = profileVisibility === ProfileVisibility.Public;
  const connectionsOn =
    contactVisibility === ContactVisibility.Public ||
    contactVisibility === ContactVisibility.ConnectionsOnly;
  const everyoneOn = contactVisibility === ContactVisibility.Public;

  // Nothing to share = nothing to toggle. The share-with switches need at
  // least one contact field filled in, otherwise turning them on would
  // make an empty contact set visible to others.
  const hasContactInfo =
    contactValues.phoneNumber.trim().length > 0 ||
    contactValues.googleVoicePhone.trim().length > 0 ||
    contactValues.whatsAppPhone.trim().length > 0 ||
    contactValues.instagramHandle.trim().length > 0 ||
    contactValues.telegramHandle.trim().length > 0 ||
    contactValues.signalPhone.trim().length > 0;

  const handleProfileSharedChange = (next: boolean) => {
    setProfileVisibility(
      next ? ProfileVisibility.Public : ProfileVisibility.Private,
    );
  };

  const handleConnectionsChange = (next: boolean) => {
    // Off → always PRIVATE (forces Everyone off too).
    if (!next) {
      setContactVisibility(ContactVisibility.Private);
      return;
    }
    // On — bump to CONNECTIONS_ONLY unless Everyone is already on.
    if (contactVisibility === ContactVisibility.Private) {
      setContactVisibility(ContactVisibility.ConnectionsOnly);
    }
  };

  const handleEveryoneChange = (next: boolean) => {
    // On → PUBLIC implicitly turns Connections on too.
    // Off → drop one rung to CONNECTIONS_ONLY, preserving the Connections
    // switch position the user just had.
    setContactVisibility(
      next ? ContactVisibility.Public : ContactVisibility.ConnectionsOnly,
    );
  };

  const openProfileDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  // Avatar-picker sheet is local UI state — opens over the profile screen
  // and slides back down on save / dismiss. The picked DiceBear URL goes
  // straight into `setImageUrl` which fires the `updateProfile` mutation.
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const openAvatarPicker = () => setAvatarPickerOpen(true);
  const handleAvatarSelected = (avatarUrl: string) => {
    setImageUrl(avatarUrl);
    setAvatarPickerOpen(false);
  };

  // Contact-icon swap: the user-typed value picks which component
  // renders — the colored brand icon when filled, the Figma "Black
  // Default" mono variant when empty. The mono variants take a `color`
  // prop wired to themed `tk-text-quaternary` so they read as inactive
  // in both light and dark themes. Trimmed check so a whitespace-only
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
            onPress={() => router.back()}
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
        <InfoSection title="Preview">
          {profileShared ? (
            <ProfilePreviewCard
              nickname={values.nickname}
              handle={values.handle}
              imageUrl={user?.imageUrl ?? null}
              onPress={openProfileDrawer}
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
              {user?.imageUrl ? (
                <CircleCheck size={24} color="#00A93E" />
              ) : null}
              <ChevronRight size={24} color={chevronColor} />
            </TouchableOpacity>

            <Input
              label="Nickname"
              value={values.nickname}
              onChangeText={(next) => setField('nickname', next)}
              onBlur={() => submitField('nickname')}
              placeholder="Nickname 123"
              rightAccessory={<FieldStatusIcon status={fieldStatus.nickname} />}
            />
            <Input
              label="Handle"
              value={values.handle}
              onChangeText={(next) => setField('handle', next)}
              onBlur={() => submitField('handle')}
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
              rightAccessory={<FieldStatusIcon status={fieldStatus.handle} />}
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
                    : 'Only I can see my profile.'
                }
                value={profileShared}
                onChange={handleProfileSharedChange}
              />
            </View>
          </FormCard>
        </InfoSection>

        <TipCard title="What are we missing?">
          {' Tell us what else you’d want to share with others. Send ideas to '}
          <Text className="text-text-informational">design@buzzkeepr.com</Text>.
        </TipCard>

        <InfoSection
          title="Contact Information"
          description={CONTACT_DESCRIPTION}
        >
          <FormCard>
            <Input
              label="Phone Number"
              type="phone"
              value={contactValues.phoneNumber}
              onChangeText={(next) => setContactField('phoneNumber', next)}
              onBlur={() => submitContactField('phoneNumber')}
              placeholder="(123) 456-7890"
              error={contactFieldError.phoneNumber}
              rightAccessory={
                <FieldStatusIcon status={contactFieldStatus.phoneNumber} />
              }
            />
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
            <Input
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
            />
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
              <Text className="text-text-informational">
                support@buzzkeepr.com
              </Text>
              .
            </Text>

            <View className="bg-tk-bg-secondary gap-6 rounded-5 p-4">
              <Text className="text-tk-text-secondary font-lexend-regular text-footnote uppercase leading-[18px]">
                Privacy Settings
              </Text>
              <View className="gap-3">
                <PrivacyOptionRow
                  showBadge={false}
                  badgeLabel="connections only"
                  title="Share with connections"
                  description="Only share with my connections in the Buzz Badge Community."
                  value={connectionsOn}
                  onChange={handleConnectionsChange}
                  disabled={!hasContactInfo}
                />
                <Divider />
                <PrivacyOptionRow
                  showBadge={false}
                  badgeLabel="public"
                  title="Share with everyone"
                  description="Toggle on to share your contact information with anyone in the Buzz Badge Community."
                  value={everyoneOn}
                  onChange={handleEveryoneChange}
                  disabled={!hasContactInfo}
                />
              </View>
            </View>
          </FormCard>
        </InfoSection>
      </KeyboardAwareScrollView>

      <AvatarPickerSheet
        visible={avatarPickerOpen}
        onClose={() => setAvatarPickerOpen(false)}
        onSelect={handleAvatarSelected}
      />
    </View>
  );
};
