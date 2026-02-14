/**
 * App variant types matching deploy.yml environments
 */
export type AppVariant = 'dev' | 'test' | 'prod';

/**
 * Platform-specific configuration from deploy.yml
 */
export interface DeployPlatformConfig {
  flavor: string;
  gradle_task?: string;
  firebase_app_id: string;
  bundle_id: string;
  app_name: string;
  scheme?: string;
  export_options_plist?: string;
  provisioning_profile?: string;
}

/**
 * Environment configuration from deploy.yml
 */
export interface DeployEnvironment {
  env_file: string;
  android: DeployPlatformConfig;
  ios: DeployPlatformConfig;
  url_scheme: string;
  icon_path: string;
  tester_groups: string;
}

/**
 * Root deploy.yml configuration structure
 */
export interface DeployConfig {
  firebase_token: string;
  ios_team_id: string;
  environments: Record<AppVariant, DeployEnvironment>;
}

/**
 * Processed environment config for Expo
 */
export interface EnvironmentConfig {
  scheme: string;
  bundleIdentifier: string;
  androidPackage: string;
  icon: string;
  name: string;
}
