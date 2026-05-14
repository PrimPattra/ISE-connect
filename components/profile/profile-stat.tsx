import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

interface Props { label: string; value: string | number; dark?: boolean }

export function ProfileStat({ label, value, dark = false }: Props) {
  return (
    <View style={[s.box, dark && s.boxDark]}>
      <Text style={[s.label, dark && s.labelDark]}>{label}</Text>
      <Text style={[s.value, dark && s.valueDark]}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.paper },
  boxDark: { backgroundColor: 'rgba(255,255,255,0.12)', borderColor: 'rgba(255,255,255,0.18)' },
  label: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  labelDark: { color: 'rgba(251,251,251,0.6)' },
  value: { fontSize: 18, color: C.ink, marginTop: 2 },
  valueDark: { color: C.paper },
});
