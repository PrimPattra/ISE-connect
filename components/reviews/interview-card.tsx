import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { C, F } from '@/constants/theme';
import type { Interview } from '@/types';

interface Props { i: Interview }

export function InterviewCard({ i }: Props) {
  return (
    <Card style={s.card}>
      <View style={s.top}>
        <View>
          <Text style={s.company}>{i.company} · <Text style={s.role}>{i.role}</Text></Text>
          <Text style={s.meta}>{i.rounds} rounds · {i.timeline} · {i.by}</Text>
        </View>
        <TagPill>Hiring loop</TagPill>
      </View>
      {i.questions.map((q, n) => (
        <View key={n} style={s.qRow}>
          <Text style={s.qNum}>Q{n + 1}</Text>
          <Text style={s.qText}>{q}</Text>
        </View>
      ))}
    </Card>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, marginBottom: 10 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  company: { fontSize: 15, fontWeight: '500', color: C.ink },
  role: { fontWeight: '400', color: C.ink2 },
  meta: { fontSize: 12, fontFamily: F.mono, color: C.muted, marginTop: 2 },
  qRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  qNum: { fontSize: 12, fontFamily: F.mono, color: C.muted, width: 22, marginTop: 1 },
  qText: { fontSize: 13, color: C.ink2, flex: 1, lineHeight: 18 },
});
