import { Icon } from '@/components/icon';
import { Modal } from '@/components/ui/modal';
import { SelectField } from '@/components/ui/select-field';
import { TextField } from '@/components/ui/text-field';
import { C } from '@/constants/theme';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface ResourceDraft {
  title: string;
  kind: string;
  customKind: string;
  description: string;
  url: string;
  image: string;
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

const BLANK: ResourceDraft = { title: '', kind: 'Article', customKind: '', description: '', url: '', image: '' };

export function WriteResourceModal({ open, onClose, onSubmit }: Props) {
  const [d, setD] = useState<ResourceDraft>(BLANK);
  const upd = <K extends keyof ResourceDraft>(k: K, v: ResourceDraft[K]) =>
    setD(x => ({ ...x, [k]: v }));

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) upd('image', result.assets[0].uri);
  }

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

        <View>
          <Text style={s.fieldLabel}>Cover image (optional)</Text>
          {d.image ? (
            <View style={s.previewWrap}>
              <Image source={{ uri: d.image }} style={s.preview} contentFit="cover" />
              <TouchableOpacity style={s.clearBtn} onPress={() => upd('image', '')}>
                <Icon name="close" size={12} color={C.paper} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={s.imagePicker} onPress={pickImage}>
              <Icon name="plus" size={16} color={C.muted} />
              <Text style={s.imagePickerText}>Add cover image</Text>
            </TouchableOpacity>
          )}
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
  imagePicker: { borderWidth: 1, borderColor: C.line, borderStyle: 'dashed', borderRadius: 10, height: 80, alignItems: 'center', justifyContent: 'center', gap: 6, flexDirection: 'row', backgroundColor: C.paper2 },
  imagePickerText: { fontSize: 13, color: C.muted },
  previewWrap: { position: 'relative' },
  preview: { width: '100%', height: 120, borderRadius: 10 },
  clearBtn: { position: 'absolute', top: 6, right: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(0,0,0,0.5)', alignItems: 'center', justifyContent: 'center' },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  ghost: { borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
