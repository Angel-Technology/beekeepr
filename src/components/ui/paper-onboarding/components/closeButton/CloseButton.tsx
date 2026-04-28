import { useMemo, memo } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { styles } from './styles';
import type { CloseButtonProps } from '../../types';

export const CloseButtonComponent = ({
  data,
  safeInsets,
  animatedIndex,
  closeButton,
  closeButtonText,
  closeButtonTextStyle: textStyleOverride,
  onCloseButtonPress,
}: CloseButtonProps) => {
  const showButtonForIndex = useMemo(
    () =>
      data.map(
        (item, index) =>
          index === data.length - 1 || item.showCloseButton === true
      ),
    [data]
  );

  const containerAnimatedStyle = useAnimatedStyle(() => {
    const roundedIndex = Math.round(animatedIndex.value);
    const shouldShow =
      roundedIndex >= 0 && roundedIndex < showButtonForIndex.length
        ? showButtonForIndex[roundedIndex]
        : false;
    return {
      opacity: shouldShow ? 1 : 0,
      pointerEvents: shouldShow ? ('auto' as const) : ('none' as const),
    };
  });

  const containerStyle = useMemo(
    () => [styles.container, { top: safeInsets.top }, containerAnimatedStyle],
    [safeInsets, containerAnimatedStyle]
  );

  const textStyle = useMemo(
    () => [styles.text, textStyleOverride],
    [textStyleOverride]
  );

  return (
    <Animated.View style={containerStyle}>
      {closeButton ? (
        typeof closeButton === 'function' ? (
          closeButton()
        ) : (
          closeButton
        )
      ) : (
        <TouchableOpacity onPress={onCloseButtonPress}>
          <Text style={textStyle}>{closeButtonText}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const CloseButton = memo(CloseButtonComponent);

export default CloseButton;
