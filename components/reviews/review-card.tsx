import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { Stars } from '@/components/ui/stars';
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
      <View style={s.top}>
        <View style={s.left}>
          <View style={s.nameRow}>
            <Text style={s.company}>{r.company}</Text>
            <TagPill>{r.role}</TagPill>
          </View>
          <Text style={s.meta}>{r.when} · {r.by}</Text>
        </View>
        <Stars value={r.overall} />
      </View>

      <View style={s.stats}>
        {([['Culture', r.culture], ['WLB', r.wlb], ['Mentorship', r.mentorship]] as [string, number][]).map(([k, v]) => (
          <View key={k} style={s.stat}>
            <Text style={s.statLabel}>{k}</Text>
            <Text style={s.statVal}>{v.toFixed(1)} / 5</Text>
          </View>
        ))}
      </View>

      <View style={s.prosCons}>
        <View style={s.col}>
          <Text style={s.prosLabel}>Pros</Text>
          <Text style={s.bodyText}>{r.pros}</Text>
        </View>
        <View style={s.col}>
          <Text style={s.consLabel}>Cons</Text>
          <Text style={s.bodyText}>{r.cons}</Text>
        </View>
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
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  left: { flex: 1 },
  nameRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8 },
  company: { fontSize: 15, fontWeight: '500', color: C.ink },
  meta: { fontSize: 12, fontFamily: F.mono, color: C.muted, marginTop: 2 },
  stats: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  stat: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 8 },
  statLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  statVal: { fontSize: 12, fontFamily: F.mono, color: C.ink, marginTop: 2 },
  prosCons: { flexDirection: 'row', gap: 12 },
  col: { flex: 1 },
  prosLabel: { fontSize: 11, fontFamily: F.mono, textTransform: 'uppercase', letterSpacing: 1, color: C.teal500, marginBottom: 4 },
  consLabel: { fontSize: 11, fontFamily: F.mono, textTransform: 'uppercase', letterSpacing: 1, color: C.ember, marginBottom: 4 },
  bodyText: { fontSize: 13, color: C.ink2, lineHeight: 18 },
  salaryRow: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginTop: 12 },
  salaryText: { flex: 1, fontSize: 13 },
  salaryAmt: { color: C.ink, fontWeight: '500' },
  salaryMeta: { color: C.muted },
});
