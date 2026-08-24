import { useState } from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { StatusBar, StyleSheet } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { SettingsProvider, WheelsProvider } from './hooks';
import { OnboardingScreen } from './onboarding';
import { RootNavigator } from './navigation';
import {
  bootstrapStorage,
  hasCompletedOnboarding,
  setOnboardingComplete,
} from './storage';
import { gradients, ThemeProvider, useTheme } from './theme';

bootstrapStorage();

function MainApp() {
  const { colors, isDark } = useTheme();
  const baseTheme = isDark ? DarkTheme : DefaultTheme;

  const navigationTheme = {
    ...baseTheme,
    colors: {
      ...baseTheme.colors,
      background: isDark ? colors.background : gradients.screen[1],
      card: colors.tabBar,
      text: colors.text,
      border: colors.border,
      primary: colors.primary,
    },
  };

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background}
      />
      <WheelsProvider>
        <NavigationContainer theme={navigationTheme}>
          <RootNavigator />
        </NavigationContainer>
      </WheelsProvider>
    </>
  );
}

function AppContent() {
  const [showOnboarding, setShowOnboarding] = useState(
    () => !hasCompletedOnboarding(),
  );

  const handleOnboardingComplete = () => {
    setOnboardingComplete();
    bootstrapStorage();
    setShowOnboarding(false);
  };

  if (showOnboarding) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      </>
    );
  }

  return <MainApp />;
}

function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <SettingsProvider>
          <ThemeProvider>
            <AppContent />
          </ThemeProvider>
        </SettingsProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default App;
