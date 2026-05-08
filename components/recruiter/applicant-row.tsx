import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { TagPill } from '@/components/ui/tag-pill';
import { SelectField } from '@/components/ui/select-field';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { Applicant, ApplicantStatus } from '@/types';

const STAGES: ApplicantStatus[] = ['New', 'Reviewing', 'Interview', 'Hired', 'Pass'];
const STAGE_OPTIONS = STAGES.map(s => ({ value: s, label: s }));

interface Props {
  a: Applicant;
  onMove: (id: string, status: ApplicantStatus) => void;
  onOpen: (a: Applicant) => void;
}

export function ApplicantRow({ a, onMove, onOpen }: Props) {
  const initials = a.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <View style={s.row}>
      <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
      <View style={s.info}>
        <View style={s.nameRow}>
          <Text style={s.name} numberOfLines={1}>{a.name}</Text>
          <TagPill>{a.tag}</TagPill>
        </View>
        <Text style={s.headline} numberOfLines={1}>{a.headline}</Text>
      </View>
      <TouchableOpacity style={s.eyeBtn} onPress={() => onOpen(a)}>
        <Icon name="eye" size={16} color={C.ink2} />
      </TouchableOpacity>
      <View style={s.select}>
        <SelectField value={a.status} onChange={v => onMove(a.id, v as ApplicantStatus)} options={STAGE_OPTIONS} />
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 10, backgroundColor: C.paper, marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
  info: { flex: 1, minWidth: 0 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  name: { fontSize: 14, color: C.ink, flex: 1 },
  headline: { fontSize: 12, color: C.muted, marginTop: 2 },
  eyeBtn: { padding: 6, borderRadius: 8, borderWidth: 1, borderColor: C.line },
  select: { width: 120 },
});
