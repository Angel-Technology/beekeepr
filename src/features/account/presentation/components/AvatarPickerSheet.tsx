import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SvgUri } from 'react-native-svg';
import { UserRound } from 'lucide-react-native';
import clsx from 'clsx';

import { BaseBottomSheet, CompactButton } from '@components';
import { themedColors, useThemedColor } from '@common';

/**
 * DiceBear styles offered in the picker. Adventurer leads (product
 * default) and the rest are an opinionated cross-section of the v9
 * library covering illustration, emoji, pixel, and abstract looks. To
 * add a new style: (1) include it here, (2) confirm the slug matches
 * `api.dicebear.com/9.x/{slug}/svg`.
 */
const STYLES: ReadonlyArray<{
  readonly id: AvatarStyle;
  readonly label: string;
}> = [
  { id: 'open-peeps', label: 'Peeps' },
  { id: 'notionists', label: 'Notion' },
  { id: 'micah', label: 'Micah' },
  { id: 'avataaars', label: 'Cartoon' },
  { id: 'bottts', label: 'Robots' },
  { id: 'bottts-neutral', label: 'Bots' },
  { id: 'lorelei', label: 'Lorelei' },
  { id: 'adventurer', label: 'Adventurer' },
  { id: 'fun-emoji', label: 'Emoji' },
  { id: 'pixel-art', label: 'Pixel' },
  { id: 'croodles', label: 'Croodles' },
];

type AvatarStyle =
  | 'adventurer'
  | 'avataaars'
  | 'croodles'
  | 'fun-emoji'
  | 'bottts'
  | 'open-peeps'
  | 'bottts-neutral'
  | 'pixel-art'
  | 'lorelei'
  | 'micah'
  | 'notionists';

// 20 tiles per style — enough variety to feel browsable without blowing
// the SVG fetch budget too hard. The grid scrolls vertically inside the
// sheet so tile size stays comfortable on small devices.
const GRID_SIZE = 20;
const TILE_SIZE = 64;
const PREVIEW_SIZE = 144;

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
  /**
   * The signed-in user's current avatar URL. Surfaces as the preview
   * image until they tap a tile, so the sheet opens with their existing
   * avatar rather than a blank placeholder.
   */
  currentImageUrl?: string | null;
};

/**
 * Bottom-sheet avatar picker. Built on `BaseBottomSheet` (gorhom) so the
 * surface, handle, backdrop, and swipe-to-dismiss come for free.
 *
 * Layout — top to bottom:
 *   1. Header with title + close (provided by `BaseBottomSheet`).
 *   2. 144×144 preview of the currently-selected avatar, centered.
 *      Placeholder until the user taps a tile.
 *   3. Horizontal style strip (12 DiceBear styles).
 *   4. Vertically-scrollable grid of `GRID_SIZE` (20) avatars in the
 *      active style, inside a `BottomSheetScrollView` so vertical
 *      drags still propagate to the sheet handle for swipe-to-close.
 *   5. Footer with Shuffle + Save, pinned outside the scroll region.
 */
export const AvatarPickerSheet = ({
  visible,
  onClose,
  onSelect,
  currentImageUrl,
}: AvatarPickerSheetProps) => {
  const insets = useSafeAreaInsets();
  const placeholderIconColor = useThemedColor(themedColors.text.tertiary);
  const [style, setStyle] = useState<AvatarStyle>('adventurer');
  // Seeds live in state so "Shuffle" re-renders the grid with fresh URLs
  // — and so a switch between styles keeps the same seeds for a
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

  // Clear the in-flight selection whenever the sheet dismisses so the
  // next open shows the user's actual avatar in the preview slot,
  // not the seed they tapped-and-walked-away-from. Wrapping the
  // caller's `onClose` covers every dismiss path (X tap, swipe-down,
  // backdrop tap, post-save).
  const handleClose = () => {
    setSelectedSeed(null);
    onClose();
  };

  const avatarUrls = useMemo(
    () => seeds.map((seed) => ({ seed, url: buildAvatarUrl(style, seed) })),
    [seeds, style],
  );

  // Preview priority: the seed the user just tapped → their existing
  // profile avatar → `UserRound` placeholder. The middle step matters
  // most on open: the sheet should feel like an edit, not a reset.
  const previewUrl = selectedSeed
    ? buildAvatarUrl(style, selectedSeed)
    : currentImageUrl && currentImageUrl.length > 0
      ? currentImageUrl
      : null;

  return (
    <BaseBottomSheet
      visible={visible}
      onClose={handleClose}
      title="Choose Avatar"
      snapPoints={['90%']}
    >
      <View className="flex-1 gap-6 pt-2">
        <View className="items-center px-6">
          <View
            className="items-center justify-center overflow-hidden rounded-round bg-tk-bg-elevated-secondary"
            style={{ width: PREVIEW_SIZE, height: PREVIEW_SIZE }}
          >
            {previewUrl ? (
              <SvgUri
                uri={previewUrl}
                width={PREVIEW_SIZE}
                height={PREVIEW_SIZE}
              />
            ) : (
              <UserRound size={56} color={placeholderIconColor} />
            )}
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flexGrow: 0 }}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 0 }}
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

        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 8 }}
          showsVerticalScrollIndicator={false}
        >
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
        </BottomSheetScrollView>
      </View>

      <View
        className="w-full flex-row items-center justify-center gap-2 px-6 py-4"
        style={{ paddingBottom: insets.bottom }}
      >
        <View className="flex-1">
          <CompactButton label="Shuffle" variant="outline" onPress={shuffle} />
        </View>
        <View className="flex-1">
          <CompactButton
            label="Save"
            disabled={selectedSeed === null}
            onPress={handleSave}
          />
        </View>
      </View>
    </BaseBottomSheet>
  );
};
