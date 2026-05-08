import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';

interface PostDraft {
  title: string; type: string; location: string;
  comp: string; cycle: string; skills: string; blurb: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onPost: (d: PostDraft) => void;
  recruiterCompany: string;
  recruiterCompanyTag: string;
}

export function PostRoleModal({ open, onClose, onPost, recruiterCompany, recruiterCompanyTag }: Props) {
  const [d, setD] = useState<PostDraft>({
    title: '', type: 'Internship', location: 'On-site · Bangkok',
    comp: '', cycle: 'Off-cycle · Jun–Aug', skills: 'Python, React', blurb: '',
  });
  const upd = (k: keyof PostDraft, v: string) => setD(x => ({ ...x, [k]: v }));

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
          <TouchableOpacity style={[btn.base, btn.primary]} onPress={() => onPost(d)}>
            <Text style={btn.primaryText}>Publish to ISE</Text>
            <Icon name="send" size={15} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      <View style={s.fields}>
        <TextField label="Role title" placeholder="e.g. Software Engineering Intern" value={d.title} onChangeText={v => upd('title', v)} />
        <SelectField label="Type" value={d.type} onChange={v => upd('type', v)} options={['Internship', 'Full-time', 'Freelance', 'Research'].map(v => ({ value: v, label: v }))} />
        <SelectField label="Location" value={d.location} onChange={v => upd('location', v)} options={['On-site · Bangkok', 'Hybrid · Bangkok', 'Remote'].map(v => ({ value: v, label: v }))} />
        <TextField label="Compensation" placeholder="e.g. ฿28,000/mo" value={d.comp} onChangeText={v => upd('comp', v)} />
        <TextField label="Cycle" placeholder="e.g. Off-cycle · Jun–Aug" value={d.cycle} onChangeText={v => upd('cycle', v)} />
        <TextField label="Skills (comma separated)" placeholder="Python, ROS, C++" value={d.skills} onChangeText={v => upd('skills', v)} />
        <TextField label="Description" placeholder="What will the hire actually do?" value={d.blurb} onChangeText={v => upd('blurb', v)} multiline numberOfLines={4} style={{ minHeight: 80, textAlignVertical: 'top' }} />
        <View style={s.postedAs}>
          <Icon name="building" size={15} color={C.teal500} />
          <Text style={s.postedAsText}>Posting as <Text style={s.company}>{recruiterCompany}</Text> · {recruiterCompanyTag}</Text>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  fields: { gap: 12 },
  postedAs: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 12 },
  postedAsText: { fontSize: 12, color: C.muted, flex: 1 },
  company: { color: C.ink },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  ghost: { borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
