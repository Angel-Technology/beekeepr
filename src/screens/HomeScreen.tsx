import { View, Text } from 'react-native';

export function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-blue-900 text-xl font-bold">Beekeepr</Text>
      <Text className="mt-2 text-base text-gray-600">Home Screen</Text>
    </View>
  );
}
