import { Alert, Linking, Platform } from 'react-native';

import { APP_STORE_URL, PRIVACY_POLICY_URL } from './appInfo';

export async function openPrivacyPolicy(): Promise<void> {
  const supported = await Linking.canOpenURL(PRIVACY_POLICY_URL);

  if (!supported) {
    Alert.alert('Unable to open link', 'Privacy policy URL is not available.');
    return;
  }

  await Linking.openURL(PRIVACY_POLICY_URL);
}

export async function openRateApp(): Promise<void> {
  const url = Platform.OS === 'ios' ? APP_STORE_URL.ios : APP_STORE_URL.android;
  const supported = await Linking.canOpenURL(url);

  if (!supported) {
    Alert.alert('Unable to open store', 'App store link is not available.');
    return;
  }

  await Linking.openURL(url);
}
