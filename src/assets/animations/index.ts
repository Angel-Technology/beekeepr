import type { AnimationObject } from 'lottie-react-native';

export type AppAnimationSource = AnimationObject;

export type AppAnimations = {
  readonly confetti: AppAnimationSource;
};

export const appAnimations: AppAnimations = {
  confetti: require('./confetti.json'),
};

export type AppAnimationKey = keyof typeof appAnimations;

export const getAppAnimation = (key: AppAnimationKey): AppAnimationSource => {
  return appAnimations[key];
};
