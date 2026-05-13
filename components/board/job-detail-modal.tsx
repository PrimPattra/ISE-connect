import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TagPill } from '@/components/ui/tag-pill';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { Job } from '@/types';

interface Props {
  job: Job | null;
  onClose: () => void;
  isRecruiter?: boolean;
}

export function JobDetailModal({ job, onClose, isRecruiter }: Props) {
  if (!job) return null;
  const initials = job.poster.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('');

  const handleApply = () => {
    if (job.applicationLink) {
      Linking.openURL(job.applicationLink);
    }
  };

  return (
    <Modal
      open={!!job}
      onClose={onClose}
      title={job.title}
      footer={
        <>
          <TouchableOpacity style={[btn.base, btn.ghost]} onPress={onClose}>
            <Text style={btn.ghostText}>Close</Text>
          </TouchableOpacity>
          {!isRecruiter && (
            <TouchableOpacity style={[btn.base, btn.primary]} onPress={handleApply}>
              <Text style={btn.primaryText}>Apply</Text>
              <Icon name="send" size={15} color={C.paper} />
            </TouchableOpacity>
          )}
        </>
      }
    >
      <View style={s.tags}>
        <TagPill>{job.type}</TagPill>
        <TagPill>{job.period}</TagPill>
        <Text style={s.posted}>{job.posted}</Text>
      </View>
      <Text style={s.blurb}>{job.blurb}</Text>

      <Text style={s.h5}>What you'll do</Text>
      {['Own one core feature end-to-end with weekly demos.', 'Pair with a senior ICE alum on architecture decisions.', 'Write tests, ship to staging, and present at bi-weekly all-hands.'].map(l => (
        <View key={l} style={s.li}><Text style={s.bullet}>·</Text><Text style={s.liText}>{l}</Text></View>
      ))}

      <Text style={s.h5}>We're looking for</Text>
      <View style={s.chips}>{job.skills.map(sk => <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>)}</View>

      <Card style={s.posterCard}>
        <Text style={s.posterLabel}>Posted by</Text>
        <View style={s.posterRow}>
          <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
          <View>
            <Text style={s.posterName}>{job.poster.name}</Text>
            <Text style={s.posterRole}>{job.poster.role} · <Text style={s.mono}>{job.poster.tag}</Text></Text>
          </View>
        </View>
        <View style={s.divider} />
        {[['Location', job.location], ['Comp', job.comp], ['Period', job.period], ['Type', job.type]].map(([k, v]) => (
          <View key={k} style={s.dl}>
            <Text style={s.dt}>{k}</Text>
            <Text style={s.dd}>{v}</Text>
          </View>
        ))}
      </Card>
    </Modal>
  );
}

const s = StyleSheet.create({
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  posted: { fontSize: 12, fontFamily: F.mono, color: C.muted, alignSelf: 'center' },
  blurb: { fontSize: 14, color: C.ink2, lineHeight: 20, marginBottom: 16 },
  h5: { fontSize: 20, fontFamily: F.interSemiBold, color: C.ink, marginBottom: 8, marginTop: 16 },
  li: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  bullet: { color: C.muted, fontSize: 13 },
  liText: { fontSize: 13, color: C.ink2, flex: 1, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  posterCard: { padding: 14, marginTop: 8 },
  posterLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  posterRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 12, fontFamily: F.mono, color: C.ink2 },
  posterName: { fontSize: 14, color: C.ink },
  posterRole: { fontSize: 12, color: C.muted },
  mono: { fontFamily: F.mono },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 12 },
  dl: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dt: { fontSize: 13, color: C.muted },
  dd: { fontSize: 13, color: C.ink2 },
});

const chip = StyleSheet.create({
  wrap: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  ghost: { borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
