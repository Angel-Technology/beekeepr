import { useCallback } from 'react';
import { Linking, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { appImages } from '@assets/images';
import { Card, DetailCard, Pill } from '@components';
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
      className="flex-1 font-lexend-regular text-sm leading-5 text-text-secondary underline"
    >
      {text}
    </Text>
  );
};

const ITEM_TEXT_CLASSNAME = 'font-lexend-regular text-sm leading-5';
const TITLE_CLASSNAME =
  'font-lexend-regular text-sm leading-5 text-text-default';

export const SurvivorSupportExploreCard = () => {
  return (
    <Card tone="brand" className="gap-4 rounded-xl px-4">
      <View className="flex-row items-center gap-3">
        <Image
          source={appImages.awkwardSadBee}
          style={{ width: 104, height: 99 }}
          contentFit="cover"
        />
        <View className="flex-1 gap-4">
          <View className="gap-2">
            <Text className="font-lexend-semiBold text-base leading-tight text-text-default">
              {HEADLINE}
            </Text>
            <Text className="font-lexend-regular text-sm leading-5 text-text-weak">
              {BODY}
            </Text>
          </View>
          <Pill label="More coming soon..." tone="tinted" />
        </View>
      </View>

      <DetailCard
        tone="surface"
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
        tone="surface"
        title="National Domestic Violence Hotline 24/7"
        titleClassName={TITLE_CLASSNAME}
        itemTextClassName={ITEM_TEXT_CLASSNAME}
        items={['1 (800) 799-SAFE (7233)', 'Or text START (88788)']}
      />
    </Card>
  );
};
