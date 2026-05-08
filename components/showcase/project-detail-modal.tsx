import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { MediaThumb } from './media-thumb';
import { Icon } from '@/components/icon';
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
      <View style={s.thumbGrid}>
        {p.media.map((m, i) => <MediaThumb key={i} m={m} />)}
      </View>

      <Text style={s.summary}>{p.summary}</Text>

      <Text style={s.h5}>Skills & tools</Text>
      <View style={s.chips}>
        {p.skills.map(sk => <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>)}
      </View>

      {p.collaborators.length > 0 && (
        <>
          <Text style={s.h5}>Collaborators</Text>
          <View style={s.collabs}>
            {p.collaborators.map(c => (
              <View key={c.name} style={s.collab}>
                <View style={s.avatar}><Text style={s.avatarText}>{c.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</Text></View>
                <Text style={s.collabName}>{c.name}</Text>
                <Text style={s.collabTag}>{c.tag}</Text>
              </View>
            ))}
          </View>
        </>
      )}

      <Card style={s.authorCard}>
        <Text style={s.authorLabel}>Author</Text>
        <View style={s.authorRow}>
          <View style={s.bigAvatar}><Text style={s.bigAvatarText}>{initials}</Text></View>
          <View>
            <Text style={s.authorName}>{p.by.name}</Text>
            <Text style={s.authorTag}>{p.by.tag}</Text>
          </View>
        </View>
        <View style={s.divider} />
        <View style={s.statsRow}>
          <View style={s.statBox}><Text style={s.statLabel}>Views</Text><Text style={s.statVal}>{p.views}</Text></View>
          <View style={s.statBox}><Text style={s.statLabel}>Likes</Text><Text style={s.statVal}>{p.likes}</Text></View>
        </View>
        <TouchableOpacity style={s.shareBtn}>
          <Icon name="link" size={15} color={C.ink2} />
          <Text style={s.shareBtnText}>Copy share link</Text>
        </TouchableOpacity>
      </Card>
    </Modal>
  );
}

const s = StyleSheet.create({
  thumbGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 16 },
  summary: { fontSize: 14, color: C.ink2, lineHeight: 20, marginBottom: 12 },
  h5: { fontSize: 20, fontFamily: F.serif, fontStyle: 'italic', color: C.ink, marginBottom: 8, marginTop: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  collabs: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  collab: { flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: C.line, borderRadius: 99, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: C.paper2 },
  avatar: { width: 20, height: 20, borderRadius: 10, backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 9, fontFamily: F.mono, color: C.ink2 },
  collabName: { fontSize: 12, color: C.ink2 },
  collabTag: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  authorCard: { padding: 14, marginTop: 8 },
  authorLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  bigAvatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  bigAvatarText: { fontSize: 12, fontFamily: F.mono, color: C.ink2 },
  authorName: { fontSize: 14, color: C.ink },
  authorTag: { fontSize: 12, color: C.muted },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 10 },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 10 },
  statBox: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 8 },
  statLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  statVal: { fontSize: 14, fontFamily: F.mono, color: C.ink, marginTop: 2 },
  shareBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingVertical: 9 },
  shareBtnText: { fontSize: 14, color: C.ink2 },
});

const chip = StyleSheet.create({
  wrap: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
});
