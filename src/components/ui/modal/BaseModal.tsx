import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Modal, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

type BaseModalProps = {
  visible: boolean;
  children: ReactNode;
  dismissOnBackdropPress?: boolean;
  onRequestClose?: () => void;
  contentClassName?: string;
};

export const BaseModal = ({
  visible,
  children,
  dismissOnBackdropPress = false,
  onRequestClose,
  contentClassName,
}: BaseModalProps) => {
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
      <KeyboardAwareScrollView
        // Scrolls the focused input above the keyboard. `flexGrow: 1` +
        // `justifyContent: 'center'` keeps the modal centered when content
        // fits the viewport; once the keyboard opens, the scroll view
        // shifts the focused input into view automatically.
        className="bg-black/70"
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        bottomOffset={24}
      >
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
        />
        <View
          className={clsx(
            'w-full max-w-[360px] rounded-5 bg-bg-default p-lg',
            contentClassName,
          )}
        >
          {children}
        </View>
      </KeyboardAwareScrollView>
    </Modal>
  );
};
