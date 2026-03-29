import { View } from 'react-native';

import AppHeaderLineBuzz from '@src/assets/svg/AppHeaderLineBuzz';
import LogoBuzzkeepr from '@src/assets/svg/LogoBuzzkeepr';

export const AuthBrandHeader = () => {
  return (
    <View className="-mx-lg flex items-center self-stretch">
      <LogoBuzzkeepr width={300} height={65.782} />

      <View className="absolute -right-[0.242px] top-[38px] self-stretch">
        <AppHeaderLineBuzz width={300.242} height={80.5} />
      </View>
    </View>
  );
};
