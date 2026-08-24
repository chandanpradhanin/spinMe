export type ThemeColors = {
  primary: string;
  primaryDark: string;
  background: string;
  surface: string;
  surfaceAlt: string;
  text: string;
  textSecondary: string;
  border: string;
  card: string;
  tabBar: string;
  overlay: string;
  onPrimary: string;
  success: string;
  danger: string;
};

export const lightColors: ThemeColors = {
  primary: '#6366F1',
  primaryDark: '#4F46E5',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceAlt: '#F1F5F9',
  text: '#0F172A',
  textSecondary: '#64748B',
  border: '#E2E8F0',
  card: '#FFFFFF',
  tabBar: '#FFFFFF',
  overlay: 'rgba(15, 23, 42, 0.4)',
  onPrimary: '#FFFFFF',
  success: '#10B981',
  danger: '#EF4444',
};

export const darkColors: ThemeColors = {
  primary: '#818CF8',
  primaryDark: '#6366F1',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceAlt: '#334155',
  text: '#F8FAFC',
  textSecondary: '#94A3B8',
  border: '#334155',
  card: '#1E293B',
  tabBar: '#0F172A',
  overlay: 'rgba(15, 23, 42, 0.72)',
  onPrimary: '#FFFFFF',
  success: '#34D399',
  danger: '#F87171',
};

/** @deprecated Use useTheme().colors instead */
export const colors = lightColors;
