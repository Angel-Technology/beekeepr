import { ActivityIndicator, Text, View } from 'react-native';
import { Search, X } from 'lucide-react-native';
import { Card, IconButton, Input } from '@components';
import { CompleteProfileModal } from '@features/account/presentation/components/CompleteProfileModal';
import { ProfilePreviewCard } from '@features/account/presentation/components/ProfilePreviewCard';
import type {
  FieldStatus,
  UserSearchResult,
} from '@features/account/models/account.types';
import { formatJoinedDate } from '@features/account/models/formatJoinedDate';
import IllustrationBuzzBadge from '@src/assets/svg/IllustrationBuzzBadge';
import { useRevenueCat } from '@src/lib/revenuecat';
import { BuzzTrialCountdownCard } from './BuzzTrialCountdownCard';

type ProfileFormProps = {
  nickname: string;
  handle: string;
  onChangeNickname: (next: string) => void;
  onChangeHandle: (next: string) => void;
  nicknameStatus: FieldStatus;
  handleStatus: FieldStatus;
  handleReason: string | null;
  isValid: boolean;
  isSaving: boolean;
  onSave: () => void;
};

type BuzzWelcomeFlowProps = {
  searchQuery: string;
  searchDebouncedQuery: string;
  searchResults: UserSearchResult[];
  isSearchFetching: boolean;
  onChangeSearchQuery: (next: string) => void;
  isProfileIncomplete: boolean;
  showProfileModal: boolean;
  onOpenProfileModal: () => void;
  profileForm: ProfileFormProps;
};

export const BuzzWelcomeFlow = ({
  searchQuery,
  searchDebouncedQuery,
  searchResults,
  isSearchFetching,
  onChangeSearchQuery,
  isProfileIncomplete,
  showProfileModal,
  onOpenProfileModal,
  profileForm,
}: BuzzWelcomeFlowProps) => {
  const { isOnTrial, trialDaysRemaining } = useRevenueCat();

  const onSearchInputFocus = () => {
    if (isProfileIncomplete) {
      onOpenProfileModal();
    }
  };

  const trimmedQuery = searchQuery.trim();
  const isSearching = trimmedQuery.length > 0;
  // Wait for the debounce to land before swapping the welcome card for
  // results — otherwise we flash stale results between keystrokes.
  const shouldShowResults = isSearching && searchDebouncedQuery.length > 0;
  const hasResults = searchResults.length > 0;

  return (
    <View className="w-full gap-7">
      {isOnTrial && trialDaysRemaining !== null ? (
        <BuzzTrialCountdownCard daysRemaining={trialDaysRemaining} />
      ) : null}

      <View className="w-full gap-2">
        <Text className="font-lexend-regular text-sm leading-5 text-text-default">
          Search TheBuzz Community
        </Text>

        <Input
          value={searchQuery}
          onChangeText={onChangeSearchQuery}
          onFocus={onSearchInputFocus}
          placeholder="Nickname, @name, 123456 (pin)"
          autoCapitalize="none"
          autoCorrect={false}
          leftAccessory={<Search size={20} color="rgba(0,0,0,0.5)" />}
          rightAccessory={
            isSearching ? (
              <IconButton
                accessibilityLabel="Clear search"
                className="size-6 border-none bg-transparent p-0"
                icon={<X size={18} color="rgba(0,0,0,0.5)" />}
                onPress={() => onChangeSearchQuery('')}
              />
            ) : null
          }
        />
      </View>

      {shouldShowResults ? (
        isSearchFetching && !hasResults ? (
          <View className="items-center py-6">
            <ActivityIndicator size="small" color="rgba(0,0,0,0.5)" />
          </View>
        ) : hasResults ? (
          <View className="w-full gap-3">
            {searchResults.map((result) => (
              <ProfilePreviewCard
                key={result.id}
                nickname={result.nickname ?? ''}
                handle={result.handle ?? ''}
                imageUrl={result.imageUrl}
                joinedDate={formatJoinedDate(result.createdAtUtc)}
              />
            ))}
          </View>
        ) : (
          <View className="w-full items-center rounded-5 border border-border-weak bg-bg-default p-5">
            <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
              No matches for &ldquo;{searchDebouncedQuery}&rdquo;.
            </Text>
          </View>
        )
      ) : (
        <Card className="items-center gap-6 rounded-5 border-none" tone="muted">
          <View className="w-full gap-2">
            <Text className="font-lexend-semiBold text-base leading-6 text-text-default">
              Welcome to TheBuzz Community!
            </Text>
            <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
              Did you meet someone online or IRL?
            </Text>
            <Text className="font-lexend-regular text-sm leading-5 text-text-secondary">
              You can find them here, by using the search bar above.
            </Text>
          </View>

          <View className="items-center justify-center">
            <IllustrationBuzzBadge />
          </View>
        </Card>
      )}

      <CompleteProfileModal
        visible={showProfileModal && isProfileIncomplete}
        {...profileForm}
      />
    </View>
  );
};
