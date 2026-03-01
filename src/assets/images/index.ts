import type { ImageRequireSource } from 'react-native';

export type AppImageSource = ImageRequireSource;

export type AppImages = {
  readonly betaLogo: ImageRequireSource;
  readonly adaptiveIcon: ImageRequireSource;
  readonly appIcon: ImageRequireSource;
  readonly awkwardBee: ImageRequireSource;
  readonly splashIcon: ImageRequireSource;
};

export const appImages: AppImages = {
  betaLogo: require('./Beta-Logo.png'),
  adaptiveIcon: require('./adaptive-icon.png'),
  appIcon: require('./app-icon.png'),
  awkwardBee: require('./awkward-bee-4.png'),
  splashIcon: require('./splash-icon.png'),
};

export type AppImageKey = keyof typeof appImages;

export function getAppImage(key: AppImageKey): ImageRequireSource {
  return appImages[key];
}
