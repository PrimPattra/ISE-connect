import { Icon } from '@/components/icon';
import { Modal } from '@/components/ui/modal';
import { SelectField } from '@/components/ui/select-field';
import { SkillPicker } from '@/components/ui/skill-picker';
import { TextField } from '@/components/ui/text-field';
import { C } from '@/constants/theme';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export interface PostDraft {
  title: string; type: string; location: string;
  comp: string; period: string; skills: string[]; blurb: string; duties: string;
  applicationLink: string; requireCoverLetter: boolean; requirePortfolio: boolean;
}

const EMPTY_DRAFT: PostDraft = {
  title: '', type: 'Internship', location: 'On-site · Bangkok',
  comp: '', period: 'Off-cycle · Jun–Aug', skills: [], blurb: '', duties: '',
  applicationLink: '', requireCoverLetter: false, requirePortfolio: false,
};

type Errors = Partial<Record<'title' | 'blurb' | 'locCity', string>>;

interface Props {
  open: boolean;
  onClose: () => void;
  onPost: (d: PostDraft) => void;
  recruiterCompany: string;
  recruiterCompanyTag: string;
  initialDraft?: Partial<PostDraft>;
}

export function PostRoleModal({ open, onClose, onPost, recruiterCompany, recruiterCompanyTag, initialDraft }: Props) {
  const [tab, setTab] = useState<'details' | 'form'>('details');
  const [d, setD] = useState<PostDraft>({ ...EMPTY_DRAFT, ...initialDraft });
  const [errors, setErrors] = useState<Errors>({});
  const [compAmount, setCompAmount] = useState('');
  const [compPeriod, setCompPeriod] = useState('month');
  const [compCurrency, setCompCurrency] = useState('THB');
  const [locType, setLocType] = useState('On-site');
  const [locCity, setLocCity] = useState('Bangkok');

  const parseLocation = (loc: string) => {
    const parts = loc.split(' · ');
    return { type: parts[0] ?? 'On-site', city: parts[1] ?? 'Bangkok' };
  };

  useEffect(() => {
    if (open) {
      setTab('details');
      setD({ ...EMPTY_DRAFT, ...initialDraft });
      setErrors({});
      setCompAmount('');
      setCompPeriod('month');
      setCompCurrency('THB');
      const loc = parseLocation(initialDraft?.location ?? EMPTY_DRAFT.location);
      setLocType(loc.type);
      setLocCity(loc.city);
    }
  }, [open, initialDraft]);

  const reset = () => {
    setTab('details');
    setD(EMPTY_DRAFT);
    setErrors({});
    setCompAmount('');
    setCompPeriod('month');
    setCompCurrency('THB');
    setLocType('On-site');
    setLocCity('Bangkok');
  };

  const upd = <K extends keyof PostDraft>(k: K, v: PostDraft[K]) => {
    setD(x => ({ ...x, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = (): Errors => {
    const e: Errors = {};
    if (!d.title.trim()) e.title = 'Role title is required.';
    if (!d.blurb.trim()) e.blurb = 'Job description is required.';
    if (locType !== 'Remote' && !locCity.trim()) e.locCity = 'City is required.';
    return e;
  };

  const buildFinalDraft = (): PostDraft => {
    const SYMBOL: Record<string, string> = { THB: '฿', USD: '$', EUR: '€' };
    const PERIOD_SHORT: Record<string, string> = { month: 'mo', hour: 'hr', year: 'yr' };
    const comp = compAmount.trim()
      ? `${SYMBOL[compCurrency] ?? compCurrency}${compAmount}/${PERIOD_SHORT[compPeriod] ?? compPeriod}`
      : 'Negotiable';
    const location = locType === 'Remote' ? 'Remote' : `${locType} · ${locCity.trim() || 'Bangkok'}`;
    return { ...d, comp, location };
  };

  const handlePublish = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      setTab('details');
      return;
    }
    onPost(buildFinalDraft());
    reset();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Post a new role"
      footer={
        <>
          <TouchableOpacity style={[btn.base, btn.ghost]} onPress={() => { reset(); onClose(); }}>
            <Text style={btn.ghostText}>Save draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[btn.base, btn.primary]} onPress={handlePublish}>
            <Text style={btn.primaryText}>Publish to ISE</Text>
            <Icon name="send" size={15} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      <View style={s.tabRow}>
        <TouchableOpacity style={[s.tabBtn, tab === 'details' && s.tabBtnActive]} onPress={() => setTab('details')}>
          <Text style={[s.tabText, tab === 'details' && s.tabTextActive]}>Role details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[s.tabBtn, tab === 'form' && s.tabBtnActive]} onPress={() => setTab('form')}>
          <Text style={[s.tabText, tab === 'form' && s.tabTextActive]}>Application form</Text>
        </TouchableOpacity>
      </View>

      {tab === 'details' && (
        <View style={s.fields}>
          <TextField
            label="Role title *"
            placeholder="e.g. Software Engineering Intern"
            value={d.title}
            onChangeText={v => upd('title', v)}
            error={errors.title}
          />
          <SelectField label="Type" value={d.type} onChange={v => upd('type', v)} options={['Internship', 'Full-time', 'Freelance', 'Research'].map(v => ({ value: v, label: v }))} />

          <View>
            <Text style={s.fieldLabel}>Location *</Text>
            <View style={s.locationRow}>
              <View style={{ flex: 1 }}>
                <TextField
                  placeholder="e.g. Bangkok"
                  value={locCity}
                  onChangeText={v => { setLocCity(v); setErrors(e => ({ ...e, locCity: undefined })); }}
                  editable={locType !== 'Remote'}
                  error={errors.locCity}
                />
              </View>
              <View style={s.locationSelect}>
                <SelectField
                  value={locType}
                  onChange={v => { setLocType(v); setErrors(e => ({ ...e, locCity: undefined })); }}
                  options={['On-site', 'Hybrid', 'Remote'].map(v => ({ value: v, label: v }))}
                />
              </View>
            </View>
          </View>

          <View>
            <Text style={s.fieldLabel}>Job description *</Text>
            <TextInput
              style={[s.textarea, !!errors.blurb && s.textareaError]}
              multiline
              numberOfLines={5}
              placeholder="Describe the role, responsibilities, and what makes your team unique…"
              placeholderTextColor={C.muted}
              value={d.blurb}
              onChangeText={v => upd('blurb', v)}
              textAlignVertical="top"
            />
            {!!errors.blurb && <Text style={s.errorText}>{errors.blurb}</Text>}
          </View>

          <View>
            <Text style={s.fieldLabel}>What you'll do</Text>
            <TextInput
              style={s.textarea}
              multiline
              numberOfLines={4}
              placeholder="e.g. Own a feature end-to-end, ship to production, present at team demos…"
              placeholderTextColor={C.muted}
              value={d.duties}
              onChangeText={v => upd('duties', v)}
              textAlignVertical="top"
            />
          </View>

          <View>
            <Text style={s.fieldLabel}>Skills required</Text>
            <SkillPicker key={String(open)} value={d.skills} onChange={skills => upd('skills', skills)} />
          </View>

          <TextField label="Period" placeholder="e.g. Off-cycle · Jun–Aug" value={d.period} onChangeText={v => upd('period', v)} />

          <View>
            <Text style={s.fieldLabel}>Compensation</Text>
            <View style={s.compBox}>
              <TextField label="Amount" placeholder="28000" value={compAmount} onChangeText={setCompAmount} keyboardType="numeric" />
              <SelectField label="Period" value={compPeriod} onChange={setCompPeriod} options={[{ value: 'month', label: 'per month' }, { value: 'hour', label: 'per hour' }, { value: 'year', label: 'per year' }]} />
              <SelectField label="Currency" value={compCurrency} onChange={setCompCurrency} options={[{ value: 'THB', label: 'THB ฿' }, { value: 'USD', label: 'USD $' }, { value: 'EUR', label: 'EUR €' }]} />
            </View>
          </View>

          <View style={s.postedAs}>
            <Icon name="building" size={15} color={C.teal500} />
            <Text style={s.postedAsText}>Posting as <Text style={s.company}>{recruiterCompany}</Text> · {recruiterCompanyTag}</Text>
          </View>
        </View>
      )}

      {tab === 'form' && (
        <View style={s.fields}>
          <TextField
            label="Application link (Google Form / external URL)"
            placeholder="https://forms.gle/your-form"
            value={d.applicationLink}
            onChangeText={v => upd('applicationLink', v)}
            keyboardType="url"
          />
          <Text style={s.fieldLabel}>Required from applicants</Text>
          <TouchableOpacity style={s.checkRow} onPress={() => upd('requireCoverLetter', !d.requireCoverLetter)}>
            <View style={[s.checkbox, d.requireCoverLetter && s.checkboxActive]}>
              {d.requireCoverLetter && <Icon name="check" size={12} color={C.paper} />}
            </View>
            <View>
              <Text style={s.checkLabel}>Cover letter</Text>
              <Text style={s.checkHint}>Applicants will be reminded to include one.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={s.checkRow} onPress={() => upd('requirePortfolio', !d.requirePortfolio)}>
            <View style={[s.checkbox, d.requirePortfolio && s.checkboxActive]}>
              {d.requirePortfolio && <Icon name="check" size={12} color={C.paper} />}
            </View>
            <View>
              <Text style={s.checkLabel}>Portfolio / project link</Text>
              <Text style={s.checkHint}>Applicants will be asked to share a portfolio URL.</Text>
            </View>
          </TouchableOpacity>
          <View style={s.postedAs}>
            <Icon name="building" size={15} color={C.teal500} />
            <Text style={s.postedAsText}>Applications go to <Text style={s.company}>{recruiterCompany}</Text> · {recruiterCompanyTag}</Text>
          </View>
        </View>
      )}
    </Modal>
  );
}

const s = StyleSheet.create({
  tabRow: { flexDirection: 'row', gap: 8, marginBottom: 16, borderBottomWidth: 1, borderBottomColor: C.line, paddingBottom: 12 },
  tabBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 8, borderWidth: 1, borderColor: C.line },
  tabBtnActive: { backgroundColor: C.ink, borderColor: C.ink },
  tabText: { fontSize: 13, color: C.ink2 },
  tabTextActive: { color: C.paper },
  fields: { gap: 14 },
  fieldLabel: { fontSize: 12, fontWeight: '500', color: C.ink2, marginBottom: 8 },
  locationRow: { flexDirection: 'row', gap: 8, alignItems: 'flex-start' },
  locationSelect: { width: 110 },
  compBox: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 14, backgroundColor: C.paper2, gap: 10 },
  textarea: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: C.ink, minHeight: 110 },
  textareaError: { borderColor: C.ember },
  errorText: { fontSize: 11, color: C.ember, marginTop: 4 },
  postedAs: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 12 },
  postedAsText: { fontSize: 12, color: C.muted, flex: 1 },
  company: { color: C.ink },
  checkRow: { flexDirection: 'row', gap: 12, alignItems: 'flex-start', paddingVertical: 4 },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, marginTop: 2, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  checkboxActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  checkLabel: { fontSize: 14, color: C.ink },
  checkHint: { fontSize: 12, color: C.muted, marginTop: 2 },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  ghost: { borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
