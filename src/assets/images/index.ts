import type { ImageRequireSource } from 'react-native';

export type AppImageSource = ImageRequireSource;

export type AppImages = {
  readonly betaLogo: ImageRequireSource;
  readonly beeBadge: ImageRequireSource;
  readonly illustrationTrial: ImageRequireSource;
  readonly investigateBee: ImageRequireSource;
  readonly verifyBee: ImageRequireSource;
  readonly adaptiveIcon: ImageRequireSource;
  readonly appIcon: ImageRequireSource;
  readonly awkwardBee: ImageRequireSource;
  readonly awkwardSadBee: ImageRequireSource;
  readonly splashIcon: ImageRequireSource;
  readonly welcomeBee: ImageRequireSource;
  readonly standoutBee: ImageRequireSource;
  readonly newMatchBee: ImageRequireSource;
  readonly illustrationOnboarding3: ImageRequireSource;
  readonly illustrationLetsdothis: ImageRequireSource;
  readonly partnerships: ImageRequireSource;
  readonly location: ImageRequireSource;
  readonly congrats: ImageRequireSource;
};

export const appImages: AppImages = {
  betaLogo: require('./Beta-Logo.png'),
  beeBadge: require('./Bee-Badge.png'),
  illustrationTrial: require('./Illustration-Trial.png'),
  investigateBee: require('./Investigate-Bee.png'),
  verifyBee: require('./Verify-Bee.png'),
  adaptiveIcon: require('./adaptive-icon.png'),
  appIcon: require('./app-icon.png'),
  awkwardBee: require('./awkward-bee-4.png'),
  awkwardSadBee: require('./awkward-sad-bee.png'),
  splashIcon: require('./splash-icon.png'),
  welcomeBee: require('./welcome-bee.png'),
  standoutBee: require('./standout-bee.png'),
  newMatchBee: require('./new-match-bee.png'),
  illustrationOnboarding3: require('./Illustration-Onboarding-3.png'),
  illustrationLetsdothis: require('./Illustration-Letsdothis.png'),
  partnerships: require('./partnerships.png'),
  location: require('./location.png'),
  congrats: require('./congrats.png'),
};

export type AppImageKey = keyof typeof appImages;

export const getAppImage = (key: AppImageKey): ImageRequireSource => {
  return appImages[key];
};
