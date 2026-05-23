import { Text, View } from 'react-native';
import { Image } from 'expo-image';
import { appImages } from '@assets/images';
import SpeechBubble from '@assets/svg/SpeechBubble';

const BUBBLE_WIDTH = 185;
const BUBBLE_HEIGHT = 110;
const BEE_WIDTH = 161;
const BEE_HEIGHT = 161;

/**
 * Speech-bubble + investigator-bee illustration used to communicate the
 * pre-launch "Coming soon!" state on the read-only criminal search tab.
 * The bee sits slightly behind the bubble's tail so the bubble appears to
 * point at it.
 */
export const ComingSoonOverlay = () => {
  return (
    <View className="h-[180px] w-full flex-row items-center justify-center">
      <View
        className="relative -mt-[100px]"
        style={{
          width: BUBBLE_WIDTH,
          height: BUBBLE_HEIGHT,
        }}
      >
        <SpeechBubble width={BUBBLE_WIDTH} height={BUBBLE_HEIGHT} />
        <View className="absolute inset-0 items-center justify-center pr-3">
          <Text
            style={{ transform: [{ rotate: '5.216deg' }] }}
            className="text-center font-poppins-semiBold text-[26px] leading-[28px] text-text-default"
          >
            {'Coming\nsoon!'}
          </Text>
        </View>
      </View>

      <Image
        source={appImages.investigateBee}
        style={{
          width: BEE_WIDTH,
          height: BEE_HEIGHT,
        }}
        contentFit="contain"
      />
    </View>
  );
};
