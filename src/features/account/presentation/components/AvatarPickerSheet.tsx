import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { X } from 'lucide-react-native';
import clsx from 'clsx';

import { CompactButton } from '@components';
import { themedColors, useThemedColor } from '@common';

/**
 * DiceBear styles offered in the picker. Adventurer is the default per
 * product, with three additional styles for variety. To add a new style:
 * (1) include it here, (2) confirm the slug matches `api.dicebear.com/9.x/{slug}/svg`.
 */
const STYLES: ReadonlyArray<{ readonly id: AvatarStyle; readonly label: string }> = [
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'avataaars', label: 'Cartoon' },
  { id: 'big-smile', label: 'Smiley' },
  { id: 'fun-emoji', label: 'Emoji' },
];

type AvatarStyle = 'adventurer' | 'avataaars' | 'big-smile' | 'fun-emoji';

const GRID_SIZE = 8;
const TILE_SIZE = 64;

const buildAvatarUrl = (style: AvatarStyle, seed: string): string =>
  `https://api.dicebear.com/9.x/${style}/svg?seed=${encodeURIComponent(seed)}`;

const randomSeed = (): string => Math.random().toString(36).slice(2, 10);

const generateSeeds = (count: number): ReadonlyArray<string> =>
  Array.from({ length: count }, randomSeed);

type AvatarPickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  /**
   * Fires with the full DiceBear SVG URL the user picked. Caller persists
   * it (typically via `useProfileForm.setImageUrl`) and closes the sheet.
   */
  onSelect: (avatarUrl: string) => void;
};

/**
 * Bottom-sheet avatar picker. Tap "Select Avatar" on the profile screen
 * opens this. The user picks a style, browses a grid of randomly-seeded
 * DiceBear avatars (shuffles regenerate seeds within the active style),
 * then taps Save to commit.
 *
 * Why a styled RN Modal rather than `@gorhom/bottom-sheet`: the app's
 * existing modal surfaces all flow through `BaseModal`, which is the same
 * RN Modal primitive. Reusing the primitive keeps the modal stack
 * behavior consistent and avoids introducing a sheet-provider context
 * just for this one surface.
 */
export const AvatarPickerSheet = ({
  visible,
  onClose,
  onSelect,
}: AvatarPickerSheetProps) => {
  const insets = useSafeAreaInsets();
  const closeIconColor = useThemedColor(themedColors.text.secondary);
  const [style, setStyle] = useState<AvatarStyle>('adventurer');
  // Seeds live in state so "Shuffle" re-renders the grid with fresh URLs
  // — and so a switch between styles can keep the same seeds for a
  // "same-character-different-styles" comparison.
  const [seeds, setSeeds] = useState<ReadonlyArray<string>>(() =>
    generateSeeds(GRID_SIZE),
  );
  const [selectedSeed, setSelectedSeed] = useState<string | null>(null);

  const shuffle = () => {
    setSeeds(generateSeeds(GRID_SIZE));
    setSelectedSeed(null);
  };

  const handleSave = () => {
    if (!selectedSeed) {
      return;
    }
    onSelect(buildAvatarUrl(style, selectedSeed));
  };

  const avatarUrls = useMemo(
    () => seeds.map((seed) => ({ seed, url: buildAvatarUrl(style, seed) })),
    [seeds, style],
  );

  return (
    <Modal
      animationType="slide"
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Pressable className="flex-1 bg-black/70" onPress={onClose} />
        <View
          className="gap-4 rounded-t-5 bg-tk-bg-elevated-primary px-6 pt-6"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="w-full flex-row items-center justify-between">
            <Text className="font-poppins-semiBold text-title-4 text-tk-text-primary">
              Choose Avatar
            </Text>
            <TouchableOpacity
              accessibilityRole="button"
              accessibilityLabel="Close"
              onPress={onClose}
              className="p-1"
            >
              <X size={24} color={closeIconColor} />
            </TouchableOpacity>
          </View>

          {/* Style tabs. Horizontal so it scales if the style list grows
              past what fits on the narrowest device. */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 8 }}
          >
            {STYLES.map((s) => {
              const isActive = s.id === style;
              return (
                <Pressable
                  key={s.id}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isActive }}
                  onPress={() => setStyle(s.id)}
                  className={clsx(
                    'rounded-round border px-4 py-2',
                    isActive
                      ? 'border-tk-text-primary bg-tk-actions-neutral-background-solid'
                      : 'border-tk-border-secondary bg-tk-bg-primary',
                  )}
                >
                  <Text
                    className={clsx(
                      'font-lexend-semiBold text-sm',
                      isActive
                        ? 'text-tk-actions-neutral-text-on-action'
                        : 'text-tk-text-primary',
                    )}
                  >
                    {s.label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* Avatar grid — 4 per row, 2 rows. SvgUri downloads + renders
              the DiceBear SVG inline. */}
          <View className="flex-row flex-wrap justify-between gap-y-3">
            {avatarUrls.map(({ seed, url }) => {
              const isSelected = seed === selectedSeed;
              return (
                <Pressable
                  key={seed}
                  accessibilityRole="button"
                  accessibilityLabel={`Avatar ${seed}`}
                  accessibilityState={{ selected: isSelected }}
                  onPress={() => setSelectedSeed(seed)}
                  className={clsx(
                    'items-center justify-center rounded-round border-2 p-1',
                    isSelected
                      ? 'border-tk-alerts-success'
                      : 'border-transparent',
                  )}
                  style={{ width: TILE_SIZE + 8, height: TILE_SIZE + 8 }}
                >
                  <View
                    className="overflow-hidden rounded-round bg-tk-bg-elevated-secondary"
                    style={{ width: TILE_SIZE, height: TILE_SIZE }}
                  >
                    <SvgUri uri={url} width={TILE_SIZE} height={TILE_SIZE} />
                  </View>
                </Pressable>
              );
            })}
          </View>

          <View className="w-full flex-row gap-2 pt-2">
            <View className="flex-1">
              <CompactButton
                label="Shuffle"
                variant="outline"
                onPress={shuffle}
              />
            </View>
            <View className="flex-1">
              <CompactButton
                label="Save"
                disabled={selectedSeed === null}
                onPress={handleSave}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};
