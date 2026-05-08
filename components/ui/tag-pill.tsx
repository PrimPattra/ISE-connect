import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

interface Props {
  children: React.ReactNode;
  dark?: boolean;
}

export function TagPill({ children, dark = false }: Props) {
  return (
    <View style={[s.pill, dark ? s.dark : s.light]}>
      <Text style={[s.text, dark ? s.textDark : s.textLight]}>{children}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  pill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  light: { backgroundColor: C.paper2, borderColor: C.line },
  dark: { backgroundColor: C.ink, borderColor: C.ink },
  text: { fontSize: 11, fontFamily: F.mono },
  textLight: { color: C.ink2 },
  textDark: { color: C.paper },
});
