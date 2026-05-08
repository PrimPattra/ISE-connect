import { Platform } from 'react-native';

export const C = {
  paper: '#F4F0E8',
  paper2: '#EBE5D8',
  ink: '#1B1A17',
  ink2: '#3A3833',
  muted: '#7A7568',
  line: '#D9D2C2',
  teal50: '#E6EEEC',
  teal100: '#C7D9D5',
  teal500: '#1F574E',
  teal600: '#173F39',
  teal700: '#0E2A26',
  ember: '#C2552B',
  plum: '#5B3A6B',
  moss: '#5C6E3A',
  white: '#FFFFFF',
};

export const F = {
  serif: Platform.select({ ios: 'Georgia', default: 'serif' }) as string,
  mono: Platform.select({ ios: 'Menlo', android: 'monospace', default: 'monospace' }) as string,
  sans: Platform.select({ ios: 'System', default: 'normal' }) as string,
};

export const Shadow = {
  card: Platform.select({
    ios: {
      shadowColor: C.ink,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.06,
      shadowRadius: 4,
    },
    android: { elevation: 2 },
    default: {},
  }),
  pop: Platform.select({
    ios: {
      shadowColor: C.ink,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.18,
      shadowRadius: 20,
    },
    android: { elevation: 8 },
    default: {},
  }),
};

// Kept for compatibility with existing components that import Colors
export const Colors = {
  light: {
    text: C.ink,
    background: C.paper,
    tint: C.teal500,
    icon: C.muted,
    tabIconDefault: C.muted,
    tabIconSelected: C.teal500,
  },
  dark: {
    text: C.paper,
    background: C.ink,
    tint: C.teal100,
    icon: C.muted,
    tabIconDefault: C.muted,
    tabIconSelected: C.teal100,
  },
};
