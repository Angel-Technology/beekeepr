import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Menu, Search as SearchIcon, X } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  AppHeader,
  BOTTOM_TAB_BAR_HEIGHT,
  CompactButton,
  FormCard,
  IconButton,
  Input,
} from '@components';
import { InfoSection } from '@features/account';
import { BuzzScreeningDeniedCard } from '@features/home/presentation/components';
import { themedColors, useThemedColor } from '@common';
import { useSearchTab, type SearchGateState } from '../../hooks/useSearchTab';
import { SearchResultsList } from '../components/SearchResultsList';

const GATE_COPY: Record<Exclude<SearchGateState, null>, string> = {
  profile:
    'Create a profile to search for members in the Buzz Badge community.',
  member: 'Only Buzz Badge members have access.',
};

const GATE_CTA: Record<Exclude<SearchGateState, null>, string> = {
  profile: 'Create a profile',
  member: 'Become a member',
};

export const SearchScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const iconColor = useThemedColor(themedColors.text.primary);
  const placeholderColor = useThemedColor(themedColors.text.tertiary);
  const [query, setQuery] = useState('');
  const {
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
  } = useSearchTab(query);

  return (
    <View className="bg-tk-bg-primary flex-1">
      <AppHeader
        topInset={insets.top}
        center={
          <Text className="text-tk-text-primary font-poppins-semiBold text-base">
            Search
          </Text>
        }
        right={
          <IconButton
            accessibilityLabel="Open menu"
            className="border-none bg-transparent"
            icon={<Menu size={24} color={iconColor} />}
            onPress={() => {
              navigation.dispatch(DrawerActions.toggleDrawer());
            }}
          />
        }
      />
      <ScrollView
        className="flex-1"
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{
          paddingHorizontal: 24,
          paddingTop: 8,
          paddingBottom: BOTTOM_TAB_BAR_HEIGHT + insets.bottom + 16,
          gap: 24,
        }}
      >
        {isDenied ? (
          <BuzzScreeningDeniedCard onAppealDecision={onAppealDecision} />
        ) : null}
        <InfoSection title="BUZZ BADGE COMMUNITY">
          <FormCard>
            <Input
              label="Search members"
              placeholder="@handle123, Nickname 123"
              value={query}
              onChangeText={setQuery}
              disabled={isSearchDisabled}
              autoCapitalize="none"
              autoCorrect={false}
              leftAccessory={<SearchIcon size={20} color={placeholderColor} />}
              rightAccessory={
                !isSearchDisabled && query.length > 0 ? (
                  <TouchableOpacity
                    accessibilityLabel="Clear search"
                    onPress={() => setQuery('')}
                    hitSlop={8}
                  >
                    <X size={20} color={iconColor} />
                  </TouchableOpacity>
                ) : undefined
              }
            />
            {gateState ? (
              <>
                <Text
                  className="text-tk-text-secondary font-lexend-regular text-base leading-6"
                  style={{ letterSpacing: -0.3 }}
                >
                  {GATE_COPY[gateState]}
                </Text>
                <CompactButton
                  label={GATE_CTA[gateState]}
                  onPress={onGatePress}
                />
              </>
            ) : null}
          </FormCard>
        </InfoSection>
        {isSearchDisabled ? null : (
          <SearchResultsList
            query={query}
            results={results}
            isLoading={isLoading}
            cancelPendingId={cancelPendingId}
            onPressUser={onPressUser}
            onUnsendInvite={onUnsendInvite}
          />
        )}
      </ScrollView>
    </View>
  );
};
