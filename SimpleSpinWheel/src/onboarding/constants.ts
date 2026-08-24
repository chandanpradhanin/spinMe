import type { OnboardingPage } from './types';

export const ONBOARDING_COLORS = {
  background: '#FFFFFF',
  primary: '#6366F1',
  text: '#0F172A',
  muted: '#64748B',
  chipBackground: '#EEF2FF',
  chipBorder: '#E0E7FF',
  illustrationSurface: '#F8FAFC',
} as const;

export const ONBOARDING_RADIUS = 24;

export const ONBOARDING_PAGES: OnboardingPage[] = [
  {
    id: 'decide',
    title: 'Decide in seconds',
    description:
      'Stop overthinking meals, movies, chores, and everyday choices. Spin once and get a fair answer instantly.',
    illustration: 'decide',
  },
  {
    id: 'together',
    title: 'Make decisions together',
    description:
      'Create custom wheels, save favorites, and share results with friends, family, classmates, or your team.',
    illustration: 'together',
    chips: ['Fair random', 'Works offline', 'No account', 'Save wheels'],
  },
  {
    id: 'create',
    title: 'Create a wheel and spin',
    description:
      'Add your options, tap Spin, and let the wheel choose fairly. Everything stays private and works offline.',
    illustration: 'create',
  },
];
