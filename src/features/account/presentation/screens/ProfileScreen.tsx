import { useState } from 'react';
import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useNavigation, useRouter } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { AtSign, ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, Divider, FormCard, IconButton, Input } from '@components';
import { useAuthSession } from '@features/auth';
import { useProfileForm } from '../../hooks/useProfileForm';
import { FieldStatusIcon } from '../components/FieldStatusIcon';
import { InfoSection } from '../components/InfoSection';
import { PrivacyOptionRow } from '../components/PrivacyOptionRow';
import { ProfilePreviewCard } from '../components/ProfilePreviewCard';
import { TipCard } from '../components/TipCard';

const PROFILE_DESCRIPTION =
  'Customize your name and handle. This is what others will see when searching for you in the Buzz Badge Community.';

const CONTACT_DESCRIPTION =
  'This is not required. It’s up to you if you want to share any contact information. Only add contact information you’d want to share with others.';

const HANDLE_HELPER =
  'Your nickname and handle must be unique and can be a combination of letters, numbers and emojis.';

const CONTACT_FOOTER_PROMPT =
  'Don’t see what you’re looking for? Please let us know! Send feedback to ';

type ProfileVisibility = 'public' | 'private';
type ContactSharing = 'everyone' | 'connections' | 'none';

export const ProfileScreen = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { data: user } = useAuthSession();
  const { values, setField, submitField, fieldStatus } = useProfileForm(
    user ?? null,
  );

  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? '');
  const [googleVoice, setGoogleVoice] = useState('');
  const [whatsApp, setWhatsApp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [telegram, setTelegram] = useState('');
  const [signal, setSignal] = useState('');

  const [profileVisibility, setProfileVisibility] =
    useState<ProfileVisibility>('public');
  const [contactSharing, setContactSharing] =
    useState<ContactSharing>('connections');

  const openProfileDrawer = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  return (
    <View className="flex-1 bg-bg-default">
      <AppHeader
        topInset={insets.top}
        left={
          <IconButton
            accessibilityLabel="Go back"
            className="border-none bg-transparent"
            icon={<ChevronLeft size={24} strokeWidth={2.2} color="#000000" />}
            onPress={() => router.back()}
          />
        }
        center={
          <Text className="font-poppins-semiBold text-base text-text-default">
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
          <ProfilePreviewCard
            nickname={values.nickname}
            handle={values.handle}
            onPress={openProfileDrawer}
          />
        </InfoSection>

        <InfoSection title="Profile" description={PROFILE_DESCRIPTION}>
          <FormCard>
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
              leftAccessory={<AtSign size={16} />}
              rightAccessory={<FieldStatusIcon status={fieldStatus.handle} />}
            />
            <Text className="px-1 font-lexend-regular text-caption leading-4 text-text-tertiary">
              {HANDLE_HELPER}
            </Text>

            <View className="gap-6 rounded-5 bg-bg-weak p-4">
              <Text className="font-lexend-regular text-footnote uppercase leading-[18px] text-text-secondary">
                Privacy Settings
              </Text>
              <View className="gap-4">
                <PrivacyOptionRow
                  badgeLabel="public"
                  title="Public Profile"
                  description="Allow Buzz Badge members to search for you and see your profile in the Buzz Badge Community."
                  value={profileVisibility === 'public'}
                  onChange={(next) =>
                    setProfileVisibility(next ? 'public' : 'private')
                  }
                />
                <Divider />
                <PrivacyOptionRow
                  badgeLabel="private"
                  title="Private Profile"
                  description="Toggle on to remove your profile from the Buzz Badge Community."
                  value={profileVisibility === 'private'}
                  onChange={(next) =>
                    setProfileVisibility(next ? 'private' : 'public')
                  }
                />
              </View>
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
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholder="(123) 456-7890"
            />
            <Input
              label="Google Voice Number"
              type="phone"
              value={googleVoice}
              onChangeText={setGoogleVoice}
              placeholder="(123) 456-7890"
            />
            <Input
              label="WhatsApp Number"
              type="phone"
              value={whatsApp}
              onChangeText={setWhatsApp}
              placeholder="(123) 456-7890"
            />
            <Input
              label="Instagram Handle"
              value={instagram}
              onChangeText={setInstagram}
              placeholder="@handle"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Input
              label="Telegram"
              type="phone"
              value={telegram}
              onChangeText={setTelegram}
              placeholder="(123) 456-7890"
            />
            <Input
              label="Signal"
              type="phone"
              value={signal}
              onChangeText={setSignal}
              placeholder="(123) 456-7890"
            />

            <Text className="px-1 font-lexend-regular text-caption leading-4 text-text-tertiary">
              {CONTACT_FOOTER_PROMPT}
              <Text className="text-text-informational">
                support@buzzkeepr.com
              </Text>
              .
            </Text>

            <View className="gap-6 rounded-5 bg-bg-weak p-4">
              <Text className="font-lexend-regular text-footnote uppercase leading-[18px] text-text-secondary">
                Privacy Settings
              </Text>
              <View className="gap-3">
                <PrivacyOptionRow
                  badgeLabel="public"
                  title="Share with everyone"
                  description="Toggle on to share your contact information with anyone in the Buzz Badge Community."
                  value={contactSharing === 'everyone'}
                  onChange={(next) =>
                    setContactSharing(next ? 'everyone' : 'none')
                  }
                />
                <Divider />
                <PrivacyOptionRow
                  badgeLabel="connections only"
                  title="Share with connections"
                  description="Only share with my connections in the Buzz Badge Community."
                  value={contactSharing === 'connections'}
                  onChange={(next) =>
                    setContactSharing(next ? 'connections' : 'none')
                  }
                />
                <Divider />
                <PrivacyOptionRow
                  badgeLabel="private"
                  title="Don’t share my contact information"
                  value={contactSharing === 'none'}
                  onChange={(next) =>
                    setContactSharing(next ? 'none' : 'connections')
                  }
                />
              </View>
            </View>
          </FormCard>
        </InfoSection>
      </KeyboardAwareScrollView>
    </View>
  );
};
