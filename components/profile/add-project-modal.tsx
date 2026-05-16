import { Icon } from '@/components/icon';
import { Modal } from '@/components/ui/modal';
import { SkillPicker } from '@/components/ui/skill-picker';
import { TextField } from '@/components/ui/text-field';
import { C, F } from '@/constants/theme';
import type { ProjectFormData } from '@/types';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: ProjectFormData) => void;
  initialData?: ProjectFormData;
  onEdit?: (data: ProjectFormData) => void;
}

const EMPTY: ProjectFormData = { title: '', description: '', skills: '', projectLink: '', contactInfo: '', collaborators: '' };

export function AddProjectModal({ open, onClose, onAdd, initialData, onEdit }: Props) {
  const isEdit = !!initialData;
  const [form, setForm] = useState<ProjectFormData>(initialData ?? EMPTY);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(initialData ?? EMPTY);
      setError('');
    }
  }, [open]);

  const upd = (k: keyof ProjectFormData, v: string) => {
    setForm(f => ({ ...f, [k]: v }));
    setError('');
  };

  const submit = () => {
    if (!form.title.trim()) { setError('Project title is required.'); return; }
    if (isEdit) onEdit?.(form);
    else onAdd(form);
    setForm(EMPTY);
    setError('');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit project' : 'Add project'}
      footer={
        <>
          <TouchableOpacity style={m.ghost} onPress={onClose}>
            <Text style={m.ghostText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={m.primary} onPress={submit}>
            <Text style={m.primaryText}>{isEdit ? 'Save' : 'Add'}</Text>
            <Icon name={isEdit ? 'check' : 'plus'} size={14} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      <View style={m.fields}>
        <View>
          <Text style={m.sectionLabel}>Title *</Text>
          <TextField
            placeholder="e.g. ISE Connect App"
            value={form.title}
            onChangeText={v => upd('title', v)}
            error={error}
          />
        </View>
        <View>
          <Text style={m.sectionLabel}>Collaborators</Text>
          <TextField
            placeholder="e.g. Alice, Bob"
            value={form.collaborators}
            onChangeText={v => upd('collaborators', v)}
            hint="Comma-separated names (optional)"
          />
        </View>
        <View>
          <Text style={m.sectionLabel}>Description</Text>
          <TextField
            placeholder="What did you build and why?"
            value={form.description}
            onChangeText={v => upd('description', v)}
            multiline
            numberOfLines={3}
            style={m.multiline}
          />
        </View>
        <View>
          <Text style={m.sectionLabel}>Skills & Tools</Text>
          <SkillPicker
            key={String(open)}
            value={form.skills ? form.skills.split(',').map(s => s.trim()).filter(Boolean) : []}
            onChange={skills => upd('skills', skills.join(', '))}
          />
        </View>
        <View>
          <Text style={m.sectionLabel}>Project Link</Text>
          <TextField
            placeholder="https://github.com/..."
            value={form.projectLink}
            onChangeText={v => upd('projectLink', v)}
            keyboardType="url"
            autoCapitalize="none"
          />
        </View>
        <View>
          <Text style={m.sectionLabel}>Contact</Text>
          <TextField
            placeholder="e.g. your@email.com"
            value={form.contactInfo}
            onChangeText={v => upd('contactInfo', v)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
      </View>
    </Modal>
  );
}

const m = StyleSheet.create({
  fields: { gap: 16, paddingBottom: 8 },
  sectionLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  multiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  ghost: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
