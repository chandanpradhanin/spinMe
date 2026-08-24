import { useMemo } from 'react';
import { Alert, ScrollView, StyleSheet } from 'react-native';

import {
  ScreenContainer,
  ScreenHeader,
  SettingsLinkRow,
  SettingsSection,
  SettingsToggleRow,
  SettingsValueRow,
} from '../components';
import { useSettings } from '../hooks';
import { spacing } from '../theme';
import { APP_VERSION } from '../utils/appInfo';
import { openPrivacyPolicy, openRateApp } from '../utils/links';

export function SettingsScreen() {
  const { settings, updateSettings } = useSettings();

  const styles = useMemo(
    () =>
      StyleSheet.create({
        scrollContent: {
          paddingBottom: spacing.xxl,
        },
      }),
    [],
  );

  const handleToggle = (key: keyof typeof settings) => (value: boolean) => {
    updateSettings({ [key]: value });
  };

  const handlePrivacyPolicy = async () => {
    try {
      await openPrivacyPolicy();
    } catch {
      Alert.alert('Error', 'Could not open privacy policy.');
    }
  };

  const handleRateApp = async () => {
    try {
      await openRateApp();
    } catch {
      Alert.alert('Error', 'Could not open app store.');
    }
  };

  return (
    <ScreenContainer>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        <ScreenHeader title="Settings" />

        <SettingsSection first title="Experience">
          <SettingsToggleRow
            icon="phone-portrait-outline"
            label="Haptics"
            onValueChange={handleToggle('hapticsEnabled')}
            value={settings.hapticsEnabled}
          />
          <SettingsToggleRow
            icon="volume-high-outline"
            label="Sound"
            onValueChange={handleToggle('soundEnabled')}
            value={settings.soundEnabled}
          />
          <SettingsToggleRow
            icon="moon-outline"
            label="Dark mode"
            onValueChange={handleToggle('darkModeEnabled')}
            value={settings.darkModeEnabled}
          />
          <SettingsToggleRow
            icon="accessibility-outline"
            label="Reduce motion"
            onValueChange={handleToggle('reduceMotionEnabled')}
            showDivider={false}
            value={settings.reduceMotionEnabled}
          />
        </SettingsSection>

        <SettingsSection title="About">
          <SettingsLinkRow
            icon="shield-checkmark-outline"
            label="Privacy policy"
            onPress={handlePrivacyPolicy}
          />
          <SettingsLinkRow
            icon="star-outline"
            label="Rate app"
            onPress={handleRateApp}
          />
          <SettingsValueRow
            icon="information-circle-outline"
            label="App version"
            value={APP_VERSION}
          />
        </SettingsSection>
      </ScrollView>
    </ScreenContainer>
  );
}
