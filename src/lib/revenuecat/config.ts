import { Platform } from 'react-native';
import { environmentConfig } from '../config/environment';

export const REVENUECAT_ENTITLEMENT_ID =
  environmentConfig.revenueCatEntitlementId;

export const REVENUECAT_API_KEY =
  Platform.OS === 'android'
    ? environmentConfig.revenueCatAndroidApiKey
    : environmentConfig.revenueCatIosApiKey;

export const isRevenueCatConfigured =
  REVENUECAT_API_KEY.length > 0 && REVENUECAT_ENTITLEMENT_ID.length > 0;
