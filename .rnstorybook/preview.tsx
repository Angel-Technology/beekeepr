import type { Preview } from '@storybook/react-native';
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown, ChevronRight } from 'lucide-react-native';

import '../global.css';

// Collapsible story header — default collapsed so full-screen sections
// (Congrats, Denied, LearnMore body, etc.) render without a chunk of chrome
// pushing their layout down. Tap the pill to reveal the title / story name.
const StoryHeader = ({ title, name }: { title: string; name: string }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View className="gap-2">
      <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel={
          expanded ? 'Collapse story header' : 'Expand story header'
        }
        onPress={() => setExpanded((prev) => !prev)}
        className="bg-tk-bg-elevated-secondary flex-row items-center gap-1 self-start rounded-round px-3 py-1"
      >
        {expanded ? (
          <ChevronDown size={12} color="#9CA3AF" />
        ) : (
          <ChevronRight size={12} color="#9CA3AF" />
        )}
        <Text className="text-tk-text-tertiary font-poppins-semiBold text-200">
          {name}
        </Text>
      </TouchableOpacity>
      {expanded ? (
        <View className="gap-1">
          <Text className="text-tk-text-secondary font-poppins-semiBold text-300">
            {title}
          </Text>
          <Text className="text-tk-text-primary font-poppins-semiBold text-500">
            {name}
          </Text>
        </View>
      ) : null}
    </View>
  );
};

const preview: Preview = {
  decorators: [
    (Story, context) => (
      <View className="bg-tk-bg-primary flex-1">
        <StoryHeader title={context.title} name={context.name} />
        <View className="flex-1">
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
