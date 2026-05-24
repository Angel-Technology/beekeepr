import * as WebBrowser from 'expo-web-browser';

/**
 * Opens a URL in an in-app browser sheet so the user stays in our app
 * instead of being kicked out to Safari / Chrome. No-op for empty / invalid
 * URLs. Errors are swallowed silently — typical caller is a tap handler
 * and a failure here shouldn't crash the surrounding UI.
 */
export const openInAppBrowser = (url: string): void => {
  const trimmed = url.trim();
  if (!trimmed) {
    return;
  }
  void WebBrowser.openBrowserAsync(trimmed, {
    presentationStyle: WebBrowser.WebBrowserPresentationStyle.POPOVER,
  });
};
