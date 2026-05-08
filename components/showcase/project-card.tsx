import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { MediaThumb } from './media-thumb';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';
import type { Project } from '@/types';

interface Props {
  p: Project;
  onOpen: (p: Project) => void;
}

export function ProjectCard({ p, onOpen }: Props) {
  const initials = p.by.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <TouchableOpacity onPress={() => onOpen(p)}>
      <Card style={s.card}>
        <View style={s.thumbRow}>
          {p.media.slice(0, 3).map((m, i) => <MediaThumb key={i} m={m} />)}
        </View>
        <View style={s.body}>
          <View style={s.titleRow}>
            <Text style={s.title} numberOfLines={2}>{p.title}</Text>
            <Text style={s.views}>{p.views} views</Text>
          </View>
          <Text style={s.summary} numberOfLines={2}>{p.summary}</Text>
          <View style={s.chips}>
            {p.skills.slice(0, 4).map(sk => (
              <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>
            ))}
          </View>
          <View style={s.divider} />
          <View style={s.footer}>
            <View style={s.author}>
              <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
              <Text style={s.authorName}>{p.by.name}</Text>
              <TagPill>{p.by.tag}</TagPill>
            </View>
            <View style={s.likes}>
              <Ionicons name="star" size={13} color={C.ember} />
              <Text style={s.likesText}>{p.likes}</Text>
            </View>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { overflow: 'hidden', marginBottom: 12 },
  thumbRow: { flexDirection: 'row', gap: 4, padding: 6, backgroundColor: C.paper2 },
  body: { padding: 14 },
  titleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 },
  title: { fontSize: 15, fontWeight: '500', color: C.ink, flex: 1, lineHeight: 20 },
  views: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  summary: { fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 18 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 8 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 10 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  author: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  avatar: { width: 24, height: 24, borderRadius: 12, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 10, fontFamily: F.mono, color: C.ink2 },
  authorName: { fontSize: 12, color: C.ink2 },
  likes: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  likesText: { fontSize: 12, color: C.ember },
});

const chip = StyleSheet.create({
  wrap: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
});
