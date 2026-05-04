const {
  withAppBuildGradle,
  // eslint-disable-next-line no-undef
} = require('@expo/config-plugins');

// Marker we look for to detect a previous run / idempotency. Picking a unique
// substring inside the injected block keeps the check robust even if Expo
// changes surrounding boilerplate in `android/app/build.gradle`.
const RELEASE_SIGNING_MARKER = 'ANDROID_KEYSTORE_PATH_FROM_PLUGIN';

const RELEASE_SIGNING_BLOCK = `        release {
            // ${RELEASE_SIGNING_MARKER}
            //
            // Read keystore configuration from Gradle properties (passed via
            // \`-PANDROID_KEYSTORE_PATH=...\` from Fastlane) or environment
            // variables. Skip the configuration entirely when none of those are
            // set so debug builds — which never run a release signing pipeline —
            // don't fail to evaluate this block.
            def keystorePath = findProperty("ANDROID_KEYSTORE_PATH") ?: System.getenv("ANDROID_KEYSTORE_PATH")
            def keystorePassword = findProperty("ANDROID_KEYSTORE_PASSWORD") ?: System.getenv("ANDROID_KEYSTORE_PASSWORD")
            def keyAliasValue = findProperty("ANDROID_KEY_ALIAS") ?: System.getenv("ANDROID_KEY_ALIAS")
            def keyPasswordValue = findProperty("ANDROID_KEY_PASSWORD") ?: System.getenv("ANDROID_KEY_PASSWORD")

            if (keystorePath) {
                storeFile file(keystorePath)
                storePassword keystorePassword
                keyAlias keyAliasValue
                keyPassword keyPasswordValue
            }
        }`;

const insertReleaseSigningConfig = (contents) => {
  if (contents.includes(RELEASE_SIGNING_MARKER)) {
    return contents;
  }

  // Inject the release signing config just before the closing brace of the
  // `signingConfigs { debug { ... } }` block that Expo's prebuild generates.
  const debugBlockPattern =
    /(signingConfigs\s*\{[\s\S]*?debug\s*\{[\s\S]*?keyPassword\s+'android'\s*\})/;

  if (!debugBlockPattern.test(contents)) {
    throw new Error(
      'withAndroidSigning: Could not locate `signingConfigs { debug { ... } }` block in android/app/build.gradle. The Expo prebuild output may have changed.',
    );
  }

  return contents.replace(
    debugBlockPattern,
    `$1\n${RELEASE_SIGNING_BLOCK}`,
  );
};

const switchReleaseBuildToReleaseSigning = (contents) => {
  // Default Expo prebuild assigns `signingConfig signingConfigs.debug` to the
  // release build type. Flip to the release config we just declared.
  //
  // The `buildTypes` anchor matters: without it, the non-greedy walk would
  // start from the `release {` block inside `signingConfigs` (which we just
  // injected) and end up replacing the wrong `signingConfig signingConfigs
  // .debug` line — silently swapping debug + release signing assignments.
  const pattern =
    /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?signingConfig\s+)signingConfigs\.debug/;

  if (!pattern.test(contents)) {
    // Already pointing at release signing — nothing to do.
    return contents;
  }

  return contents.replace(pattern, '$1signingConfigs.release');
};

const withAndroidSigning = (config) => {
  return withAppBuildGradle(config, (gradleConfig) => {
    if (gradleConfig.modResults.language !== 'groovy') {
      throw new Error(
        'withAndroidSigning: Only Groovy `android/app/build.gradle` is supported.',
      );
    }

    let updated = insertReleaseSigningConfig(gradleConfig.modResults.contents);
    updated = switchReleaseBuildToReleaseSigning(updated);
    gradleConfig.modResults.contents = updated;
    return gradleConfig;
  });
};

// eslint-disable-next-line no-undef
module.exports = withAndroidSigning;
