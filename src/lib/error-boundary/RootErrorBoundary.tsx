import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Image } from 'expo-image';
import { Button } from '@components';
import { appImages } from '@src/assets/images';
import { captureError } from '@src/lib/sentry';

type RootErrorBoundaryProps = {
  children: ReactNode;
};

type RootErrorBoundaryState = {
  error: Error | null;
};

/**
 * Last-resort error boundary mounted at the top of the provider tree.
 * Catches render-phase exceptions from anything below it (auth, RevenueCat,
 * router) and shows a recovery surface instead of the blank-screen / red-box
 * default. `reset()` clears the error so the subtree remounts — for most
 * crashes (transient query failures, race conditions on mount) that's enough
 * to put the user back into a working app.
 *
 * Event-handler and async errors don't reach this boundary — those are
 * surfaced through `useErrorModal()` / mutation `onError`. This catches the
 * ones that would otherwise white-screen the app.
 */
export class RootErrorBoundary extends Component<
  RootErrorBoundaryProps,
  RootErrorBoundaryState
> {
  state: RootErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    captureError(error, { componentStack: info.componentStack });
  }

  reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return <ErrorFallback error={this.state.error} onReset={this.reset} />;
    }
    return this.props.children;
  }
}

type ErrorFallbackProps = {
  error: Error;
  onReset: () => void;
};

const ErrorFallback = ({ error, onReset }: ErrorFallbackProps) => (
  <View className="flex-1 bg-bg-default px-6">
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        gap: 16,
      }}
      showsVerticalScrollIndicator={false}
    >
      <View className="items-center">
        <Image
          source={appImages.awkwardSadBee}
          style={{ width: 303, height: 191 }}
          contentFit="cover"
        />
      </View>
      <Text className="text-center font-poppins-semiBold text-700 text-text-default">
        Something went wrong
      </Text>
      <Text className="text-center font-poppins-regular text-base text-text-secondary">
        The app hit an unexpected error. Tap below to try again — if it keeps
        happening, restart the app.
      </Text>
      {__DEV__ ? (
        <View className="bg-bg-elevated rounded-3 p-3">
          <Text className="font-sourceSans-regular text-xs text-text-secondary">
            {error.message}
          </Text>
        </View>
      ) : null}
      <Button label="Try again" onPress={onReset} />
    </ScrollView>
  </View>
);
