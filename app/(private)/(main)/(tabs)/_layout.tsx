import IntroBeeIcon from '@src/assets/svg/IntroBeeIcon';
import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { BookSearch, HeartHandshake } from 'lucide-react-native';

const iconSize = 22;

export default function PrivateTabsLayout() {
  return (
    <NativeTabs
      minimizeBehavior="onScrollDown"
      tintColor={'#000000'}
      labelStyle={{
        color: '#000000',
      }}
      blurEffect="systemChromeMaterial"
      disableTransparentOnScrollEdge
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'house', selected: 'house.fill' }}
          src={{
            default: (
              <IntroBeeIcon
                width={iconSize}
                height={iconSize}
                color="#6B7280"
              />
            ),
            selected: (
              <IntroBeeIcon
                width={iconSize}
                height={iconSize}
                color="#000000"
              />
            ),
          }}
          renderingMode="original"
        />
        <NativeTabs.Trigger.Label>TheBuzz</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="search-records" role="search" disablePopToTop>
        <NativeTabs.Trigger.Icon
          sf={{ default: 'magnifyingglass', selected: 'magnifyingglass' }}
          src={{
            default: (
              <BookSearch color="#6B7280" size={iconSize} strokeWidth={2.2} />
            ),
            selected: (
              <BookSearch color="#000000" size={iconSize} strokeWidth={2.2} />
            ),
          }}
          renderingMode="original"
        />
        <NativeTabs.Trigger.Label>Search</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Icon
          sf={{ default: 'heart', selected: 'heart.fill' }}
          src={{
            default: (
              <HeartHandshake
                color="#6B7280"
                size={iconSize}
                strokeWidth={2.2}
              />
            ),
            selected: (
              <HeartHandshake
                color="#000000"
                size={iconSize}
                strokeWidth={2.2}
              />
            ),
          }}
          renderingMode="original"
        />
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
