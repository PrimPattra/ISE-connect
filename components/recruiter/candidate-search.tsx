import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { Applicant } from '@/types';

interface Props { applicants: Applicant[] }

export function CandidateSearch({ applicants }: Props) {
  const [q, setQ] = useState('');
  const [cohort, setCohort] = useState('All');
  const cohorts = ['All', ...Array.from(new Set(applicants.map(a => a.tag)))];
  const filtered = applicants.filter(a => {
    if (cohort !== 'All' && a.tag !== cohort) return false;
    if (q && !`${a.name} ${a.headline} ${a.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <Card style={s.card}>
      <Text style={s.kicker}>Sourcing</Text>
      <Text style={s.title}>Candidate search</Text>
      <Text style={s.sub}>Filter the ISE talent pool by skill and cohort.</Text>

      <View style={s.searchWrap}>
        <Icon name="search" size={16} color={C.muted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search by skill, e.g. PyTorch, Figma"
          placeholderTextColor={C.muted}
          value={q}
          onChangeText={setQ}
        />
      </View>

      <Text style={s.filterLabel}>Cohort</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.cohortScroll}>
        <View style={s.cohortRow}>
          {cohorts.map(c => (
            <TouchableOpacity key={c} style={[s.cohortBtn, cohort === c && s.cohortBtnActive]} onPress={() => setCohort(c)}>
              <Text style={[s.cohortText, cohort === c && s.cohortTextActive]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {filtered.map(a => (
        <View key={a.id} style={s.candidate}>
          <View style={s.avatar}><Text style={s.avatarText}>{a.name.split(' ').map(w => w[0]).slice(0, 2).join('')}</Text></View>
          <View style={s.info}>
            <View style={s.nameRow}>
              <Text style={s.name}>{a.name}</Text>
              <TagPill>{a.tag}</TagPill>
            </View>
            <Text style={s.headline} numberOfLines={1}>{a.headline}</Text>
          </View>
          <TouchableOpacity style={s.msgBtn}>
            <Icon name="send" size={14} color={C.ink2} />
          </TouchableOpacity>
        </View>
      ))}
      {filtered.length === 0 && (
        <View style={s.empty}><Text style={s.emptyText}>No candidates match — try widening cohort or skill.</Text></View>
      )}
    </Card>
  );
}

const s = StyleSheet.create({
  card: { padding: 16, marginBottom: 12 },
  kicker: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  title: { fontSize: 24, fontFamily: F.interSemiBold, color: C.ink, marginTop: 2 },
  sub: { fontSize: 12, color: C.muted, marginTop: 4, marginBottom: 14 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: C.paper, marginBottom: 12 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink },
  filterLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  cohortScroll: { marginBottom: 14 },
  cohortRow: { flexDirection: 'row', gap: 6 },
  cohortBtn: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  cohortBtnActive: { backgroundColor: C.ink, borderColor: C.ink },
  cohortText: { fontSize: 12, color: C.ink2 },
  cohortTextActive: { color: C.paper },
  candidate: { flexDirection: 'row', alignItems: 'center', gap: 10, borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 10, backgroundColor: C.paper, marginBottom: 8 },
  avatar: { width: 40, height: 40, borderRadius: 20, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
  info: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  name: { fontSize: 14, color: C.ink },
  headline: { fontSize: 12, color: C.muted, marginTop: 2 },
  msgBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: C.line },
  empty: { borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, borderRadius: 8, padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 13, color: C.muted, textAlign: 'center' },
});
