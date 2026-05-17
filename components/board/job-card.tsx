import { Icon } from '@/components/icon';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { Tooltip } from '@/components/ui/tooltip';
import { C, F } from '@/constants/theme';
import type { Job } from '@/types';
import { getInitials, timeAgo } from '@/utils/time';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  job: Job;
  onOpen: (j: Job) => void;
  onSave: (id: string) => void;
  isRecruiter?: boolean;
  isOwnPosting?: boolean;
}

export function JobCard({ job, onOpen, onSave, isRecruiter, isOwnPosting }: Props) {
  const initials = getInitials(job.company);
  return (
    <TouchableOpacity onPress={() => onOpen(job)}>
      <Card style={[s.card, isOwnPosting && s.ownCard]}>
        <View style={s.row}>
          <View style={s.logoBox}>
            <Text style={s.logoText}>{initials}</Text>
          </View>
          <View style={s.info}>
            <View style={s.titleRow}>
              <Text style={s.title} numberOfLines={1}>{job.title}</Text>
              <TagPill>{job.type}</TagPill>
              {isOwnPosting && <View style={s.ownBadge}><Text style={s.ownBadgeText}>Your posting</Text></View>}
            </View>
            <Text style={s.company}>{job.company} · <Text style={s.muted}>{job.companyTag}</Text></Text>
            <Text style={s.blurb} numberOfLines={2}>{job.blurb}</Text>
            <View style={s.chips}>
              {job.skills.slice(0, 4).map(s => (
                <View key={s} style={chip.wrap}><Text style={chip.text}>{s}</Text></View>
              ))}
            </View>
          </View>
          {!isRecruiter && (
            <Tooltip label={job.saved ? 'Saved' : 'Save'}>
              <TouchableOpacity
                onPress={() => onSave(job.id)}
                style={[s.saveBtn, job.saved && s.saveBtnActive]}
              >
                <Icon name="bookmark" size={16} color={job.saved ? C.paper : C.muted} />
              </TouchableOpacity>
            </Tooltip>
          )}
        </View>
        <View style={s.divider} />
        <View style={s.meta}>
          <View style={s.metaItem}><Icon name="pin" size={13} color={C.muted} /><Text style={s.metaText}>{job.location}</Text></View>
          <View style={s.metaItem}><Icon name="money" size={13} color={C.muted} /><Text style={s.metaText}>{job.comp}</Text></View>
          <Text style={s.posted}>{timeAgo(job.posted)}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, marginBottom: 10 },
  ownCard: { borderColor: C.teal500, borderWidth: 1.5 },
  ownBadge: { backgroundColor: C.teal50, borderWidth: 1, borderColor: C.teal100, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 99 },
  ownBadgeText: { fontSize: 10, fontFamily: F.mono, color: C.teal600 },
  row: { flexDirection: 'row', gap: 12 },
  logoBox: { width: 44, height: 44, borderRadius: 8, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 12, fontFamily: F.mono, color: C.muted },
  info: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  title: { fontSize: 15, fontWeight: '500', color: C.ink, flex: 1 },
  company: { fontSize: 13, color: C.ink2, marginTop: 2 },
  muted: { color: C.muted },
  blurb: { fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  saveBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: C.line, alignSelf: 'flex-start' },
  saveBtnActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 12 },
  meta: { flexDirection: 'row', alignItems: 'center', columnGap: 16, rowGap: 4, flexShrink: 1, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, fontFamily: F.mono, color: C.muted },
  posted: { marginLeft: 'auto', fontSize: 12, fontFamily: F.mono, color: C.muted },
});

const chip = StyleSheet.create({
  wrap: { backgroundColor: C.teal50, borderWidth: 1, borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2, fontWeight: 'bold' },
});
