import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { Check, ChevronDown } from 'lucide-react-native';
import { BaseBottomSheet } from '@components';
import { themedColors, useThemedColor } from '@common';
import { US_STATES } from '../../models/usStates';

type StatePickerFieldProps = {
  label?: string;
  value: string;
  onChange: (name: string) => void;
  placeholder?: string;
};

/**
 * Bottom-sheet state picker styled to match the project's existing
 * `Input` chrome (label on top, value below, chevron-down trailing).
 * Tap opens a `BaseBottomSheet` listing every US state — tap a row to
 * select + close.
 *
 * Value is always the **full name** ("Arizona"). Normalisation of
 * incoming code/name variations happens upstream via
 * `models/usStates.normalizeState`.
 */
export const StatePickerField = ({
  label = 'Select State',
  value,
  onChange,
  placeholder = 'Select State',
}: StatePickerFieldProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const placeholderColor = useThemedColor(themedColors.text.quaternary);
  const valueColor = useThemedColor(themedColors.text.primary);
  const chevronColor = useThemedColor(themedColors.text.primary);
  const checkColor = useThemedColor(themedColors.alerts.success);

  const handleSelect = (name: string) => {
    onChange(name);
    setIsOpen(false);
  };

  const displayValue = value || placeholder;
  const isPlaceholder = value.length === 0;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}, ${value || 'not set'}`}
        onPress={() => setIsOpen(true)}
        className="min-h-[44px] flex-row items-center self-stretch border-b border-tk-border-secondary bg-transparent"
      >
        <View className="flex-1">
          {label ? (
            <Text className="font-lexend-regular text-xs text-tk-text-secondary">
              {label}
            </Text>
          ) : null}
          <Text
            className="font-lexend-regular text-base"
            style={{
              color: isPlaceholder ? placeholderColor : valueColor,
            }}
          >
            {displayValue}
          </Text>
        </View>
        <ChevronDown size={20} color={chevronColor} />
      </Pressable>

      <BaseBottomSheet
        visible={isOpen}
        onClose={() => setIsOpen(false)}
        title={label}
        snapPoints={['90%']}
      >
        <BottomSheetFlatList
          data={[...US_STATES]}
          keyExtractor={(item) => item.code}
          contentContainerStyle={{
            paddingHorizontal: 24,
            paddingBottom: 32,
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => {
            const isSelected = item.name === value;
            return (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                onPress={() => handleSelect(item.name)}
                className="w-full flex-row items-center justify-between border-b border-tk-border-secondary py-4"
              >
                <Text className="font-lexend-regular text-base text-tk-text-primary">
                  {item.name}
                </Text>
                {isSelected ? (
                  <Check size={20} strokeWidth={2.4} color={checkColor} />
                ) : null}
              </Pressable>
            );
          }}
        />
      </BaseBottomSheet>
    </>
  );
};
