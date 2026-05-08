import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { Review } from '@/types';

interface Props {
  r: Review;
  showSalary: boolean;
}

export function ReviewCard({ r, showSalary }: Props) {
  return (
    <Card style={s.card}>
      <View style={s.header}>
        <Text style={s.company}>{r.company}</Text>
        <TagPill>{r.role}</TagPill>
      </View>
      <Text style={s.meta}>{r.when} · {r.by}</Text>

      <View style={s.reviewBox}>
        <Text style={s.reviewText}>{r.reviewText}</Text>
      </View>

      {showSalary && r.salary && (
        <View style={s.salaryRow}>
          <Icon name="money" size={16} color={C.teal500} />
          <Text style={s.salaryText}>
            <Text style={s.salaryAmt}>{r.salary.amount.toLocaleString()} {r.salary.currency}</Text>
            <Text style={s.salaryMeta}> / {r.salary.period} · {r.salary.role}</Text>
          </Text>
        </View>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, marginBottom: 10 },
  header: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 4 },
  company: { fontSize: 16, fontWeight: '600', color: C.ink },
  meta: { fontSize: 12, fontFamily: F.mono, color: C.muted, marginBottom: 12 },
  reviewBox: { backgroundColor: C.paper2, borderLeftWidth: 3, borderLeftColor: C.teal600, borderRadius: 6, paddingHorizontal: 14, paddingVertical: 12, marginBottom: 4 },
  reviewText: { fontSize: 14, color: C.ink2, lineHeight: 22 },
  salaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 12 },
  salaryText: { flex: 1, fontSize: 13 },
  salaryAmt: { color: C.ink, fontWeight: '500' },
  salaryMeta: { color: C.muted },
});
