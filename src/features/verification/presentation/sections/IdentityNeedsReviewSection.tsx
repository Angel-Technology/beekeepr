import { Text, View } from 'react-native';
import { Button } from '@components';

type IdentityNeedsReviewSectionProps = {
  onGoHome: () => void;
};

/**
 * Body shown when Persona has flagged the inquiry for manual review.
 * Unlike `waiting`, this is not a transient state — a human at Persona
 * has to look at the submission, which can take hours or days. We tell the
 * user they can close the app; the next session refresh (or a notification,
 * once we wire that) will route them past this screen.
 */
export const IdentityNeedsReviewSection = ({
  onGoHome,
}: IdentityNeedsReviewSectionProps) => {
  return (
    <View className="w-full flex-1 items-center justify-center gap-4 px-lg">
      <Text className="text-center font-poppins-semiBold text-title-4 text-tk-text-primary">
        We’re reviewing your verification
      </Text>
      <Text className="text-center font-lexend-regular text-base text-tk-text-secondary">
        Our verification partner is taking a closer look at your submission.
        This usually finishes within a day. We’ll let you know when it’s done.
      </Text>
      <View className="mt-6 w-full">
        <Button
          label="Back to home"
          className="self-stretch"
          onPress={onGoHome}
        />
      </View>
    </View>
  );
};
