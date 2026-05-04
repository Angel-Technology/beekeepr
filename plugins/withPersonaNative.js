const {
  AndroidConfig,
  withAppBuildGradle,
  withGradleProperties,
  withInfoPlist,
  withPodfileProperties,
  withProjectBuildGradle,
  // eslint-disable-next-line no-undef
} = require('@expo/config-plugins');

const { withPermissions } = AndroidConfig.Permissions;

// Persona's identity flow needs the camera (ID capture + selfie). Without
// these declared in the merged manifest, Android denies the runtime permission
// request the SDK fires and its activity hard-crashes the process.
const PERSONA_ANDROID_PERMISSIONS = [
  'android.permission.CAMERA',
  'android.permission.RECORD_AUDIO',
];

const PERSONA_ANDROID_MAVEN_REPO =
  "maven { url 'https://sdk.withpersona.com/android/releases' }";

const COMMONMARK_SUBSTITUTION_BLOCK = `
// Persona's \`markwon\` transitive dep references the legacy
// \`com.atlassian.commonmark:commonmark:0.13.0\`, which is missing the
// \`Parser.Builder\` API the rest of Persona's UI relies on. The modern
// \`org.commonmark:commonmark:0.21.0\` ships identical package/class names
// under a different Maven group, so we redirect any reference to the legacy
// artifact at resolution time. This keeps a single, working commonmark on the
// classpath — excluding outright crashes the SDK with NoClassDefFoundError.
configurations.all {
    resolutionStrategy.dependencySubstitution {
        substitute module('com.atlassian.commonmark:commonmark') using module('org.commonmark:commonmark:0.21.0')
    }
}
`;

const ensureCommonmarkSubstitution = (contents) => {
  if (contents.includes("substitute module('com.atlassian.commonmark:commonmark')")) {
    return contents;
  }

  // Drop the previous exclude-based approach if it's still hanging around.
  let next = contents.replace(
    /configurations\.all\s*\{\s*exclude group:\s*'com\.atlassian\.commonmark',\s*module:\s*'commonmark'\s*\}\s*/g,
    '',
  );

  return next.trimEnd() + '\n' + COMMONMARK_SUBSTITUTION_BLOCK;
};

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

const ensureMinimumIosVersion = (infoPlist) => {
  const current = Number.parseFloat(infoPlist.LSMinimumSystemVersion || '0');
  if (current >= 13) {
    return infoPlist;
  }
  return { ...infoPlist, LSMinimumSystemVersion: '13.0' };
};

// react-native-persona@2.33.1 ships only an old-arch Bridge module. Under
// React Native's New Architecture it crashes on `start()` and prints
// `addListener` / `removeListeners` warnings at boot. We force-disable New
// Arch from this plugin so a fresh prebuild keeps the override (manual edits
// to gradle.properties / Podfile.properties.json get clobbered by prebuild).
// Re-enable once Persona ships a TurboModule build.
const setAndroidNewArchDisabled = (gradleProperties) => {
  const existing = gradleProperties.find(
    (item) => item.type === 'property' && item.key === 'newArchEnabled',
  );
  if (existing) {
    existing.value = 'false';
  } else {
    gradleProperties.push({
      type: 'property',
      key: 'newArchEnabled',
      value: 'false',
    });
  }
  return gradleProperties;
};

const withPersonaNative = (config) => {
  config = withPodfileProperties(config, (podfileConfig) => {
    podfileConfig.modResults['ios.useFrameworks'] = 'static';
    podfileConfig.modResults['newArchEnabled'] = 'false';
    return podfileConfig;
  });

  config = withInfoPlist(config, (infoPlistConfig) => {
    infoPlistConfig.modResults = ensureMinimumIosVersion(
      infoPlistConfig.modResults,
    );
    return infoPlistConfig;
  });

  config = withGradleProperties(config, (gradleConfig) => {
    gradleConfig.modResults = setAndroidNewArchDisabled(
      gradleConfig.modResults,
    );
    return gradleConfig;
  });

  // `withPermissions` is the documented public API for adding Android
  // permissions. The previous attempt called `AndroidConfig.Permissions
  // .ensurePermissions` directly and reassigned its return value
  // (`{[name]: boolean}` status map) back to `manifestConfig.modResults`,
  // which replaced the entire manifest with the status map and made the
  // base manifest mod fail with "missing required MainApplication element".
  config = withPermissions(config, PERSONA_ANDROID_PERMISSIONS);

  config = withProjectBuildGradle(config, (gradleConfig) => {
    gradleConfig.modResults.contents = ensureAndroidRepo(
      gradleConfig.modResults.contents,
    );
    return gradleConfig;
  });

  config = withAppBuildGradle(config, (gradleConfig) => {
    gradleConfig.modResults.contents = ensureCommonmarkSubstitution(
      gradleConfig.modResults.contents,
    );
    return gradleConfig;
  });

  return config;
};

// eslint-disable-next-line no-undef
module.exports = withPersonaNative;
