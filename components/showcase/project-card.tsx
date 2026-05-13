import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';
import type { Project } from '@/types';

interface Props {
  p: Project;
  onOpen: (p: Project) => void;
}

export function ProjectCard({ p, onOpen }: Props) {
  const collaboratorNames = p.collaborators.map(c => c.name).join(', ');
  return (
    <TouchableOpacity onPress={() => onOpen(p)}>
      <Card style={s.card}>
        {/* Header: project name - creator | collaborators */}
        <View style={s.header}>
          <Text style={s.title} numberOfLines={2}>{p.title}</Text>
          <View style={s.peopleRow}>
            <Text style={s.creator}>{p.by.name}</Text>
            {p.collaborators.length > 0 && (
              <>
                <Text style={s.separator}> | </Text>
                <Text style={s.collabs} numberOfLines={1}>{collaboratorNames}</Text>
              </>
            )}
          </View>
          <View style={s.tagRow}>
            <Text style={s.cohortTag}>{p.by.tag}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={s.description} numberOfLines={3}>{p.description}</Text>

        {/* Skill tags as pills */}
        <View style={s.pills}>
          {p.skills.map(sk => (
            <View key={sk} style={pill.wrap}><Text style={pill.text}>{sk}</Text></View>
          ))}
        </View>

        {/* Project link */}
        {!!p.projectLink && (
          <View style={s.linkRow}>
            <Ionicons name="link-outline" size={13} color={C.teal600} />
            <Text style={s.linkText} numberOfLines={1}>{p.projectLink.replace(/^https?:\/\//, '')}</Text>
          </View>
        )}

        <View style={s.footer}>
          <View style={s.stats}>
            <Ionicons name="eye-outline" size={13} color={C.muted} />
            <Text style={s.statText}>{p.views}</Text>
            <Ionicons name="heart-outline" size={13} color={C.muted} />
            <Text style={s.statText}>{p.likes}</Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, marginBottom: 12 },
  header: { marginBottom: 10 },
  title: { fontSize: 16, fontWeight: '600', color: C.ink, lineHeight: 22, marginBottom: 4 },
  peopleRow: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap' },
  creator: { fontSize: 13, color: C.ink2, fontWeight: '500' },
  separator: { fontSize: 13, color: C.muted },
  collabs: { fontSize: 13, color: C.muted, flex: 1 },
  tagRow: { marginTop: 4 },
  cohortTag: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  description: { fontSize: 13, color: C.ink2, lineHeight: 20, marginBottom: 12 },
  pills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  linkRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  linkText: { fontSize: 12, color: C.teal600, flex: 1 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end' },
  stats: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  statText: { fontSize: 12, color: C.muted },
});

const pill = StyleSheet.create({
  wrap: { backgroundColor: C.teal50, borderWidth: 1, borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2, fontWeight: 'bold' },
});
