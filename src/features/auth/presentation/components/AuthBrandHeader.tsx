import { View } from 'react-native';

import AppHeaderLineBuzz from '@src/assets/svg/AppHeaderLineBuzz';
import LogoBuzzkeepr from '@src/assets/svg/LogoBuzzkeepr';

export const AuthBrandHeader = () => {
  return (
    <View className="relative flex items-center justify-around self-stretch">
      <View className="">
        <LogoBuzzkeepr width={300} height={65.782} />
      </View>
      <View className="absolute top-px -z-10">
        <AppHeaderLineBuzz />
      </View>
    </View>
  );
};
