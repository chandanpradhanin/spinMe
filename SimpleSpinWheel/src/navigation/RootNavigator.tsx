import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';

import { HistoryScreen, SettingsScreen, SpinScreen, WheelsScreen } from '../screens';
import type { RootTabParamList } from '../types';

import { FloatingTabBar } from './FloatingTabBar';
import { makeTabScreen } from './makeTabScreen';
import { getTabBarIcon } from './tabBarIcons';

const Tab = createBottomTabNavigator<RootTabParamList>();

export function RootNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarIcon: getTabBarIcon(route.name),
        sceneContainerStyle: {
          backgroundColor: 'transparent',
        },
        sceneStyle: {
          backgroundColor: 'transparent',
        },
        tabBarBackground: () => <View style={{ backgroundColor: 'transparent' }} />,
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          elevation: 0,
        },
      })}
      tabBar={props => <FloatingTabBar {...props} />}>
      <Tab.Screen
        component={makeTabScreen(SpinScreen)}
        name="Spin"
        options={{ title: 'Spin' }}
      />
      <Tab.Screen
        component={makeTabScreen(WheelsScreen)}
        name="Wheels"
        options={{ title: 'Wheels' }}
      />
      <Tab.Screen
        component={makeTabScreen(HistoryScreen)}
        name="History"
        options={{ title: 'History' }}
      />
      <Tab.Screen
        component={makeTabScreen(SettingsScreen)}
        name="Settings"
        options={{ title: 'Settings' }}
      />
    </Tab.Navigator>
  );
}
