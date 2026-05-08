import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';

interface Props {
  value: 'hunter' | 'recruiter';
  current: 'hunter' | 'recruiter';
  onPick: (v: 'hunter' | 'recruiter') => void;
  title: string;
  sub: string;
  bullets: string[];
  icon: string;
}

export function RoleCard({ value, current, onPick, title, sub, bullets, icon }: Props) {
  const active = value === current;
  return (
    <TouchableOpacity
      onPress={() => onPick(value)}
      style={[s.card, active ? s.cardActive : s.cardIdle]}
    >
      <View style={s.top}>
        <View style={[s.iconWrap, active ? s.iconActive : s.iconIdle]}>
          <Icon name={icon} size={20} color={active ? C.paper : C.teal600} />
        </View>
        <View style={[s.radio, active ? s.radioActive : s.radioIdle]}>
          {active && <Icon name="check" size={12} color={C.teal600} />}
        </View>
      </View>
      <Text style={[s.title, active && s.titleActive]}>{title}</Text>
      <Text style={[s.sub, active ? s.subActive : s.subIdle]}>{sub}</Text>
      <View style={s.bullets}>
        {bullets.map(b => (
          <View key={b} style={s.bulletRow}>
            <View style={[s.dot, active ? s.dotActive : s.dotIdle]} />
            <Text style={[s.bulletText, active ? s.bulletTextActive : s.bulletTextIdle]}>{b}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, borderRadius: 12, borderWidth: 1 },
  cardActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  cardIdle: { backgroundColor: C.paper, borderColor: C.line },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  iconWrap: { width: 40, height: 40, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  iconActive: { backgroundColor: 'rgba(244,240,232,0.15)' },
  iconIdle: { backgroundColor: C.paper2 },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  radioActive: { borderColor: C.paper, backgroundColor: C.paper },
  radioIdle: { borderColor: C.line },
  title: { fontSize: 22, fontFamily: F.serif, fontStyle: 'italic', color: C.paper, marginBottom: 2 },
  titleActive: { color: C.paper },
  sub: { fontSize: 13, marginBottom: 12 },
  subActive: { color: 'rgba(244,240,232,0.8)' },
  subIdle: { color: C.muted },
  bullets: { gap: 8 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  dot: { width: 4, height: 4, borderRadius: 2, marginTop: 6 },
  dotActive: { backgroundColor: C.paper },
  dotIdle: { backgroundColor: C.teal600 },
  bulletText: { fontSize: 12, flex: 1 },
  bulletTextActive: { color: 'rgba(244,240,232,0.9)' },
  bulletTextIdle: { color: C.ink2 },
});
