import type { ReactNode } from 'react';
import clsx from 'clsx';
import {
  Modal,
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
  backdropBlur = false,
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
          <BlurView
            intensity={10}
            tint={isDark ? 'dark' : 'light'}
            style={StyleSheet.absoluteFill}
          />
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
              'bg-tk-bg-elevated-primary w-full max-w-[360px] rounded-5 p-lg',
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
