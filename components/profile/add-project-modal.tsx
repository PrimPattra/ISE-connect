import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { Icon } from '@/components/icon';
import { C } from '@/constants/theme';

interface FormState {
  title: string;
  skills: string;
  description: string;
  projectLink: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onAdd: (data: FormState) => void;
  initialData?: FormState;
  onEdit?: (data: FormState) => void;
}

const EMPTY: FormState = { title: '', skills: '', description: '', projectLink: '' };

export function AddProjectModal({ open, onClose, onAdd, initialData, onEdit }: Props) {
  const isEdit = !!initialData;
  const [form, setForm] = useState<FormState>(initialData ?? EMPTY);
  const [error, setError] = useState('');

  const upd = (k: keyof FormState, v: string) => {
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
        <TextField
          label="Title *"
          icon="edit"
          placeholder="e.g. ISE Connect App"
          value={form.title}
          onChangeText={v => upd('title', v)}
          error={error}
        />
        <TextField
          label="Skills"
          icon="users"
          placeholder="e.g. React Native, TypeScript"
          value={form.skills}
          onChangeText={v => upd('skills', v)}
          hint="Comma-separated"
        />
        <TextField
          label="Description"
          placeholder="What did you build and why?"
          value={form.description}
          onChangeText={v => upd('description', v)}
          multiline
          numberOfLines={3}
          style={m.multiline}
        />
        <TextField
          label="Project link"
          icon="doc"
          placeholder="https://github.com/..."
          value={form.projectLink}
          onChangeText={v => upd('projectLink', v)}
          keyboardType="url"
          autoCapitalize="none"
        />
      </View>
    </Modal>
  );
}

const m = StyleSheet.create({
  fields: { gap: 12, paddingBottom: 8 },
  multiline: { height: 80, textAlignVertical: 'top', paddingTop: 10 },
  ghost: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
