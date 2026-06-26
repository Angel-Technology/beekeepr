import { StyleSheet, useColorScheme } from 'react-native';
import { BlurView } from 'expo-blur';
import { useDrawerProgress } from '@react-navigation/drawer';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';

/**
 * Translucent blur layer that lives inside the drawer navigator and
 * fades in with the drawer's open progress. Sits on top of the screen
 * content but underneath the drawer panel itself, so the visible left
 * corner (the 12% the drawer doesn't cover) blurs in sync with the
 * slide animation. `pointerEvents="none"` so the layer never blocks
 * taps when the drawer is closed.
 */
export const DrawerBlurOverlay = () => {
  const progress = useDrawerProgress();
  const isDark = useColorScheme() === 'dark';

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[StyleSheet.absoluteFill, animatedStyle]}
    >
      <BlurView
        intensity={30}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
    </Animated.View>
  );
};
