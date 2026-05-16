import * as api from '@/services/api';
import { JobCard } from '@/components/board/job-card';
import { JobDetailModal } from '@/components/board/job-detail-modal';
import { Icon } from '@/components/icon';
import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { Toast } from '@/components/ui/toast';
import { C, F } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';
import type { Job } from '@/types';
import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const TYPES = ['All', 'Full-time', 'Internship', 'Freelance', 'Research'];
const LOCS = ['All', 'Remote', 'Hybrid', 'On-site'];

export default function BoardScreen() {
  const { user, jobs, setJobs, toastMsg, toast } = useAppContext();
  const isRecruiter = user?.role === 'recruiter';
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [loc, setLoc] = useState('All');
  const [open, setOpen] = useState<Job | null>(null);

  const filtered = useMemo(() => jobs.filter(j => {
    if (type !== 'All' && j.type !== type) return false;
    if (loc !== 'All' && !j.location.toLowerCase().includes(loc.toLowerCase())) return false;
    if (q && !(`${j.title} ${j.company} ${j.skills.join(' ')}`).toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  }), [jobs, q, type, loc]);

  const toggleSave = async (id: string) => {
    setJobs(js => js.map(j => j.id === id ? { ...j, saved: !j.saved } : j));
    try {
      await api.jobs.toggleSave(id);
    } catch {
      // revert on failure
      setJobs(js => js.map(j => j.id === id ? { ...j, saved: !j.saved } : j));
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <AppLogo />
        {user?.role === 'hunter' && (
          <View style={s.hero}>
            <Text style={s.heroKicker}>Welcome back · {user.profile.cohort}</Text>
            <Text style={s.heroTitle}>Hello, {user.profile.name.split(' ')[0]}.{'\n'}<Text style={s.heroSub}>{jobs.length} roles open to ISE today.</Text></Text>
          </View>
        )}

        <SectionHeading kicker="01 · Recruiting Board" title="Roles open to ISE." />

        <Card style={s.filterCard}>
          <View style={s.searchRow}>
            <Icon name="search" size={16} color={C.muted} />
            <TextInput
              style={s.searchInput}
              placeholder="Search role, company, or skill"
              placeholderTextColor={C.muted}
              value={q}
              onChangeText={setQ}
            />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
            <View style={s.filterRow}>
              <Text style={s.filterLabel}>Type</Text>
              {TYPES.map(t => (
                <TouchableOpacity key={t} style={[s.chip, type === t && s.chipActive]} onPress={() => setType(t)}>
                  <Text style={[s.chipText, type === t && s.chipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.filterScroll}>
            <View style={s.filterRow}>
              <Text style={s.filterLabel}>Location</Text>
              {LOCS.map(l => (
                <TouchableOpacity key={l} style={[s.chip, loc === l && s.chipActive]} onPress={() => setLoc(l)}>
                  <Text style={[s.chipText, loc === l && s.chipTextActive]}>{l}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Card>

        {filtered.map(j => (
          <JobCard
            key={j.id}
            job={j}
            onOpen={setOpen}
            onSave={toggleSave}
            isRecruiter={isRecruiter}
            isOwnPosting={isRecruiter && j.company === user?.profile?.company}
          />
        ))}
        {filtered.length === 0 && (
          <EmptyState
            icon="search"
            title="No matches yet."
            body="Try clearing a filter, or save this search."
            action={
              <TouchableOpacity style={s.clearBtn} onPress={() => { setQ(''); setType('All'); setLoc('All'); }}>
                <Text style={s.clearBtnText}>Clear filters</Text>
              </TouchableOpacity>
            }
          />
        )}
      </ScrollView>

      <JobDetailModal job={open} onClose={() => setOpen(null)} isRecruiter={isRecruiter} />
      <Toast msg={toastMsg} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  scroll: { padding: 16, paddingBottom: 32 },
  hero: { backgroundColor: C.teal600, borderRadius: 16, padding: 20, marginBottom: 20 },
  heroKicker: { fontSize: 11, fontFamily: F.mono, color: 'rgba(244,240,232,0.7)', textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 8 },
  heroTitle: { fontSize: 32, fontFamily: F.interSemiBold, color: C.paper, lineHeight: 36 },
  heroSub: { fontSize: 28 ,color: 'rgba(244,240,232,0.85)' },
  filterCard: { padding: 12, marginBottom: 14 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink },
  filterScroll: { marginBottom: 2 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingBottom: 4 },
  filterLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  chip: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  chipActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  chipText: { fontSize: 12, color: C.ink2 },
  chipTextActive: { color: C.paper },
  clearBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  clearBtnText: { fontSize: 14, color: C.ink },
});
