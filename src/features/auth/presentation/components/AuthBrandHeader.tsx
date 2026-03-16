import { View } from 'react-native';

import LineBuzz from '@src/assets/svg/LineBuzz';
import LogoBuzzkeepr from '@src/assets/svg/LogoBuzzkeepr';

export const AuthBrandHeader = () => {
  return (
    <View className="-mx-lg flex items-center self-stretch">
      <LogoBuzzkeepr width={300} height={65.782} />

      <View className="absolute -right-[0.242px] top-[18px] self-stretch">
        <LineBuzz width={300.242} height={80.5} />
      </View>
    </View>
  );
};
