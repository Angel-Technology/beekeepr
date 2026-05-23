import { Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppHeader, FormCard, IconButton, Input } from '@components';
import { useAuthSession } from '@features/auth';
import { useProfileForm } from '../../hooks/useProfileForm';
import { ProfilePreviewCard } from '../components/ProfilePreviewCard';

const PREVIEW_DESCRIPTION =
  'This is what others will see when searching for you in TheBuzz community.';

const JOINED_DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

const formatJoinedDate = (iso?: string | null): string | undefined => {
  if (!iso) {
    return undefined;
  }
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return undefined;
  }
  return JOINED_DATE_FORMATTER.format(date);
};

export const ProfileScreen = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { data: user } = useAuthSession();
  const { values, setField, submitField } = useProfileForm(user ?? null);

  const joinedDate = formatJoinedDate(user?.createdAtUtc);

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
        bottomOffset={24}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-1 px-1">
          <Text className="font-lexend-semiBold text-base leading-6 text-text-default">
            Preview
          </Text>
          <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
            {PREVIEW_DESCRIPTION}
          </Text>
        </View>

        <ProfilePreviewCard
          nickname={values.nickname}
          handle={values.handle}
          imageUrl={user?.imageUrl}
          joinedDate={joinedDate}
        />

        <FormCard>
          <Input
            label="Nickname"
            value={values.nickname}
            onChangeText={(next) => setField('nickname', next)}
            onBlur={() => submitField('nickname')}
            placeholder="Your nickname"
          />
          <Input
            label="Handle"
            value={values.handle}
            onChangeText={(next) => setField('handle', next)}
            onBlur={() => submitField('handle')}
            placeholder="@yourhandle"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </FormCard>
      </KeyboardAwareScrollView>
    </View>
  );
};
