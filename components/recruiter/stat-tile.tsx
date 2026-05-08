import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { C, F } from '@/constants/theme';

interface Props { label: string; value: number | string; sub?: string; accent?: boolean }

export function StatTile({ label, value, sub, accent }: Props) {
  return (
    <Card style={s.card}>
      <View style={s.top}>
        <Text style={s.label}>{label}</Text>
        {accent && <View style={s.dot} />}
      </View>
      <Text style={s.value}>{value}</Text>
      {sub && <Text style={s.sub}>{sub}</Text>}
    </Card>
  );
}

const s = StyleSheet.create({
  card: { padding: 14, flex: 1 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.teal500 },
  value: { fontSize: 32, fontFamily: F.serif, fontStyle: 'italic', color: C.ink, marginTop: 6 },
  sub: { fontSize: 12, color: C.muted, marginTop: 4 },
});
