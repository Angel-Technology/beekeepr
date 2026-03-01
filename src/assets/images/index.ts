import type { ImageRequireSource } from 'react-native';

type AppImages = {
  readonly adaptiveIcon: ImageRequireSource;
  readonly appIcon: ImageRequireSource;
  readonly awkwardBee: ImageRequireSource;
  readonly splashIcon: ImageRequireSource;
};

export const appImages: AppImages = {
  adaptiveIcon: require('./adaptive-icon.png'),
  appIcon: require('./app-icon.png'),
  awkwardBee: require('./awkward-bee-4.png'),
  splashIcon: require('./splash-icon.png'),
};

export type AppImageKey = keyof typeof appImages;

export function getAppImage(key: AppImageKey): ImageRequireSource {
  return appImages[key];
}
