import { Icon } from '@/components/icon';
import { Modal } from '@/components/ui/modal';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { C } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ResourceDraft {
  title: string;
  kind: string;
  customKind: string;
  description: string;
  url: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: ResourceDraft) => void;
}

const KIND_OPTIONS = [
  { value: 'Article', label: 'Article' },
  { value: 'Video', label: 'Video' },
  { value: 'Guide', label: 'Guide' },
  { value: 'other', label: 'Other…' },
];

const BLANK: ResourceDraft = { title: '', kind: 'Article', customKind: '', description: '', url: '' };

export function WriteResourceModal({ open, onClose, onSubmit }: Props) {
  const [d, setD] = useState<ResourceDraft>(BLANK);
  const upd = <K extends keyof ResourceDraft>(k: K, v: ResourceDraft[K]) =>
    setD(x => ({ ...x, [k]: v }));

  function handleClose() {
    setD(BLANK);
    onClose();
  }

  function handleSubmit() {
    onSubmit(d);
    setD(BLANK);
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Share a resource"
      footer={
        <>
          <TouchableOpacity style={[btn.base, btn.ghost]} onPress={handleClose}>
            <Text style={btn.ghostText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[btn.base, btn.primary]} onPress={handleSubmit}>
            <Text style={btn.primaryText}>Post resource</Text>
            <Icon name="send" size={15} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      <View style={s.stack}>
        <TextField
          label="Topic"
          placeholder="e.g. Building a portfolio with no shipped work"
          value={d.title}
          onChangeText={v => upd('title', v)}
        />

        <SelectField
          label="Type"
          value={d.kind}
          onChange={v => upd('kind', v)}
          options={KIND_OPTIONS}
        />

        {d.kind === 'other' && (
          <TextField
            label="Specify type"
            placeholder="e.g. Podcast, Template, Cheatsheet…"
            value={d.customKind}
            onChangeText={v => upd('customKind', v)}
          />
        )}

        <View>
          <Text style={s.fieldLabel}>Short description</Text>
          <TextInput
            style={s.textarea}
            multiline
            numberOfLines={3}
            placeholder="What will readers take away from this resource?"
            placeholderTextColor={C.muted}
            value={d.description}
            onChangeText={v => upd('description', v)}
            textAlignVertical="top"
          />
        </View>

        <TextField
          label="External link"
          placeholder="https://..."
          value={d.url}
          onChangeText={v => upd('url', v)}
          keyboardType="url"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  stack: { gap: 12, paddingBottom: 4 },
  fieldLabel: { fontSize: 12, fontWeight: '500', color: C.ink2, marginBottom: 6 },
  textarea: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: C.ink, minHeight: 80 },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  ghost: { borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
