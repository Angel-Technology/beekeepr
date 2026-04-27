import { Alert, ScrollView, Text, View } from 'react-native';
import {
  Button,
  ButtonWithIcon,
  Card,
  Container,
  IconButton,
} from '@components';
import { useRouter } from 'expo-router';
import {
  Crown,
  RefreshCw,
  RotateCcw,
  WalletCards,
  X,
} from 'lucide-react-native';
import { PAYWALL_RESULT } from 'react-native-purchases-ui';
import { REVENUECAT_ENTITLEMENT_ID, useRevenueCat } from '@src/lib/revenuecat';

const formatPackagePrice = (pkg: any) => {
  return (
    pkg?.product?.priceString ??
    pkg?.product?.defaultOption?.formattedPrice ??
    'Unavailable'
  );
};

const formatExpirationDate = (value?: string | null) => {
  if (!value) {
    return 'None';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString();
};

export const SubscriptionScreen = () => {
  const router = useRouter();
  const {
    customerInfo,
    currentOffering,
    isConfigured,
    isNativeModuleAvailable,
    isPro,
    isReady,
    monthlyPackage,
    yearlyPackage,
    purchasePackage,
    refresh,
    restorePurchases,
    presentCustomerCenter,
    presentPaywall,
    presentPaywallIfNeeded,
  } = useRevenueCat();

  const handlePaywallResult = (result: PAYWALL_RESULT) => {
    if (result === PAYWALL_RESULT.PURCHASED) {
      Alert.alert('Success', 'Your subscription is now active.');
      return;
    }

    if (result === PAYWALL_RESULT.RESTORED) {
      Alert.alert('Restored', 'Your purchases were restored successfully.');
      return;
    }

    if (result === PAYWALL_RESULT.CANCELLED) {
      return;
    }
  };

  const withErrorAlert = async (action: () => Promise<void>) => {
    try {
      await action();
    } catch (error: any) {
      Alert.alert(
        'Subscription Error',
        error?.message ?? 'Something went wrong. Please try again.',
      );
    }
  };

  return (
    <Container
      safeArea
      safeAreaEdges={['top', 'bottom']}
      className="gap-5 bg-bg-default px-0 py-4"
    >
      <View className="w-full flex-row items-start justify-end">
        <IconButton
          accessibilityLabel="Close Buzzkeepr Test Pro"
          className="border-none bg-transparent"
          icon={<X size={24} strokeWidth={2.4} />}
          onPress={() => {
            router.back();
          }}
        />
      </View>
      <ScrollView className="w-full" showsVerticalScrollIndicator={false}>
        <View className="gap-5">
          <View className="gap-2">
            <Text className="font-poppins-semiBold text-700 text-text-default">
              Buzzkeepr Test Pro
            </Text>
            <Text className="font-sourceSans-regular text-base text-text-secondary">
              RevenueCat subscription setup, entitlement checks, paywall, and
              customer center.
            </Text>
          </View>

          <Card className="gap-4 rounded-6">
            <View className="flex-row items-center gap-3">
              <View className="h-10 w-10 items-center justify-center rounded-full bg-bg-primarySubtle">
                <Crown color="#000000" size={20} />
              </View>
              <View className="flex-1 gap-1">
                <Text className="font-poppins-semiBold text-xl text-text-default">
                  {isPro ? 'Pro is active' : 'Pro is inactive'}
                </Text>
                <Text className="font-sourceSans-regular text-base text-text-secondary">
                  Entitlement: {REVENUECAT_ENTITLEMENT_ID}
                </Text>
              </View>
            </View>

            <Text className="font-sourceSans-regular text-base text-text-secondary">
              {isConfigured
                ? isNativeModuleAvailable
                  ? isReady
                    ? 'RevenueCat is configured and ready.'
                    : 'RevenueCat is initializing.'
                  : 'RevenueCat packages are installed, but the native build is missing them. Rebuild the app with expo run and avoid Expo Go.'
                : 'RevenueCat keys are not configured yet.'}
            </Text>
          </Card>

          <Card className="gap-4 rounded-6">
            <Text className="font-poppins-semiBold text-xl text-text-default">
              Products
            </Text>

            <View className="gap-3">
              <View className="rounded-5 border border-border-subtle p-4">
                <Text className="font-sourceSans-semiBold text-base text-text-default">
                  Monthly
                </Text>
                <Text className="mt-1 font-sourceSans-regular text-base text-text-secondary">
                  {formatPackagePrice(monthlyPackage)}
                </Text>
                <View className="mt-3">
                  <Button
                    label="Buy Monthly"
                    size="md"
                    disabled={!monthlyPackage || !isReady}
                    onPress={() => {
                      if (!monthlyPackage) {
                        return;
                      }

                      void withErrorAlert(async () => {
                        const info = await purchasePackage(monthlyPackage);

                        if (
                          info?.entitlements.active[REVENUECAT_ENTITLEMENT_ID]
                        ) {
                          Alert.alert(
                            'Success',
                            'Monthly subscription activated.',
                          );
                        }
                      });
                    }}
                  />
                </View>
              </View>

              <View className="rounded-5 border border-border-subtle p-4">
                <Text className="font-sourceSans-semiBold text-base text-text-default">
                  Yearly
                </Text>
                <Text className="mt-1 font-sourceSans-regular text-base text-text-secondary">
                  {formatPackagePrice(yearlyPackage)}
                </Text>
                <View className="mt-3">
                  <Button
                    label="Buy Yearly"
                    size="md"
                    disabled={!yearlyPackage || !isReady}
                    onPress={() => {
                      if (!yearlyPackage) {
                        return;
                      }

                      void withErrorAlert(async () => {
                        const info = await purchasePackage(yearlyPackage);

                        if (
                          info?.entitlements.active[REVENUECAT_ENTITLEMENT_ID]
                        ) {
                          Alert.alert(
                            'Success',
                            'Yearly subscription activated.',
                          );
                        }
                      });
                    }}
                  />
                </View>
              </View>
            </View>
          </Card>

          <Card className="gap-3 rounded-6">
            <Text className="font-poppins-semiBold text-xl text-text-default">
              Paywall & Customer Center
            </Text>

            <ButtonWithIcon
              label="Present Paywall"
              size="md"
              iconLeft={<WalletCards color="#FFFFFF" size={18} />}
              onPress={() => {
                void withErrorAlert(async () => {
                  const result = await presentPaywall();
                  handlePaywallResult(result);
                });
              }}
            />

            <ButtonWithIcon
              label="Present Paywall If Needed"
              size="md"
              variant="outline"
              iconLeft={<Crown color="#000000" size={18} />}
              onPress={() => {
                void withErrorAlert(async () => {
                  const result = await presentPaywallIfNeeded();
                  handlePaywallResult(result);
                });
              }}
            />

            <ButtonWithIcon
              label="Open Customer Center"
              size="md"
              variant="outline"
              iconLeft={<WalletCards color="#000000" size={18} />}
              onPress={() => {
                void withErrorAlert(async () => {
                  await presentCustomerCenter();
                });
              }}
            />

            <ButtonWithIcon
              label="Restore Purchases"
              size="md"
              variant="outline"
              iconLeft={<RotateCcw color="#000000" size={18} />}
              onPress={() => {
                void withErrorAlert(async () => {
                  const info = await restorePurchases();

                  if (info) {
                    Alert.alert(
                      'Restored',
                      'Purchases restored and customer info refreshed.',
                    );
                  }
                });
              }}
            />

            <ButtonWithIcon
              label="Refresh Customer Info"
              size="md"
              variant="outline"
              iconLeft={<RefreshCw color="#000000" size={18} />}
              onPress={() => {
                void withErrorAlert(async () => {
                  await refresh();
                });
              }}
            />
          </Card>

          <Card className="gap-3 rounded-6">
            <Text className="font-poppins-semiBold text-xl text-text-default">
              Customer Info
            </Text>
            <Text className="font-sourceSans-regular text-base text-text-secondary">
              App User ID: {customerInfo?.originalAppUserId ?? 'Unknown'}
            </Text>
            <Text className="font-sourceSans-regular text-base text-text-secondary">
              Active subscriptions:{' '}
              {customerInfo?.activeSubscriptions.join(', ') || 'None'}
            </Text>
            <Text className="font-sourceSans-regular text-base text-text-secondary">
              Offering: {currentOffering?.identifier ?? 'No current offering'}
            </Text>
            <Text className="font-sourceSans-regular text-base text-text-secondary">
              Entitlement active: {isPro ? 'Yes' : 'No'}
            </Text>
            <Text className="font-sourceSans-regular text-base text-text-secondary">
              Entitlement expiration:{' '}
              {formatExpirationDate(
                customerInfo?.entitlements.active[REVENUECAT_ENTITLEMENT_ID]
                  ?.expirationDate,
              )}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </Container>
  );
};
