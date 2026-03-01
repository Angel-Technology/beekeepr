import type { ImageRequireSource } from 'react-native';

export type AppImageSource = ImageRequireSource;

export type AppImages = {
  readonly betaLogo: ImageRequireSource;
  readonly locations: ImageRequireSource;
  readonly search: ImageRequireSource;
  readonly theBuzz: ImageRequireSource;
  readonly adaptiveIcon: ImageRequireSource;
  readonly appIcon: ImageRequireSource;
  readonly awkwardBee: ImageRequireSource;
  readonly splashIcon: ImageRequireSource;
};

export const appImages: AppImages = {
  betaLogo: require('./Beta-Logo.png'),
  locations: require('./Locations-1.png'),
  search: require('./Search-3.png'),
  theBuzz: require('./TheBuzz-3.png'),
  adaptiveIcon: require('./adaptive-icon.png'),
  appIcon: require('./app-icon.png'),
  awkwardBee: require('./awkward-bee-4.png'),
  splashIcon: require('./splash-icon.png'),
};

export type AppImageKey = keyof typeof appImages;

export const getAppImage = (key: AppImageKey): ImageRequireSource => {
  return appImages[key];
};
