import { useMemo, memo } from 'react';
import { Text, Dimensions } from 'react-native';
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import { styles } from './styles';
import type { PageContentProps } from '../../types';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const PageContentComponent = ({
  animatedFocus,
  image,
  title,
  description,
  titleStyle: titleStyleOverride,
  descriptionStyle: descriptionStyleOverride,
}: PageContentProps) => {
  const titleStyle = useMemo(
    () => [styles.title, titleStyleOverride],
    [titleStyleOverride],
  );

  const descriptionStyle = useMemo(
    () => [styles.description, descriptionStyleOverride],
    [descriptionStyleOverride],
  );

  const imageContainerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(
          animatedFocus.value,
          [0, 1],
          [SCREEN_HEIGHT / 8, 0],
          Extrapolation.CLAMP,
        ),
      },
    ],
  }));

  const imageContainerStyle = useMemo(
    () => [styles.imageContainer, imageContainerAnimatedStyle],
    [imageContainerAnimatedStyle],
  );

  return (
    <>
      {image && (
        <Animated.View style={imageContainerStyle}>
          {typeof image === 'function' ? image() : image}
        </Animated.View>
      )}
      <Text style={titleStyle}>{title}</Text>
      <Text style={descriptionStyle}>{description}</Text>
    </>
  );
};

const PageContent = memo(PageContentComponent);

export default PageContent;
