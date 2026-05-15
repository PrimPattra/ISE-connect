import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TagPill } from '@/components/ui/tag-pill';
import { Placeholder } from '@/components/ui/placeholder';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { Applicant, ApplicantStatus } from '@/types';

interface Props {
  a: Applicant | null;
  onClose: () => void;
  onMove: (id: string, status: ApplicantStatus) => void;
}

export function ApplicantDetailModal({ a, onClose, onMove }: Props) {
  if (!a) return null;
  return (
    <Modal
      open={!!a}
      onClose={onClose}
      title={a.name}
      footer={
        <>
          <TouchableOpacity style={[btn.base, btn.ghost]} onPress={onClose}>
            <Text style={btn.ghostText}>Close</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[btn.base, btn.primary]} onPress={() => { onMove(a.id, 'Interview'); onClose(); }}>
            <Text style={btn.primaryText}>Move to interview</Text>
            <Icon name="arrow-right" size={15} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      <View style={s.tags}>
        <TagPill dark>{a.tag}</TagPill>
        <TagPill>{a.track} track</TagPill>
        <Text style={s.applied}>Applied {a.applied}</Text>
      </View>
      <Text style={s.headline}>"{a.headline}"</Text>
      <View style={s.divider} />
      <Text style={s.sectionLabel}>Skills</Text>
      <View style={s.chips}>
        {a.skills.map(sk => <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>)}
      </View>
      <View style={s.divider} />
      <Text style={s.sectionLabel}>Pinned portfolio</Text>
      <View style={s.portfolio}>
        <Placeholder label="Project · Walking-tour app" aspectRatio={16 / 9} />
        <Placeholder label="Resume.pdf" aspectRatio={16 / 9} />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  tags: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 8, marginBottom: 12 },
  applied: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  headline: { fontSize: 20, fontFamily: F.interMedium, color: C.ink, lineHeight: 26, marginBottom: 12 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 12 },
  sectionLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  portfolio: { flexDirection: 'row', gap: 10 },
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
