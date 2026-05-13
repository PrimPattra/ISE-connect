import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { AddProjectModal } from '@/components/profile/add-project-modal';
import { ProfileStat } from '@/components/profile/profile-stat';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { Tooltip } from '@/components/ui/tooltip';
import { Icon } from '@/components/icon';
import { SectionHeading } from '@/components/ui/section-heading';
import { TagPill } from '@/components/ui/tag-pill';
import { useAppContext } from '@/context/app-context';
import { C, F } from '@/constants/theme';
import type { Project } from '@/types';

export default function ProfileScreen() {
  const { user, jobs, projects, setProjects, toast } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [showcaseProject, setShowcaseProject] = useState<Project | null>(null);
  if (!user) return null;

  const saved = jobs.filter(j => j.saved);
  const initials = user.profile.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('');

  const handleAddProject = (data: { title: string; skills: string; description: string; projectLink: string }) => {
    setProjects(ps => [{
      id: 'pp' + (ps.length + 1),
      title: data.title,
      by: { name: user.profile.name, tag: user.profile.cohort || 'ISE' },
      collaborators: [],
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      description: data.description || 'No description provided.',
      projectLink: data.projectLink,
      contactInfo: user.profile.email || '',
      media: [],
      likes: 0, views: 0,
    }, ...ps]);
    toast('Project added.');
  };

  const handleEditProject = (data: { title: string; skills: string; description: string; projectLink: string }) => {
    if (!editProject) return;
    setProjects(ps => ps.map(p => p.id === editProject.id ? {
      ...p,
      title: data.title,
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      description: data.description || p.description,
      projectLink: data.projectLink,
    } : p));
    toast('Project updated.');
    setEditProject(null);
  };

  const handleAddToShowcase = () => {
    toast(`"${showcaseProject?.title}" added to Showcase.`);
    setShowcaseProject(null);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <SectionHeading kicker="Your profile" title={`${user.profile.name}.`} />

        <Card style={s.profileCard}>
          <View style={s.avatarRow}>
            <View style={s.avatar}><Text style={s.avatarText}>{initials}</Text></View>
            <View style={s.avatarInfo}>
              <Text style={s.name}>{user.profile.name}</Text>
              <Text style={s.email}>{user.profile.email}</Text>
              <View style={s.tags}>
                <TagPill dark>{user.profile.cohort}</TagPill>
                <TagPill>{user.profile.track}</TagPill>
              </View>
            </View>
          </View>
          <Text style={s.headline}>"{user.profile.headline}"</Text>
          <View style={s.divider} />
          <View style={s.stats}>
            <ProfileStat label="Saved" value={saved.length} />
            <ProfileStat label="Applied" value={3} />
            <ProfileStat label="Projects" value={projects.length} />
          </View>
          <View style={s.divider} />
          <Text style={s.skillsLabel}>Skills</Text>
          <View style={s.skills}>
            {(user.profile.skills || []).map((sk: string) => (
              <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>
            ))}
            <TouchableOpacity style={chip.add}>
              <Icon name="plus" size={11} color={C.ink2} />
              <Text style={chip.addText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={s.divider} />
          <TouchableOpacity style={s.editBtn}>
            <Icon name="edit" size={15} color={C.ink2} />
            <Text style={s.editBtnText}>Edit profile</Text>
          </TouchableOpacity>
        </Card>

        <Card style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Saved roles</Text>
            <Text style={s.sectionCount}>{saved.length} bookmarked</Text>
          </View>
          {saved.length === 0
            ? <EmptyState icon="bookmark" title="Nothing saved yet." body="Bookmark roles from the board." />
            : saved.map(j => (
              <View key={j.id} style={s.savedJob}>
                <View style={s.savedJobInfo}>
                  <Text style={s.savedJobTitle} numberOfLines={1}>{j.title}</Text>
                  <Text style={s.savedJobMeta}>{j.company} · {j.location}</Text>
                </View>
                <TagPill>{j.type}</TagPill>
              </View>
            ))
          }
        </Card>

        <Card style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Your portfolio</Text>
            <TouchableOpacity style={s.addBtn} onPress={() => setAddOpen(true)}>
              <Icon name="plus" size={14} color={C.teal600} />
            </TouchableOpacity>
          </View>
          <View style={s.portfolioGrid}>
            {projects.slice(0, 4).map(p => (
              <View key={p.id} style={s.portfolioItem}>
                <View style={s.portfolioMain}>
                  <Text style={s.portfolioTitle} numberOfLines={1}>{p.title}</Text>
                  <View style={s.portfolioChips}>
                    {p.skills.slice(0, 3).map(sk => <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>)}
                  </View>
                </View>
                <View style={s.portfolioActions}>
                  <Tooltip label="Edit">
                    <TouchableOpacity style={s.actionBtn} onPress={() => setEditProject(p)}>
                      <Icon name="edit" size={13} color={C.ink2} />
                    </TouchableOpacity>
                  </Tooltip>
                  <Tooltip label="Add to Showcase">
                    <TouchableOpacity style={[s.actionBtn, s.actionBtnBlue]} onPress={() => setShowcaseProject(p)}>
                      <Icon name="image" size={13} color={C.teal600} />
                    </TouchableOpacity>
                  </Tooltip>
                </View>
              </View>
            ))}
          </View>
        </Card>
      </ScrollView>

      <AddProjectModal open={addOpen} onClose={() => setAddOpen(false)} onAdd={handleAddProject} />

      <AddProjectModal
        open={!!editProject}
        onClose={() => setEditProject(null)}
        onAdd={handleAddProject}
        initialData={editProject ? {
          title: editProject.title,
          skills: editProject.skills.join(', '),
          description: editProject.description,
          projectLink: editProject.projectLink ?? '',
        } : undefined}
        onEdit={handleEditProject}
      />

      <Modal
        open={!!showcaseProject}
        onClose={() => setShowcaseProject(null)}
        title="Add to Showcase?"
        footer={
          <>
            <TouchableOpacity style={s.ghostBtn} onPress={() => setShowcaseProject(null)}>
              <Text style={s.ghostBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.primaryBtn} onPress={handleAddToShowcase}>
              <Text style={s.primaryBtnText}>Add to Showcase</Text>
              <Icon name="image" size={14} color={C.paper} />
            </TouchableOpacity>
          </>
        }
      >
        <Text style={s.confirmText}>
          <Text style={s.confirmTitle}>"{showcaseProject?.title}"</Text>
          {' '}will be published to the Showcase tab for the ISE community to see.
        </Text>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  scroll: { padding: 16, paddingBottom: 32 },
  profileCard: { padding: 16, marginBottom: 12 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: F.mono, color: C.ink2 },
  avatarInfo: { flex: 1 },
  name: { fontSize: 17, color: C.ink },
  email: { fontSize: 12, fontFamily: F.mono, color: C.muted, marginTop: 2 },
  tags: { flexDirection: 'row', gap: 6, marginTop: 6 },
  headline: { fontSize: 14, fontFamily: F.serif, fontStyle: 'italic', color: C.ink2, lineHeight: 20 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 14 },
  stats: { flexDirection: 'row', gap: 8 },
  skillsLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingVertical: 10 },
  editBtnText: { fontSize: 14, color: C.ink2 },
  section: { padding: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontFamily: F.serif, fontStyle: 'italic', color: C.ink },
  sectionCount: { fontSize: 12, fontFamily: F.mono, color: C.muted },
  savedJob: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6 },
  savedJobInfo: { flex: 1, marginRight: 8 },
  savedJobTitle: { fontSize: 14, color: C.ink },
  savedJobMeta: { fontSize: 12, color: C.muted, marginTop: 2 },
  addBtn: { padding: 6, borderRadius: 8, borderWidth: 1, borderColor: C.line },
  portfolioGrid: { gap: 8 },
  portfolioItem: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 10, gap: 8 },
  portfolioMain: { flex: 1 },
  portfolioTitle: { fontSize: 14, color: C.ink, marginBottom: 6 },
  portfolioChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  portfolioActions: { flexDirection: 'row', gap: 6 },
  actionBtn: { padding: 6, borderRadius: 7, borderWidth: 1, borderColor: C.line },
  actionBtnBlue: { borderColor: C.teal100 },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  ghostBtnText: { fontSize: 14, color: C.ink },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: C.teal600 },
  primaryBtnText: { fontSize: 14, color: C.paper, fontWeight: '500' },
  confirmText: { fontSize: 14, color: C.muted, lineHeight: 22 },
  confirmTitle: { color: C.ink, fontWeight: '500' },
});

const chip = StyleSheet.create({
  wrap: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
  add: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  addText: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
});
