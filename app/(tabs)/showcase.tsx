import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { ProjectCard } from '@/components/showcase/project-card';
import { ProjectDetailModal } from '@/components/showcase/project-detail-modal';
import { AppLogo } from '@/components/ui/app-logo';
import { SectionHeading } from '@/components/ui/section-heading';
import { EmptyState } from '@/components/ui/empty-state';
import { Toast } from '@/components/ui/toast';
import { Card } from '@/components/ui/card';
import { Icon } from '@/components/icon';
import { useAppContext } from '@/context/app-context';
import { C } from '@/constants/theme';
import type { Project } from '@/types';

export default function ShowcaseScreen() {
  const { user, projects, setProjects, toastMsg, toast } = useAppContext();
  const [open, setOpen] = useState<Project | null>(null);
  const [q, setQ] = useState('');

  const filtered = projects.filter(p => !q || `${p.title} ${p.skills.join(' ')}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <AppLogo />
        <SectionHeading kicker="03 · Project Showcase & Portfolio" title="Work made by ISE." />

        <Card style={s.searchCard}>
          <View style={s.searchRow}>
            <Icon name="search" size={16} color={C.muted} />
            <TextInput
              style={s.searchInput}
              placeholder="Search by skill, tool, or title"
              placeholderTextColor={C.muted}
              value={q}
              onChangeText={setQ}
            />
          </View>
        </Card>

        {filtered.map(p => <ProjectCard key={p.id} p={p} onOpen={setOpen} />)}
        {filtered.length === 0 && (
          <EmptyState icon="image" title="No projects found." body="Try clearing the search or add a new project." />
        )}
      </ScrollView>

      <ProjectDetailModal p={open} onClose={() => setOpen(null)} />
      <Toast msg={toastMsg} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  scroll: { padding: 16, paddingBottom: 32 },
  searchCard: { padding: 10, marginBottom: 14 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink },
});
