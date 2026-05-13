import { StyleSheet, Text, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { C, F } from '@/constants/theme';
import type { Review } from '@/types';

function SalaryStat({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <View style={s.stat}>
      <Text style={s.statLabel}>{label}</Text>
      <Text style={s.statVal}>{value}</Text>
      <Text style={s.statSub}>{sub}</Text>
    </View>
  );
}

interface Props { reviews: Review[] }

export function SalarySection({ reviews }: Props) {
  const withSalary = reviews.filter(r => r.salary);
  const monthly = withSalary.filter(r => r.salary!.period === 'month').map(r => r.salary!.amount);
  const hourly = withSalary.filter(r => r.salary!.period === 'hour').map(r => r.salary!.amount);
  const avg = (xs: number[]) => xs.length ? Math.round(xs.reduce((a, b) => a + b, 0) / xs.length) : 0;

  return (
    <Card style={s.card}>
      <View style={s.header}>
        <View>
          <Text style={s.kicker}>Optional · folded into reviews</Text>
          <Text style={s.title}>Salary transparency</Text>
          <Text style={s.sub}>Aggregated from review submissions where the author opted to share.</Text>
        </View>
        <TagPill dark>{withSalary.length} of {reviews.length} shared</TagPill>
      </View>
      <View style={s.stats}>
        <SalaryStat label="Avg monthly" value={`฿${avg(monthly).toLocaleString()}`} sub={`${monthly.length} entries`} />
        <SalaryStat label="Avg hourly" value={`฿${avg(hourly).toLocaleString()}`} sub={`${hourly.length} entries`} />
        <SalaryStat label="Top role" value="ML Intern" sub="฿32k · Aksorn" />
      </View>
      <View style={s.divider} />
      {withSalary.map(r => (
        <View key={r.id} style={s.row}>
          <View style={s.rowLeft}>
            <Text style={s.rowRole}>{r.salary!.role}</Text>
            <Text style={s.rowCompany}>· {r.company}</Text>
          </View>
          <Text style={s.rowAmt}>{r.salary!.amount.toLocaleString()} {r.salary!.currency}/{r.salary!.period}</Text>
        </View>
      ))}
    </Card>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, marginBottom: 12 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 12 },
  kicker: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 24, fontFamily: F.interSemiBold, color: C.ink, marginTop: 2 },
  sub: { fontSize: 13, color: C.muted, marginTop: 4, maxWidth: 260 },
  stats: { flexDirection: 'row', gap: 8 },
  stat: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 10 },
  statLabel: { fontSize: 10, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  statVal: { fontSize: 22, fontFamily: F.interMedium, color: C.ink, marginTop: 4 },
  statSub: { fontSize: 11, color: C.muted, marginTop: 2 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 6 },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  rowRole: { fontSize: 13, color: C.ink2 },
  rowCompany: { fontSize: 12, color: C.muted },
  rowAmt: { fontSize: 13, fontFamily: F.mono, color: C.ink },
});
