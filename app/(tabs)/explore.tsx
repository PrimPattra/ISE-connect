import { Icon } from '@/components/icon';
import { InterviewCard } from '@/components/reviews/interview-card';
import { QACard } from '@/components/reviews/qa-card';
import { ResourceCard } from '@/components/reviews/resource-card';
import { ReviewCard } from '@/components/reviews/review-card';
import { SalarySection } from '@/components/reviews/salary-section';
import { WriteResourceModal } from '@/components/reviews/write-resource-modal';
import { WriteReviewModal } from '@/components/reviews/write-review-modal';
import { AppLogo } from '@/components/ui/app-logo';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { SectionHeading } from '@/components/ui/section-heading';
import { Toast } from '@/components/ui/toast';
import { Tooltip } from '@/components/ui/tooltip';
import { C, F } from '@/constants/theme';
import { useAppContext } from '@/context/app-context';
import * as api from '@/services/api';
import { SEED_INTERVIEWS, SEED_QA } from '@/data/seed';
import { useState } from 'react';
import { LayoutAnimation, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Tab = 'reviews' | 'interviews' | 'resources' | 'qa';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'interviews', label: 'Interviews', icon: 'chat' },
  { id: 'resources', label: 'Resources', icon: 'doc' },
  { id: 'qa', label: 'Q&A', icon: 'users' },
];

export default function ReviewsScreen() {
  const { user, reviews, setReviews, resources, setResources, toastMsg, toast } = useAppContext();
  const [tab, setTab] = useState<Tab>('reviews');
  const [showSalaries, setShowSalaries] = useState(false);
  const [q, setQ] = useState('');
  const [openWrite, setOpenWrite] = useState(false);
  const [openWriteResource, setOpenWriteResource] = useState(false);

  const filtered = reviews.filter(r => !q || `${r.company} ${r.role}`.toLowerCase().includes(q.toLowerCase()));

  const submit = async (d: any) => {
    try {
      const newR = await api.reviews.create({
        company: d.company || 'Unnamed company',
        role: d.role || '—',
        review_text: d.reviewText || '—',
        salary: d.includeSalary && d.amount
          ? { amount: parseInt(d.amount, 10) || 0, currency: d.currency, period: d.period, role: d.salaryRole || d.role || '—' }
          : null,
        when: `${new Date().getFullYear()} · Just now`,
      });
      setReviews(rs => [newR, ...rs]);
      setOpenWrite(false);
      toast('Review posted anonymously.');
    } catch {
      toast('Failed to post review.');
    }
  };

  const submitResource = async (d: any) => {
    try {
      const resolvedKind = d.kind === 'other' ? (d.customKind || 'Other') : d.kind;
      const newRes = await api.resources.create({
        kind: resolvedKind,
        title: d.title || 'Untitled resource',
        author: user
          ? user.profile.cohort
            ? `${user.profile.name} · ${user.profile.cohort}`
            : user.profile.name
          : 'Anonymous',
        mins: 0,
        description: d.description || undefined,
        url: d.url || undefined,
        image: d.image || undefined,
      });
      setResources(rs => [newRes, ...rs]);
      setOpenWriteResource(false);
      toast('Resource shared.');
    } catch {
      toast('Failed to share resource.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <AppLogo />
        <SectionHeading kicker="02 · Workplace Reviews & Career Tips" title="What it's actually like inside." />

        <View style={s.tabRow}>
          {TABS.map(t => (
            <Tooltip key={t.id} label={t.label}>
              <TouchableOpacity
                style={[s.tabBtn, tab === t.id ? s.tabBtnActive : s.tabBtnInactive]}
                onPress={() => {
                  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                  setTab(t.id);
                }}
              >
                <Icon name={t.icon} size={14} color={tab === t.id ? C.paper : C.teal600} />
                {tab === t.id && <Text style={s.tabBtnText}>{t.label}</Text>}
              </TouchableOpacity>
            </Tooltip>
          ))}
          <View style={{ flex:1 }} />
          <TouchableOpacity
            style={[s.writeBtn, !['reviews', 'resources'].includes(tab) && s.writeBtnDisabled]}
            onPress={tab === 'reviews' ? () => setOpenWrite(true) : tab === 'resources' ? () => setOpenWriteResource(true) : undefined}
            activeOpacity={['reviews', 'resources'].includes(tab) ? 0.7 : 1}
          >
            <Icon name="plus" size={15} color={['reviews', 'resources'].includes(tab) ? C.paper : C.muted} />
          </TouchableOpacity>
        </View>

        {tab === 'reviews' && (
          <>
            <Card style={s.searchCard}>
              <View style={s.searchRow}>
                <Icon name="search" size={16} color={C.muted} />
                <TextInput style={s.searchInput} placeholder="Search company or role" placeholderTextColor={C.muted} value={q} onChangeText={setQ} />
              </View>
            </Card>
            <TouchableOpacity style={s.salaryToggle} onPress={() => setShowSalaries(v => !v)}>
              <View style={[s.checkbox, showSalaries && s.checkboxActive]}>
                {showSalaries && <Icon name="check" size={12} color={C.paper} />}
              </View>
              <Text style={s.salaryToggleLabel}>Salary transparency</Text>
            </TouchableOpacity>
            {showSalaries && <SalarySection reviews={reviews} />}
            {filtered.map(r => <ReviewCard key={r.id} r={r} showSalary={showSalaries} />)}
            {filtered.length === 0 && <EmptyState icon="star" title="No reviews match." body="Try a different company name." />}
          </>
        )}

        {tab === 'interviews' && SEED_INTERVIEWS.map(i => <InterviewCard key={i.id} i={i} />)}
        {tab === 'resources' && resources.map(r => <ResourceCard key={r.id} res={r} />)}
        {tab === 'qa' && SEED_QA.map(q => <QACard key={q.id} q={q} />)}
      </ScrollView>

      <WriteReviewModal open={openWrite} onClose={() => setOpenWrite(false)} onSubmit={submit} />
      <WriteResourceModal open={openWriteResource} onClose={() => setOpenWriteResource(false)} onSubmit={submitResource} />
      <Toast msg={toastMsg} />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  scroll: { padding: 16, paddingBottom: 32 },
  writeBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.teal600, alignItems: 'center', justifyContent: 'center', marginLeft: 'auto' },
  writeBtnDisabled: { backgroundColor: C.line },
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 14, alignSelf: 'stretch' },
  tabBtn: { height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  tabBtnInactive: { width: 40 },
  tabBtnActive: { flexDirection: 'row', gap: 6, paddingHorizontal: 12, borderRadius: 18, backgroundColor: C.teal600, borderColor: C.teal600 },
  tabBtnText: { fontSize: 13, color: C.paper, fontFamily: F.interSemiBold },
  searchCard: { padding: 10, marginBottom: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink, paddingVertical: 0 },
  salaryToggle: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  salaryToggleLabel: { fontSize: 13, color: C.ink2 },
  subheader: { fontFamily: F.interSemiBold, fontSize: 18, color: C.teal600, marginBottom: 12},
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
});