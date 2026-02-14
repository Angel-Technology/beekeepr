import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import type {
  AppVariant,
  DeployConfig,
  EnvironmentConfig,
} from '../models/config.types';

/**
 * Reads and parses deploy.yml from the fastlane directory
 * @param basePath - The base path to resolve fastlane/deploy.yml from
 */
export const loadDeployConfig = (basePath: string): DeployConfig => {
  const deployPath = path.resolve(basePath, 'fastlane/deploy.yml');

  try {
    const fileContents = fs.readFileSync(deployPath, 'utf8');
    const config = yaml.load(fileContents) as DeployConfig;

    if (!config || !config.environments) {
      throw new Error("deploy.yml is missing required 'environments' section");
    }

    return config;
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      throw new Error(
        `deploy.yml not found at ${deployPath}. Ensure fastlane/deploy.yml exists.`,
      );
    }
    throw new Error(
      `Failed to parse deploy.yml: ${error instanceof Error ? error.message : String(error)}`,
    );
  }
};

/**
 * Validates and returns the app variant from environment variable
 */
export const getAppVariant = (): AppVariant => {
  const variant = process.env.EXPO_PUBLIC_APP_VARIANT;

  switch (variant) {
    case 'dev':
    case 'test':
    case 'prod':
      return variant;
    default:
      if (variant) {
        console.warn(
          `Invalid EXPO_PUBLIC_APP_VARIANT "${variant}". Expected "dev", "test", or "prod". Defaulting to "dev".`,
        );
      }
      return 'dev';
  }
};

/**
 * Extracts environment-specific config from deploy.yml
 */
export const getEnvironmentConfig = (
  deployConfig: DeployConfig,
  variant: AppVariant,
): EnvironmentConfig => {
  const envConfig = deployConfig.environments[variant];

  return {
    scheme: envConfig.url_scheme,
    bundleIdentifier: envConfig.ios.bundle_id,
    androidPackage: envConfig.android.bundle_id,
    icon: envConfig.icon_path,
    name: envConfig.ios.app_name,
  };
};
