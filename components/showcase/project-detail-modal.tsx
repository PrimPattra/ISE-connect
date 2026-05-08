import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icon';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';
import type { Project } from '@/types';

interface Props {
  p: Project | null;
  onClose: () => void;
}

export function ProjectDetailModal({ p, onClose }: Props) {
  if (!p) return null;
  const initials = p.by.name.split(' ').map(w => w[0]).slice(0, 2).join('');

  return (
    <Modal open={!!p} onClose={onClose} title={p.title}>
      {/* Header: creator | collaborators */}
      <View style={s.headerRow}>
        <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
        <View style={s.headerInfo}>
          <View style={s.creatorLine}>
            <Text style={s.creatorName}>{p.by.name}</Text>
            <Text style={s.creatorTag}>{p.by.tag}</Text>
          </View>
          {p.collaborators.length > 0 && (
            <View style={s.collabLine}>
              <Text style={s.collabLabel}>with </Text>
              {p.collaborators.map((c, i) => (
                <Text key={c.name} style={s.collabName}>
                  {c.name}<Text style={s.collabTag}> {c.tag}</Text>{i < p.collaborators.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Description */}
      <View style={s.descBox}>
        <Text style={s.description}>{p.description}</Text>
      </View>

      {/* Skill tags */}
      <Text style={s.sectionLabel}>Skills & tools</Text>
      <View style={s.pills}>
        {p.skills.map(sk => (
          <View key={sk} style={pill.wrap}><Text style={pill.text}>{sk}</Text></View>
        ))}
      </View>

      {/* Project link */}
      {!!p.projectLink && (
        <>
          <Text style={s.sectionLabel}>Project link</Text>
          <TouchableOpacity style={s.linkBtn} onPress={() => Linking.openURL(p.projectLink)}>
            <Ionicons name="link-outline" size={16} color={C.teal600} />
            <Text style={s.linkText}>{p.projectLink.replace(/^https?:\/\//, '')}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Contact info */}
      {!!p.contactInfo && (
        <>
          <Text style={s.sectionLabel}>Contact</Text>
          <Card style={s.contactCard}>
            <View style={s.contactRow}>
              <Ionicons name="mail-outline" size={15} color={C.teal500} />
              <Text style={s.contactText}>{p.contactInfo}</Text>
            </View>
          </Card>
        </>
      )}

      {/* Stats */}
      <View style={s.statsRow}>
        <View style={s.stat}>
          <Ionicons name="eye-outline" size={14} color={C.muted} />
          <Text style={s.statLabel}>Views</Text>
          <Text style={s.statVal}>{p.views}</Text>
        </View>
        <View style={s.stat}>
          <Ionicons name="heart-outline" size={14} color={C.muted} />
          <Text style={s.statLabel}>Likes</Text>
          <Text style={s.statVal}>{p.likes}</Text>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 16 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  avatarText: { fontSize: 12, fontFamily: F.mono, color: C.ink2 },
  headerInfo: { flex: 1 },
  creatorLine: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  creatorName: { fontSize: 14, fontWeight: '600', color: C.ink },
  creatorTag: { fontSize: 12, fontFamily: F.mono, color: C.muted },
  collabLine: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', marginTop: 2 },
  collabLabel: { fontSize: 12, color: C.muted },
  collabName: { fontSize: 12, color: C.ink2 },
  collabTag: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  descBox: { backgroundColor: C.paper2, borderRadius: 8, padding: 14, marginBottom: 16 },
  description: { fontSize: 14, color: C.ink2, lineHeight: 22 },
  sectionLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8, marginTop: 4 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  linkBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, marginBottom: 16 },
  linkText: { fontSize: 13, color: C.teal600, flex: 1 },
  contactCard: { padding: 14, marginBottom: 16 },
  contactRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  contactText: { fontSize: 13, color: C.ink2, flex: 1, lineHeight: 20 },
  statsRow: { flexDirection: 'row', gap: 10 },
  stat: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 10 },
  statLabel: { fontSize: 12, color: C.muted },
  statVal: { fontSize: 14, fontFamily: F.mono, color: C.ink, marginLeft: 'auto' as any },
});

const pill = StyleSheet.create({
  wrap: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
});
