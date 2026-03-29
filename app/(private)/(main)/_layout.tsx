import { Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';

function PlaceholderDrawerContent() {
  return (
    <View className="flex-1 items-center justify-center gap-md bg-bg-default p-md">
      <Text className="font-poppins-semiBold text-600 text-text-default">
        Menu coming soon
      </Text>
      <Text className="font-sourceSans-regular text-base text-text-secondary">
        Place drawer actions here Sam
      </Text>
    </View>
  );
}

export default function PrivateDrawerLayout() {
  return (
    <Drawer
      drawerContent={() => <PlaceholderDrawerContent />}
      screenOptions={{
        headerShown: false,
        drawerType: 'slide',
        drawerPosition: 'right',
        sceneStyle: {
          backgroundColor: '#FFFFFF',
        },
      }}
    >
      <Drawer.Screen
        name="(tabs)"
        options={{
          drawerLabel: 'Home',
          title: 'Home',
        }}
      />
    </Drawer>
  );
}
