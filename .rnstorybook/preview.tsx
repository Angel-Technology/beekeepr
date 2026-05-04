import type { Preview } from '@storybook/react-native';
import { Text, View } from 'react-native';

import '../global.css';

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <View className="flex-1 gap-md bg-bg-default p-lg">
        <View className="gap-1">
          <Text className="font-poppins-semiBold text-300 text-text-secondary">
            {context.title}
          </Text>
          <Text className="font-poppins-semiBold text-500 text-text-default">
            {context.name}
          </Text>
        </View>
        <View className="flex-1 items-center justify-center">
          <Story />
        </View>
      </View>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
};

export default preview;
