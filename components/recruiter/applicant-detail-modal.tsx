import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TagPill } from '@/components/ui/tag-pill';
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
  const initials = a.name.split(' ').map(w => w[0]).slice(0, 2).join('');

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
      <View style={s.profileRow}>
        <View style={[s.avatar, a.avatarColor ? { backgroundColor: a.avatarColor } : null]}>
          <Text style={s.avatarText}>{initials}</Text>
        </View>
        <View style={s.profileInfo}>
          <Text style={s.name}>{a.name}</Text>
          <Text style={s.appliedText}>Applied {a.applied}</Text>
          <View style={s.tags}>
            <TagPill dark>{a.tag}</TagPill>
            <TagPill>{a.track} track</TagPill>
          </View>
        </View>
      </View>

      <Text style={s.headline}>"{a.headline}"</Text>

      <View style={s.divider} />
      <Text style={s.sectionLabel}>Skills</Text>
      <View style={s.chips}>
        {a.skills.map(sk => (
          <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>
        ))}
      </View>

      <View style={s.divider} />
      <Text style={s.sectionLabel}>Portfolio</Text>
      {a.projects && a.projects.length > 0 ? (
        <View style={s.portfolioList}>
          {a.projects.map((p, i) => (
            <View key={i} style={s.projectCard}>
              <Text style={s.projectTitle}>{p.title}</Text>
              <View style={s.projectChips}>
                {p.skills.map(sk => (
                  <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>
                ))}
              </View>
            </View>
          ))}
        </View>
      ) : (
        <View style={s.emptyPortfolio}>
          <Icon name="image" size={20} color={C.muted} />
          <Text style={s.emptyText}>No portfolio items yet.</Text>
        </View>
      )}
    </Modal>
  );
}

const s = StyleSheet.create({
  profileRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 14 },
  avatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: C.teal600, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 16, fontFamily: F.mono, color: C.paper },
  profileInfo: { flex: 1, gap: 4 },
  name: { fontSize: 16, color: C.ink, fontWeight: '500' },
  appliedText: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 2 },
  headline: { fontSize: 15, fontFamily: F.interMedium, color: C.ink, lineHeight: 22, marginBottom: 4 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 12 },
  sectionLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  portfolioList: { gap: 8 },
  projectCard: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 12, backgroundColor: C.paper2 },
  projectTitle: { fontSize: 14, color: C.ink, marginBottom: 8 },
  projectChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  emptyPortfolio: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 16, paddingHorizontal: 12, borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, borderRadius: 10 },
  emptyText: { fontSize: 13, color: C.muted },
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
