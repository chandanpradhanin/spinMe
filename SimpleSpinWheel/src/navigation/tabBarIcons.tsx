import type { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';

import type { RootTabParamList } from '../types';

const TAB_ICONS: Record<
  keyof RootTabParamList,
  { focused: string; unfocused: string }
> = {
  Spin: {
    focused: 'refresh-circle',
    unfocused: 'refresh-circle-outline',
  },
  Wheels: {
    focused: 'albums',
    unfocused: 'albums-outline',
  },
  History: {
    focused: 'time',
    unfocused: 'time-outline',
  },
  Settings: {
    focused: 'settings',
    unfocused: 'settings-outline',
  },
};

export function getTabBarIcon(
  routeName: keyof RootTabParamList,
): NonNullable<BottomTabNavigationOptions['tabBarIcon']> {
  return ({ focused, color }) => (
    <Ionicons
      color={color}
      name={focused ? TAB_ICONS[routeName].focused : TAB_ICONS[routeName].unfocused}
      size={22}
    />
  );
}
