import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';

const PREDEFINED_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Next.js',
  'Node.js', 'C++', 'Java', 'SQL', 'PyTorch', 'TensorFlow', 'OpenCV',
  'ROS', 'Linux', 'Figma', 'AWS', 'Docker', 'Go', 'Rust',
];

interface PostDraft {
  title: string; type: string; location: string;
  comp: string; period: string; skills: string[]; blurb: string;
  applicationLink: string; requireCoverLetter: boolean; requirePortfolio: boolean;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onPost: (d: PostDraft) => void;
  recruiterCompany: string;
  recruiterCompanyTag: string;
}

export function PostRoleModal({ open, onClose, onPost, recruiterCompany, recruiterCompanyTag }: Props) {
  const [tab, setTab] = useState<'details' | 'form'>('details');
  const [d, setD] = useState<PostDraft>({
    title: '', type: 'Internship', location: 'On-site · Bangkok',
    comp: '', period: 'Off-cycle · Jun–Aug', skills: [], blurb: '',
    applicationLink: '', requireCoverLetter: false, requirePortfolio: false,
  });
  const [customSkill, setCustomSkill] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const upd = <K extends keyof PostDraft>(k: K, v: PostDraft[K]) => setD(x => ({ ...x, [k]: v }));

  const toggleSkill = (skill: string) => {
    setD(x => ({
      ...x,
      skills: x.skills.includes(skill)
        ? x.skills.filter(s => s !== skill)
        : [...x.skills, skill],
    }));
  };

  const addCustomSkill = () => {
    const s = customSkill.trim();
    if (s && !d.skills.includes(s)) {
      setD(x => ({ ...x, skills: [...x.skills, s] }));
    }
    setCustomSkill('');
  };

  const buildFinalDraft = (): PostDraft => {
    const extras = customSkill.trim() && !d.skills.includes(customSkill.trim())
      ? [...d.skills, customSkill.trim()]
      : d.skills;
    return { ...d, skills: extras };
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Post a new role"
      footer={
        <>
          <TouchableOpacity style={[btn.base, btn.ghost]} onPress={onClose}>
            <Text style={btn.ghostText}>Save draft</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[btn.base, btn.primary]} onPress={() => onPost(buildFinalDraft())}>
            <Text style={btn.primaryText}>Publish to ISE</Text>
            <Icon name="send" size={15} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      {/* Tab switcher */}
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
          <TextField label="Role title" placeholder="e.g. Software Engineering Intern" value={d.title} onChangeText={v => upd('title', v)} />
          <SelectField label="Type" value={d.type} onChange={v => upd('type', v)} options={['Internship', 'Full-time', 'Freelance', 'Research'].map(v => ({ value: v, label: v }))} />
          <SelectField label="Location" value={d.location} onChange={v => upd('location', v)} options={['On-site · Bangkok', 'Hybrid · Bangkok', 'Remote'].map(v => ({ value: v, label: v }))} />
          <TextField label="Compensation" placeholder="e.g. ฿28,000/mo" value={d.comp} onChangeText={v => upd('comp', v)} />
          <TextField label="Period" placeholder="e.g. Off-cycle · Jun–Aug" value={d.period} onChangeText={v => upd('period', v)} />

          {/* Skills multi-select */}
          <View>
            <Text style={s.fieldLabel}>Skills required</Text>
            <View style={s.skillChips}>
              {PREDEFINED_SKILLS.map(sk => (
                <TouchableOpacity
                  key={sk}
                  style={[s.skillChip, d.skills.includes(sk) && s.skillChipActive]}
                  onPress={() => toggleSkill(sk)}
                >
                  <Text style={[s.skillChipText, d.skills.includes(sk) && s.skillChipTextActive]}>{sk}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                style={[s.skillChip, showCustom && s.skillChipActive]}
                onPress={() => setShowCustom(v => !v)}
              >
                <Text style={[s.skillChipText, showCustom && s.skillChipTextActive]}>+ Others</Text>
              </TouchableOpacity>
            </View>
            {showCustom && (
              <View style={s.customRow}>
                <TextInput
                  style={s.customInput}
                  placeholder="Type a skill and press Add"
                  placeholderTextColor={C.muted}
                  value={customSkill}
                  onChangeText={setCustomSkill}
                  onSubmitEditing={addCustomSkill}
                  returnKeyType="done"
                />
                <TouchableOpacity style={s.addBtn} onPress={addCustomSkill}>
                  <Text style={s.addBtnText}>Add</Text>
                </TouchableOpacity>
              </View>
            )}
            {/* Custom skills already added */}
            {d.skills.filter(sk => !PREDEFINED_SKILLS.includes(sk)).length > 0 && (
              <View style={s.addedCustom}>
                {d.skills.filter(sk => !PREDEFINED_SKILLS.includes(sk)).map(sk => (
                  <TouchableOpacity key={sk} style={s.skillChipActive} onPress={() => toggleSkill(sk)}>
                    <Text style={s.skillChipTextActive}>{sk} ×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          {/* Description textarea */}
          <View>
            <Text style={s.fieldLabel}>Job description</Text>
            <TextInput
              style={s.textarea}
              multiline
              numberOfLines={5}
              placeholder="Describe the role, responsibilities, and what makes your team unique…"
              placeholderTextColor={C.muted}
              value={d.blurb}
              onChangeText={v => upd('blurb', v)}
              textAlignVertical="top"
            />
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
  skillChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  skillChipActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  skillChipText: { fontSize: 12, color: C.ink2 },
  skillChipTextActive: { fontSize: 12, color: C.paper },
  customRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  customInput: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, color: C.ink, backgroundColor: C.paper },
  addBtn: { backgroundColor: C.teal600, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 13, color: C.paper, fontWeight: '500' },
  addedCustom: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  textarea: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: C.ink, minHeight: 110 },
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
