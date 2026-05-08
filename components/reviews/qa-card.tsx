import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { QA } from '@/types';

interface Props { q: QA }

export function QACard({ q }: Props) {
  return (
    <Card style={s.card}>
      <View style={s.top}>
        <TagPill>{q.tag}</TagPill>
        <Text style={s.by}>{q.by}</Text>
      </View>
      <Text style={s.question}>{q.q}</Text>
      <View style={s.footer}>
        <View style={s.replies}>
          <Icon name="chat" size={13} color={C.muted} />
          <Text style={s.repliesText}>{q.answers} replies</Text>
        </View>
        <TouchableOpacity>
          <Text style={s.open}>Open thread →</Text>
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const s = StyleSheet.create({
  card: { padding: 14, marginBottom: 8 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  by: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  question: { fontSize: 14, color: C.ink, lineHeight: 20 },
  footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10 },
  replies: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  repliesText: { fontSize: 12, color: C.muted },
  open: { fontSize: 12, color: C.teal600 },
});
