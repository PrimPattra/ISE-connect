import { JobDetailModal } from '@/components/board/job-detail-modal';
import { Icon } from '@/components/icon';
import { AddProjectModal } from '@/components/profile/add-project-modal';
import { EditProfileModal } from '@/components/profile/edit-profile-modal';
import { ProfileStat } from '@/components/profile/profile-stat';
import { ProjectDetailModal } from '@/components/showcase/project-detail-modal';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { SectionHeading } from '@/components/ui/section-heading';
import { TagPill } from '@/components/ui/tag-pill';
import { Tooltip } from '@/components/ui/tooltip';
import { C, F } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';
import type { Project, ProjectFormData } from '@/types';
import { useRef, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const { user, setUser, jobs, projects, setProjects, toast } = useAppContext();
  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [viewProject, setViewProject] = useState<Project | null>(null);
  const [viewJob, setViewJob] = useState<typeof jobs[0] | null>(null);
  const [showcaseProject, setShowcaseProject] = useState<Project | null>(null);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [newSkill, setNewSkill] = useState('');
  const scrollRef = useRef<ScrollView>(null);
  const savedY = useRef(0);
  const portfolioY = useRef(0);
  if (!user) return null;

  const saved = jobs.filter(j => j.saved);
  const initials = user.profile.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('');

  const handleAddProject = (data: ProjectFormData) => {
    setProjects(ps => [{
      id: 'pp' + (ps.length + 1),
      title: data.title,
      by: { name: user.profile.name, tag: user.profile.cohort || 'ISE' },
      collaborators: data.collaborators.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name, tag: '' })),
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      description: data.description || 'No description provided.',
      projectLink: data.projectLink,
      contactInfo: data.contactInfo || user.profile.email || '',
      media: [],
      likes: 0, views: 0,
    }, ...ps]);
    toast('Project added.');
  };

  const handleEditProject = (data: ProjectFormData) => {
    if (!editProject) return;
    setProjects(ps => ps.map(p => p.id === editProject.id ? {
      ...p,
      title: data.title,
      collaborators: data.collaborators.split(',').map(s => s.trim()).filter(Boolean).map(name => ({ name, tag: '' })),
      skills: data.skills.split(',').map(s => s.trim()).filter(Boolean),
      description: data.description || p.description,
      projectLink: data.projectLink,
      contactInfo: data.contactInfo || p.contactInfo,
    } : p));
    toast('Project updated.');
    setEditProject(null);
  };

  const handleSaveProfile = ({ headline, avatarColor }: { headline: string; avatarColor: string }) => {
    setUser({ ...user, profile: { ...user.profile, headline, avatarColor } });
    toast('Profile updated.');
  };

  const handleAddSkill = () => {
    const skill = newSkill.trim();
    if (!skill) return;
    const current = user.profile.skills ?? [];
    if (!current.includes(skill)) {
      setUser({ ...user, profile: { ...user.profile, skills: [...current, skill] } });
    }
    setNewSkill('');
    setAddSkillOpen(false);
    toast('Skill added.');
  };

  const handleAddToShowcase = () => {
    toast(`"${showcaseProject?.title}" added to Showcase.`);
    setShowcaseProject(null);
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView ref={scrollRef} contentContainerStyle={s.scroll}>
        <SectionHeading kicker="Your profile" title={`${user.profile.name}.`}>
          <Tooltip label="Sign out">
            <TouchableOpacity style={s.signOutBtn} onPress={() => setSignOutOpen(true)}>
              <Icon name="logout" size={16} color={C.muted} />
            </TouchableOpacity>
          </Tooltip>
        </SectionHeading>

        <Card style={s.profileCard}>
          <View style={s.avatarRow}>
            <View style={[s.avatar, user.profile.avatarColor ? { backgroundColor: user.profile.avatarColor } : null]}><Text style={s.avatarText}>{initials}</Text></View>
            <View style={s.avatarInfo}>
              <Text style={s.name}>{user.profile.name}</Text>
              <Text style={s.email}>{user.profile.email}</Text>
              <View style={s.tags}>
                <TagPill dark>{user.profile.cohort}</TagPill>
                <TagPill dark>{user.profile.track}</TagPill>
              </View>
            </View>
          </View>
          <Text style={s.headline}>"{user.profile.headline}"</Text>
          <View style={s.darkDivider} />
          <View style={s.stats}>
            <ProfileStat label="Saved" value={saved.length} dark />
            <ProfileStat label="Applied" value={3} dark />
            <ProfileStat label="Projects" value={projects.length} dark />
          </View>
          <View style={s.darkDivider} />
          <Text style={s.skillsLabel}>Skills</Text>
          <View style={s.skills}>
            {(user.profile.skills || []).map((sk: string) => (
              <View key={sk} style={chip.darkWrap}><Text style={chip.darkText}>{sk}</Text></View>
            ))}
            <TouchableOpacity style={chip.darkAdd} onPress={() => setAddSkillOpen(true)}>
              <Icon name="plus" size={11} color={C.paper} />
              <Text style={chip.darkAddText}>Add</Text>
            </TouchableOpacity>
          </View>
          <View style={s.darkDivider} />
          <TouchableOpacity style={s.editBtn} onPress={() => setEditProfileOpen(true)}>
            <Icon name="edit" size={15} color={C.paper} />
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
              <TouchableOpacity key={j.id} style={s.savedJob} onPress={() => setViewJob(j)} activeOpacity={0.7}>
                <View style={s.savedJobInfo}>
                  <Text style={s.savedJobTitle} numberOfLines={1}>{j.title}</Text>
                  <Text style={s.savedJobMeta}>{j.company} · {j.location}</Text>
                </View>
                <View style={s.savedJobRight}>
                  <TagPill>{j.type}</TagPill>
                  <Icon name="arrow-right" size={14} color={C.muted} />
                </View>
              </TouchableOpacity>
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
              <TouchableOpacity key={p.id} style={s.portfolioItem} onPress={() => setViewProject(p)}>
                <View style={s.portfolioMain}>
                  <Text style={s.portfolioTitle} numberOfLines={1}>{p.title}</Text>
                  <View style={s.portfolioChips}>
                    {p.skills.slice(0, 3).map(sk => <View key={sk} style={chip.wrap}><Text style={chip.text}>{sk}</Text></View>)}
                  </View>
                </View>
                <Icon name="arrow-right" size={14} color={C.muted} />
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      </ScrollView>

      <JobDetailModal job={viewJob} onClose={() => setViewJob(null)} />

      <ProjectDetailModal
        p={viewProject}
        onClose={() => setViewProject(null)}
        hideStats
        onEdit={() => { setEditProject(viewProject); setViewProject(null); }}
        onAddToShowcase={() => { setShowcaseProject(viewProject); setViewProject(null); }}
      />
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
          contactInfo: editProject.contactInfo ?? '',
          collaborators: editProject.collaborators.map(c => c.name).join(', '),
        } : undefined}
        onEdit={handleEditProject}
      />

      <EditProfileModal
        open={editProfileOpen}
        onClose={() => setEditProfileOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      <Modal
        open={addSkillOpen}
        onClose={() => { setAddSkillOpen(false); setNewSkill(''); }}
        title="Add skill"
        footer={
          <>
            <TouchableOpacity style={s.ghostBtn} onPress={() => { setAddSkillOpen(false); setNewSkill(''); }}>
              <Text style={s.ghostBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.primaryBtn} onPress={handleAddSkill}>
              <Text style={s.primaryBtnText}>Add</Text>
              <Icon name="plus" size={14} color={C.paper} />
            </TouchableOpacity>
          </>
        }
      >
        <TextField
          placeholder="e.g. React Native"
          value={newSkill}
          onChangeText={setNewSkill}
          autoFocus
        />
      </Modal>

      <Modal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        title="Sign out?"
        footer={
          <>
            <TouchableOpacity style={s.ghostBtn} onPress={() => setSignOutOpen(false)}>
              <Text style={s.ghostBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.primaryBtn} onPress={() => setUser(null)}>
              <Icon name="logout" size={14} color={C.paper} />
              <Text style={s.primaryBtnText}>Sign out</Text>
            </TouchableOpacity>
          </>
        }
      >
        <Text style={s.confirmText}>You'll be returned to the sign-in screen.</Text>
      </Modal>

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
  profileCard: { padding: 16, marginBottom: 12, backgroundColor: C.teal600, borderColor: C.teal600 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 16, fontFamily: F.mono, color: C.paper },
  avatarInfo: { flex: 1 },
  name: { fontSize: 17, color: C.paper },
  email: { fontSize: 12, fontFamily: F.mono, color: 'rgba(251,251,251,0.6)', marginTop: 2 },
  tags: { flexDirection: 'row', gap: 6, marginTop: 6 },
  headline: { fontSize: 14, fontFamily: F.interMedium, color: 'rgba(251,251,251,0.85)', lineHeight: 20 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 14 },
  darkDivider: { height: 1, backgroundColor: 'rgba(255,255,255,0.18)', marginVertical: 14 },
  stats: { flexDirection: 'row', gap: 8 },
  skillsLabel: { fontSize: 11, fontFamily: F.mono, color: 'rgba(251,251,251,0.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  signOutBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: C.line },
  editBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 10, paddingVertical: 10 },
  editBtnText: { fontSize: 14, color: C.paper },
  section: { padding: 16, marginBottom: 12 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 22, fontFamily: F.interSemiBold, color: C.ink },
  sectionCount: { fontSize: 12, fontFamily: F.mono, color: C.muted },
  savedJob: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, marginBottom: 6 },
  savedJobInfo: { flex: 1, marginRight: 8 },
  savedJobRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  savedJobTitle: { fontSize: 14, color: C.ink },
  savedJobMeta: { fontSize: 12, color: C.muted, marginTop: 2 },
  addBtn: { padding: 6, borderRadius: 8, borderWidth: 1, borderColor: C.line },
  portfolioGrid: { gap: 8 },
  portfolioItem: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line, borderRadius: 8, padding: 10, gap: 8 },
  portfolioMain: { flex: 1 },
  portfolioTitle: { fontSize: 14, color: C.ink, marginBottom: 6 },
  portfolioChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  ghostBtnText: { fontSize: 14, color: C.ink },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: C.teal600 },
  primaryBtnText: { fontSize: 14, color: C.paper, fontWeight: '500' },
  confirmText: { fontSize: 14, color: C.muted, lineHeight: 22 },
  confirmTitle: { color: C.ink, fontWeight: '500' },
});

const chip = StyleSheet.create({
  wrap: { backgroundColor: C.teal50, borderWidth: 1, borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  text: { fontSize: 11, fontFamily: F.mono, color: C.ink2, fontWeight: 'bold' },
  add: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  addText: { fontSize: 11, fontFamily: F.mono, color: C.ink2 },
  darkWrap: { backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  darkText: { fontSize: 11, fontFamily: F.mono, color: C.paper, fontWeight: 'bold' },
  darkAdd: { flexDirection: 'row', alignItems: 'center', gap: 4, borderWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(255,255,255,0.3)', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 99 },
  darkAddText: { fontSize: 11, fontFamily: F.mono, color: C.paper },
});
