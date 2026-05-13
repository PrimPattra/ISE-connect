import { Platform } from 'react-native';

export const C = {
  paper: '#fbfbfb',
  paper2: '#EBE5D8', //EBE5D8
  ink: '#1B1A17',
  ink2: '#3A3833',
  muted: '#7A7568',
  line: '#e6e3dd',  //#D9D2C2
  teal50: '#eef7fd',
  teal100: '#BBDEFB',
  teal500: '#1976D2',
  teal600: '#0D47A1',
  teal700: '#082552',
  blue50: '#E3F2FD',
  blue100: '#BBDEFB',
  blue500: '#1976D2',
  blue600: '#1565C0',
  blue700: '#0D47A1',
  blue800: '#082552',
  ember: '#C2552B',
  red: '#D32F2F',
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
