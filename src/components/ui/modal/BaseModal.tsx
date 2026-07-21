import type { ReactNode } from 'react';
import clsx from 'clsx';
import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  useColorScheme,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type BaseModalProps = {
  visible: boolean;
  children: ReactNode;
  dismissOnBackdropPress?: boolean;
  onRequestClose?: () => void;
  contentClassName?: string;
  backdropBlur?: boolean;
};

export const BaseModal = ({
  visible,
  children,
  dismissOnBackdropPress = false,
  onRequestClose,
  contentClassName,
  backdropBlur = true,
}: BaseModalProps) => {
  const isDark = useColorScheme() === 'dark';

  const handleBackdropPress = () => {
    if (!dismissOnBackdropPress) {
      return;
    }

    onRequestClose?.();
  };

  return (
    <Modal
      animationType="fade"
      visible={visible}
      transparent
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <View style={{ flex: 1 }}>
        {backdropBlur ? (
          Platform.OS === 'ios' ? (
            <BlurView
              intensity={40}
              tint={!isDark ? 'dark' : 'light'}
              style={StyleSheet.absoluteFill}
            />
          ) : (
            // Android fallback: expo-blur's `dimezisBlurView` requires a
            // `blurTarget` ref to the underlying view, which isn't
            // reachable from a fullscreen `<Modal>` backdrop. A darker
            // solid overlay reads similarly and skips the frame-cost of
            // software blur.
            <View style={StyleSheet.absoluteFill} className="bg-black/60" />
          )
        ) : null}
        <KeyboardAwareScrollView
          className={backdropBlur ? 'bg-black/20' : 'bg-black/70'}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={150}
        >
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={handleBackdropPress}
          />
          <View
            className={clsx(
              'w-full max-w-[360px] rounded-5 bg-tk-bg-primary p-lg',
              contentClassName,
            )}
          >
            {children}
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Modal>
  );
};
