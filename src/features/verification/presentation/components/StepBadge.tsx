import { Text, View } from 'react-native';

type StepBadgeProps = {
  current: number;
  total: number;
};

// `bg-tk-bg-callout` is the soft-yellow callout token — `#FFF8CB` in
// light (matches the Figma's `--bg-secondary` yellow tint) and a muted
// dark grey in dark mode so the badge still reads as a subtle emphasis,
// not a hot color.
export const StepBadge = ({ current, total }: StepBadgeProps) => {
  return (
    <View className="self-start rounded-2 bg-tk-bg-callout px-1.5 py-0.5">
      <Text className="font-lexend-regular text-200 text-tk-text-primary">
        STEP {current} of {total}
      </Text>
    </View>
  );
};
