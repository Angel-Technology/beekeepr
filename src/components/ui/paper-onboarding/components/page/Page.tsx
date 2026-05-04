import { useMemo, useCallback, memo } from 'react';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  interpolate,
  Extrapolation,
} from 'react-native-reanimated';
import PageContent from '../pageContent/PageContent';
import { styles } from './styles';
import type { PageProps } from '../../types';

const PageComponent = ({
  index,
  item,
  animatedIndex,
  indicatorSize,
  titleStyle: titleStyleOverride,
  descriptionStyle: descriptionStyleOverride,
  screenDimensions,
  safeInsets,
}: PageProps) => {
  const animatedFocus = useDerivedValue(() =>
    interpolate(
      animatedIndex.value,
      [index - 1, index, index + 1],
      [0, 1, 2],
      Extrapolation.CLAMP,
    ),
  );

  const contentContainerAnimatedStyle = useAnimatedStyle(() => {
    const focus = animatedFocus.value;
    return {
      opacity: interpolate(
        focus,
        [0.5, 1, 1.5],
        [0, 1, 0],
        Extrapolation.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            focus,
            [0, 1, 2],
            [
              screenDimensions.height / 8,
              0,
              (screenDimensions.height / 6) * -1,
            ],
            Extrapolation.CLAMP,
          ),
        },
      ],
    };
  });

  const contentContainerStyle = useMemo(
    () => [
      styles.contentContainer,
      {
        marginTop: safeInsets.top,
        marginRight: safeInsets.right,
        marginLeft: safeInsets.left,
        marginBottom: safeInsets.bottom + indicatorSize + safeInsets.bottom,
      },
      contentContainerAnimatedStyle,
    ],
    [safeInsets, indicatorSize, contentContainerAnimatedStyle],
  );

  const pointerEventsAnimatedStyle = useAnimatedStyle(() => {
    const isActive = Math.round(animatedIndex.value) === index;
    return {
      pointerEvents: isActive ? ('auto' as const) : ('none' as const),
    };
  });

  const containerStyle = useMemo(
    () => [styles.container, pointerEventsAnimatedStyle],
    [pointerEventsAnimatedStyle],
  );

  const titleStyle = useMemo(
    () => [titleStyleOverride, item.titleStyle ? item.titleStyle : null],
    [item, titleStyleOverride],
  );
  const descriptionStyle = useMemo(
    () => [
      descriptionStyleOverride,
      item.descriptionStyle ? item.descriptionStyle : null,
    ],
    [item, descriptionStyleOverride],
  );

  const pageContentProps = useMemo(
    () => ({
      index,
      animatedFocus,
      image: item.image,
      title: item.title,
      description: item.description,
      titleStyle,
      descriptionStyle,
    }),
    [index, item, titleStyle, descriptionStyle, animatedFocus],
  );

  const renderContent = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ContentComponent: any = item.content;
    return ContentComponent ? (
      typeof ContentComponent === 'function' ? (
        ContentComponent(pageContentProps)
      ) : (
        <ContentComponent {...pageContentProps} />
      )
    ) : (
      <PageContent {...pageContentProps} />
    );
  }, [item, pageContentProps]);

  return (
    <Animated.View style={containerStyle}>
      <Animated.View style={contentContainerStyle}>
        {renderContent()}
      </Animated.View>
    </Animated.View>
  );
};

const Page = memo(PageComponent);

export default Page;
