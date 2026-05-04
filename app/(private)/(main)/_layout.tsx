import { LogOut } from 'lucide-react-native';
import { Text, View } from 'react-native';
import { Drawer } from 'expo-router/drawer';
import { TabButton } from '@components';
import { useAuthActions } from '@features/auth';

function PlaceholderDrawerContent() {
  const { signOut } = useAuthActions();

  return (
    <View className="flex-1 gap-6 bg-bg-default p-md pt-10">
      <View className="gap-1">
        <Text className="font-poppins-semiBold text-600 text-text-default">
          Account
        </Text>
        <Text className="font-sourceSans-regular text-base text-text-secondary">
          Manage your session and app access.
        </Text>
      </View>

      <TabButton
        tabs={[
          {
            text: 'Log out',
            loading: signOut.isPending,
            leftIcon: <LogOut color="#000000" size={20} strokeWidth={2} />,
            rightIcon: null,
            disabled: signOut.isPending,
            onPress: () => {
              signOut.mutate();
            },
          },
        ]}
      />
      <Text className="font-sourceSans-regular text-sm text-text-weak">
        You can sign back in with Google or email at any time.
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
