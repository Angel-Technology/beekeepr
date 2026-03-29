const {
  withInfoPlist,
  withPodfileProperties,
  withProjectBuildGradle,
  // eslint-disable-next-line no-undef
} = require('@expo/config-plugins');

const PERSONA_ANDROID_MAVEN_REPO =
  "maven { url 'https://sdk.withpersona.com/android/releases' }";

const ensureAndroidRepo = (contents) => {
  if (contents.includes('https://sdk.withpersona.com/android/releases')) {
    return contents;
  }

  const repositoriesBlock = /allprojects\s*\{\s*repositories\s*\{/;

  if (!repositoriesBlock.test(contents)) {
    throw new Error(
      'Unable to find `allprojects.repositories` in android/build.gradle for Persona setup.',
    );
  }

  return contents.replace(
    repositoriesBlock,
    `allprojects {\n  repositories {\n    ${PERSONA_ANDROID_MAVEN_REPO}`,
  );
};

const mergeInfoPlist = (infoPlist) => {
  const currentMinimumSystemVersion = Number.parseFloat(
    infoPlist.LSMinimumSystemVersion || '0',
  );

  return {
    ...infoPlist,
    LSMinimumSystemVersion:
      currentMinimumSystemVersion >= 13
        ? infoPlist.LSMinimumSystemVersion
        : '13.0',
    NSCameraUsageDescription:
      infoPlist.NSCameraUsageDescription ||
      "Beekeepr uses the camera to capture your driver's license and selfie for identity verification.",
    NSLocationWhenInUseUsageDescription:
      infoPlist.NSLocationWhenInUseUsageDescription ||
      'Beekeepr uses location during identity verification for fraud prevention and security checks.',
    NSPhotoLibraryUsageDescription:
      infoPlist.NSPhotoLibraryUsageDescription ||
      'Beekeepr can access your photo library if identity verification allows uploading ID images instead of capturing them live.',
  };
};

const withPersonaNative = (config) => {
  config = withPodfileProperties(config, (podfileConfig) => {
    podfileConfig.modResults['ios.useFrameworks'] = 'static';
    return podfileConfig;
  });

  config = withInfoPlist(config, (infoPlistConfig) => {
    infoPlistConfig.modResults = mergeInfoPlist(infoPlistConfig.modResults);
    return infoPlistConfig;
  });

  config = withProjectBuildGradle(config, (gradleConfig) => {
    gradleConfig.modResults.contents = ensureAndroidRepo(
      gradleConfig.modResults.contents,
    );
    return gradleConfig;
  });

  return config;
};

// eslint-disable-next-line no-undef
module.exports = withPersonaNative;
