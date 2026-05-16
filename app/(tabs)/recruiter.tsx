import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatTile } from '@/components/recruiter/stat-tile';
import { ApplicantRow } from '@/components/recruiter/applicant-row';
import { ApplicantDetailModal } from '@/components/recruiter/applicant-detail-modal';
import { RoleManageCard } from '@/components/recruiter/role-manage-card';
import { CandidateSearch } from '@/components/recruiter/candidate-search';
import { PostRoleModal } from '@/components/recruiter/post-role-modal';
import { SectionHeading } from '@/components/ui/section-heading';
import { Card } from '@/components/ui/card';
import { Modal } from '@/components/ui/modal';
import { Toast } from '@/components/ui/toast';
import { Tooltip } from '@/components/ui/tooltip';
import { Icon } from '@/components/icon';
import { useAppContext } from '@/context/app-context';
import { SEED_APPLICANTS } from '@/data/seed';
import { C, F } from '@/constants/theme';
import type { PostDraft } from '@/components/recruiter/post-role-modal';
import type { Applicant, ApplicantStatus, Job } from '@/types';

type Tab = 'dashboard' | 'roles' | 'candidates';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
  { id: 'roles', label: 'My roles', icon: 'briefcase' },
  { id: 'candidates', label: 'Candidates', icon: 'users' },
];

export default function RecruiterScreen() {
  const { user, setUser, jobs, setJobs, toastMsg, toast } = useAppContext();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [openPost, setOpenPost] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [openA, setOpenA] = useState<Applicant | null>(null);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const [applicants, setApplicants] = useState<Applicant[]>(SEED_APPLICANTS);

  const myJobIds = useMemo(() => {
    if (!user) return [];
    const own = jobs.filter(j => j.company === user.profile.company).map(j => j.id);
    return own.length ? own : jobs.slice(0, 2).map(j => j.id);
  }, [jobs, user?.profile.company]);

  const myJobs = jobs.filter(j => myJobIds.includes(j.id));
  const myApplicants = applicants.filter(a => myJobIds.includes(a.jobId));

  const move = (aid: string, status: ApplicantStatus) =>
    setApplicants(xs => xs.map(a => a.id === aid ? { ...a, status } : a));

  const closeRole = (jid: string) => {
    setJobs(js => js.filter(j => j.id !== jid));
    toast('Role closed.');
  };

  const edit = (jid: string, d: PostDraft) => {
    setJobs(js => js.map(j => j.id === jid
      ? { ...j, title: d.title, type: d.type as any, location: d.location, comp: d.comp, period: d.period, skills: d.skills, blurb: d.blurb, duties: d.duties, applicationLink: d.applicationLink }
      : j
    ));
    setEditingJob(null);
    toast('Role updated.');
  };

  const post = (d: any) => {
    const newJob = {
      id: 'jr' + (jobs.length + 1),
      title: d.title || 'Untitled role',
      company: user!.profile.company,
      companyTag: user!.profile.cohort || '',
      type: d.type,
      location: d.location,
      comp: d.comp || 'Negotiable',
      posted: 'just now',
      skills: Array.isArray(d.skills) ? d.skills : d.skills.split(',').map((s: string) => s.trim()).filter(Boolean),
      poster: { name: user!.profile.name, tag: user!.profile.cohort || 'Employer', role: user!.profile.position },
      blurb: d.blurb || 'Ask the recruiter for the full description.',
      duties: d.duties || '',
      period: d.period || '',
      applicationLink: d.applicationLink || '',
      saved: false,
    };
    setJobs(js => [newJob as any, ...js]);
    setOpenPost(false);
    toast(`Role posted: ${newJob.title}.`);
  };

  if (!user) return null;
  const newCount = myApplicants.filter(a => a.status === 'New').length;
  const inLoop = myApplicants.filter(a => ['Reviewing', 'Interview'].includes(a.status)).length;
  const hired = myApplicants.filter(a => a.status === 'Hired').length;

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <SectionHeading kicker={`Recruiter · ${user.profile.company}`} title="Hire from the ISE network.">
          <TouchableOpacity style={s.postBtn} onPress={() => setOpenPost(true)}>
            <Icon name="plus" size={15} color={C.paper} />
            <Text style={s.postBtnText}>Post a role</Text>
          </TouchableOpacity>
          <Tooltip label="Sign out">
            <TouchableOpacity style={s.signOutBtn} onPress={() => setSignOutOpen(true)}>
              <Icon name="logout" size={16} color={C.muted} />
            </TouchableOpacity>
          </Tooltip>
        </SectionHeading>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabScroll}>
          <View style={s.tabRow}>
            {TABS.map(t => (
              <TouchableOpacity key={t.id} style={[s.tabBtn, tab === t.id && s.tabBtnActive]} onPress={() => setTab(t.id)}>
                <Icon name={t.icon} size={14} color={tab === t.id ? C.paper : C.ink2} />
                <Text style={[s.tabText, tab === t.id && s.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {tab === 'dashboard' && (
          <>
            <View style={s.tiles}>
              <StatTile label="Open roles" value={myJobs.length} sub="Listed on the board" icon="briefcase" />
              <StatTile label="New applicants" value={newCount} sub="Need first review" accent={newCount > 0} icon="users" />
            </View>
            <View style={s.tiles}>
              <StatTile label="In hiring loop" value={inLoop} sub="Reviewing or interviewing" icon="send" />
              <StatTile label="Hired this cycle" value={hired} sub="Welcome to the team" icon="star" />
            </View>

            <Card style={s.recentCard}>
              <View style={s.cardHeader}>
                <Text style={s.cardTitle}>Recent applicants</Text>
                <TouchableOpacity onPress={() => setTab('roles')}><Text style={s.viewAll}>View all →</Text></TouchableOpacity>
              </View>
              {myApplicants.slice(0, 5).map(a => <ApplicantRow key={a.id} a={a} onMove={move} onOpen={setOpenA} />)}
              {myApplicants.length === 0 && (
                <View style={s.empty}><Text style={s.emptyText}>No applicants yet.</Text></View>
              )}
            </Card>

            <Card style={s.companyCard}>
              <Text style={s.compKicker}>Company</Text>
              <Text style={s.compName}>{user.profile.company}</Text>
              <View style={s.divider} />
              {[['Posting as', user.profile.name], ['Title', user.profile.position], ['Tag', user.profile.cohort || 'Employer']].map(([k, v]) => (
                <View key={k} style={s.dl}>
                  <Text style={s.dt}>{k}</Text>
                  <Text style={s.dd}>{v}</Text>
                </View>
              ))}
            </Card>
          </>
        )}

        {tab === 'roles' && (
          myJobs.length > 0
            ? myJobs.map(j => (
              <RoleManageCard
                key={j.id}
                job={j}
                applicants={applicants.filter(a => a.jobId === j.id)}
                onMove={move}
                onOpen={setOpenA}
                onClose={closeRole}
                onEditOpen={setEditingJob}
              />
            ))
            : (
              <View style={s.emptyCenter}>
                <Icon name="briefcase" size={28} color={C.muted} />
                <Text style={s.emptyTitle}>No open roles.</Text>
                <TouchableOpacity style={s.postBtn2} onPress={() => setOpenPost(true)}>
                  <Icon name="plus" size={15} color={C.paper} />
                  <Text style={s.postBtnText}>Post a role</Text>
                </TouchableOpacity>
              </View>
            )
        )}

        {tab === 'candidates' && <CandidateSearch applicants={applicants} />}
      </ScrollView>

      <Modal
        open={signOutOpen}
        onClose={() => setSignOutOpen(false)}
        title="Sign out?"
        footer={
          <>
            <TouchableOpacity style={s.ghostBtn} onPress={() => setSignOutOpen(false)}>
              <Text style={s.ghostBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.signOutConfirmBtn} onPress={() => setUser(null)}>
              <Icon name="logout" size={14} color={C.paper} />
              <Text style={s.signOutConfirmText}>Sign out</Text>
            </TouchableOpacity>
          </>
        }
      >
        <Text style={s.confirmText}>You'll be returned to the sign-in screen.</Text>
      </Modal>

      <PostRoleModal
        open={openPost}
        onClose={() => setOpenPost(false)}
        onPost={post}
        recruiterCompany={user.profile.company ?? ''}
        recruiterCompanyTag={user.profile.companyTag ?? ''}
      />
      <PostRoleModal
        open={editingJob !== null}
        onClose={() => setEditingJob(null)}
        onPost={d => editingJob && edit(editingJob.id, d)}
        recruiterCompany={user.profile.company ?? ''}
        recruiterCompanyTag={user.profile.companyTag ?? ''}
        initialDraft={editingJob ? {
          title: editingJob.title,
          type: editingJob.type,
          location: editingJob.location,
          comp: editingJob.comp,
          period: editingJob.period,
          skills: [...editingJob.skills],
          blurb: editingJob.blurb,
          applicationLink: editingJob.applicationLink,
        } : undefined}
      />
      <ApplicantDetailModal a={openA} onClose={() => setOpenA(null)} onMove={move} />
      <Toast msg={toastMsg} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  scroll: { padding: 16, paddingBottom: 32 },
  postBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.teal600, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  signOutBtn: { padding: 8, borderRadius: 8, borderWidth: 1, borderColor: C.line },
  postBtnText: { fontSize: 13, fontWeight: '500', color: C.paper },
  tabScroll: { marginBottom: 14 },
  tabRow: { flexDirection: 'row', gap: 8 },
  tabBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  tabBtnActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  tabText: { fontSize: 13, color: C.ink2 },
  tabTextActive: { color: C.paper },
  tiles: { flexDirection: 'row', gap: 10, marginBottom: 10 },
  recentCard: { padding: 16, marginTop: 4, marginBottom: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  cardTitle: { fontSize: 22, fontFamily: F.interSemiBold, color: C.ink },
  viewAll: { fontSize: 12, color: C.teal600 },
  empty: { padding: 20, alignItems: 'center' },
  emptyText: { fontSize: 13, color: C.muted },
  companyCard: { padding: 16, marginBottom: 10 },
  compKicker: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  compName: { fontSize: 22, fontFamily: F.interSemiBold, color: C.ink, marginTop: 4 },
  compTag: { fontSize: 13, color: C.muted, marginTop: 2 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 12 },
  dl: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  dt: { fontSize: 13, color: C.muted },
  dd: { fontSize: 13, color: C.ink2, fontFamily: F.mono },
  emptyCenter: { alignItems: 'center', paddingVertical: 48, gap: 12 },
  emptyTitle: { fontSize: 18, color: C.muted },
  postBtn2: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.teal600, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  ghostBtnText: { fontSize: 14, color: C.ink },
  signOutConfirmBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: C.ink },
  signOutConfirmText: { fontSize: 14, color: C.paper, fontWeight: '500' },
  confirmText: { fontSize: 14, color: C.muted, lineHeight: 22 },
});
