import { useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import SadBee from '@src/assets/svg/SadBee';
import { Card, CompactButton, DetailCard } from '@components';
import { useErrorModal } from '@src/lib/error-modal';

const HEADLINE = 'Survivor Support';
const BODY =
  'Anonymous help and resources for victims of sexual assault and domestic violence.';

const RAINN_URL = 'https://online.rainn.org';

const HotlineLink = ({ text, url }: { text: string; url: string }) => {
  const errorModal = useErrorModal();
  const handlePress = useCallback(async () => {
    try {
      await Linking.openURL(url);
    } catch (error) {
      errorModal.showFromError(error, 'Could not open link');
    }
  }, [errorModal, url]);

  return (
    <Text
      accessibilityRole="link"
      onPress={handlePress}
      className="flex-1 font-lexend-regular text-base leading-5 text-text-secondary underline"
    >
      {text}
    </Text>
  );
};

const ITEM_TEXT_CLASSNAME = 'font-lexend-regular text-base leading-5';
const TITLE_CLASSNAME =
  'font-lexend-regular text-base leading-5 text-text-default';

export const SurvivorSupportExploreCard = () => {
  return (
    <Card className="gap-6 rounded-xl p-6">
      <View className="gap-2">
        <Text className="font-poppins-semiBold text-xl text-text-default">
          {HEADLINE}
        </Text>
        <View className="flex-row items-end gap-3">
          <View className="flex-1 gap-4">
            <Text className="font-lexend-regular text-base leading-5 text-text-weak">
              {BODY}
            </Text>
            <CompactButton label="Coming soon..." variant="tinted" />
          </View>
          <SadBee width={120} height={117} />
        </View>
      </View>

      <DetailCard
        tone="brand"
        title="National Sexual Assault Hotline 24/7"
        titleClassName={TITLE_CLASSNAME}
        itemTextClassName={ITEM_TEXT_CLASSNAME}
        items={[
          '1 (800) 656-4673',
          {
            id: 'rainn',
            label: <HotlineLink text="online.rainn.org" url={RAINN_URL} />,
          },
        ]}
      />

      <DetailCard
        tone="brand"
        title="National Domestic Violence Hotline 24/7"
        titleClassName={TITLE_CLASSNAME}
        itemTextClassName={ITEM_TEXT_CLASSNAME}
        items={['1 (800) 799-SAFE (7233)', 'Or text START (88788)']}
      />
    </Card>
  );
};
