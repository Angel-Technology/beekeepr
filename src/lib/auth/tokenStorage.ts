import * as SecureStore from 'expo-secure-store';

const AUTH_TOKEN_KEY = 'beekeepr_auth_token';

export const tokenStorage = {
  async getToken() {
    return SecureStore.getItemAsync(AUTH_TOKEN_KEY);
  },

  async setToken(token: string) {
    return SecureStore.setItemAsync(AUTH_TOKEN_KEY, token);
  },

  async clearToken() {
    return SecureStore.deleteItemAsync(AUTH_TOKEN_KEY);
  },
};
