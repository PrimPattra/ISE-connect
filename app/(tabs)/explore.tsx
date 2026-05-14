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
import { SEED_INTERVIEWS, SEED_QA } from '@/data/seed';
import { useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

type Tab = 'reviews' | 'interviews' | 'resources' | 'qa';

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: 'reviews', label: 'Reviews', icon: 'star' },
  { id: 'interviews', label: 'Interviews', icon: 'chat' },
  { id: 'resources', label: 'Resources', icon: 'doc' },
  { id: 'qa', label: 'Q&A', icon: 'users' },
];

export default function ReviewsScreen() {
  const { reviews, setReviews, resources, setResources, toastMsg, toast } = useAppContext();
  const [tab, setTab] = useState<Tab>('reviews');
  const [showSalaries, setShowSalaries] = useState(false);
  const [q, setQ] = useState('');
  const [openWrite, setOpenWrite] = useState(false);
  const [openWriteResource, setOpenWriteResource] = useState(false);

  const filtered = reviews.filter(r => !q || `${r.company} ${r.role}`.toLowerCase().includes(q.toLowerCase()));

  const submit = (d: any) => {
    const newR = {
      id: 'r' + (reviews.length + 1),
      company: d.company || 'Unnamed company',
      role: d.role || '—',
      reviewText: d.reviewText || '—',
      salary: d.includeSalary && d.amount
        ? { amount: parseInt(d.amount, 10) || 0, currency: d.currency, period: d.period, role: d.salaryRole || d.role || '—' }
        : null,
      when: '2026 · Just now',
      by: 'Anonymous · You',
    };
    setReviews(rs => [newR, ...rs]);
    setOpenWrite(false);
    toast('Review posted anonymously.');
  };

  const submitResource = (d: any) => {
    const kind = d.kind === 'other' ? (d.customKind || 'Other') : d.kind;
    setResources(rs => [{
      id: 'res' + (rs.length + 1),
      kind,
      title: d.title || 'Untitled resource',
      author: 'Anonymous · You',
      mins: 0,
      description: d.description || undefined,
      url: d.url || undefined,
    }, ...rs]);
    setOpenWriteResource(false);
    toast('Resource shared anonymously.');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.scroll}>
        <AppLogo />
        <SectionHeading kicker="02 · Workplace Reviews & Career Tips" title="What it's actually like inside.">
          <Tooltip label="Write a review">
            <TouchableOpacity style={s.writeBtn} onPress={() => setOpenWrite(true)}>
              <Icon name="plus" size={15} color={C.paper} />
            </TouchableOpacity>
          </Tooltip>
        </SectionHeading>

        <View style={s.tabRow}>
          {TABS.map(t => (
            <Tooltip key={t.id} label={t.label}>
              <TouchableOpacity style={[s.tabBtn, tab === t.id && s.tabBtnActive]} onPress={() => setTab(t.id)}>
                <Icon name={t.icon} size={14} color={tab === t.id ? C.paper : C.teal600} />
              </TouchableOpacity>
            </Tooltip>
          ))}
        </View>
        <View style={s.tabRow}>
          <Text style={s.tabSubheader}>{TABS.find(t => t.id === tab)?.label}</Text>
          <View style={{ flex:1 }} />
          <TouchableOpacity
            style={[s.writeBtn, !['reviews', 'resources'].includes(tab) && s.writeBtnDisabled]}
            onPress={() => {
              if (tab === 'reviews') setOpenWrite(true);
              else if (tab === 'resources') setOpenWriteResource(true);
            }}
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
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 6, alignSelf: 'stretch' },
  tabSubheader: { fontFamily: F.interSemiBold, fontSize: 18, color: C.teal600, marginBottom: 12},
  tabBtn: { width: 40, height: 36, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  tabBtnActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  searchCard: { padding: 10, marginBottom: 10 },
  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: C.ink },
  salaryToggle: { marginBottom: 12 },
  checkbox: { width: 18, height: 18, borderRadius: 4, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
});
