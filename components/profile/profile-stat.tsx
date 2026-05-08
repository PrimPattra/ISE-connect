import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

interface Props { label: string; value: string | number }

export function ProfileStat({ label, value }: Props) {
  return (
    <View style={s.box}>
      <Text style={s.label}>{label}</Text>
      <Text style={s.value}>{value}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: C.paper },
  label: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  value: { fontSize: 18, color: C.ink, marginTop: 2 },
});
