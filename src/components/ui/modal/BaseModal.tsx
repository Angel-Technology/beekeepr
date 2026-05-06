import type { ReactNode } from 'react';
import clsx from 'clsx';
import { Modal, Pressable, View } from 'react-native';

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
      <View className="flex-1 items-center justify-center bg-black/70 px-lg">
        <Pressable className="absolute inset-0" onPress={handleBackdropPress} />
        <View
          className={clsx(
            'w-full max-w-[360px] rounded-5 bg-bg-default p-lg',
            contentClassName,
          )}
        >
          {children}
        </View>
      </View>
    </Modal>
  );
};
