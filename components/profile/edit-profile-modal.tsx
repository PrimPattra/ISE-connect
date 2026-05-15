import { Icon } from '@/components/icon';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { C, F } from '@/constants/theme';
import type { User } from '@/types';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export const AVATAR_COLORS = [
  'rgba(255,255,255,0.15)',
  '#0f766e',
  '#0369a1',
  '#4f46e5',
  '#7c3aed',
  '#be185d',
  '#b45309',
  '#15803d',
];

interface Props {
  open: boolean;
  onClose: () => void;
  user: User;
  onSave: (updates: { headline: string; avatarColor: string }) => void;
}

export function EditProfileModal({ open, onClose, user, onSave }: Props) {
  const [headline, setHeadline] = useState(user.profile.headline ?? '');
  const [avatarColor, setAvatarColor] = useState(user.profile.avatarColor ?? AVATAR_COLORS[0]);

  useEffect(() => {
    if (open) {
      setHeadline(user.profile.headline ?? '');
      setAvatarColor(user.profile.avatarColor ?? AVATAR_COLORS[0]);
    }
  }, [open]);

  const initials = user.profile.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('');

  const submit = () => {
    onSave({ headline: headline.trim(), avatarColor });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit profile"
      footer={
        <>
          <TouchableOpacity style={m.ghost} onPress={onClose}>
            <Text style={m.ghostText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={m.primary} onPress={submit}>
            <Text style={m.primaryText}>Save</Text>
            <Icon name="check" size={14} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      <View style={m.fields}>

        {/* Profile picture — avatar color picker */}
        <View>
          <Text style={m.label}>Profile picture</Text>
          <View style={m.avatarRow}>
            <View style={m.avatarPreviewBg}>
              <View style={[m.avatarPreview, { backgroundColor: avatarColor }]}>
                <Text style={m.avatarInitials}>{initials}</Text>
              </View>
            </View>
            <View style={m.colorGrid}>
              {AVATAR_COLORS.map(c => (
                <TouchableOpacity
                  key={c}
                  style={[m.colorDot, { backgroundColor: c }, avatarColor === c && m.colorDotSelected]}
                  onPress={() => setAvatarColor(c)}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Name — read-only */}
        <View>
          <Text style={m.label}>Name</Text>
          <View style={m.readOnly}>
            <Text style={m.readOnlyText}>{user.profile.name}</Text>
          </View>
          <Text style={m.hint}>Registered name cannot be changed.</Text>
        </View>

        {/* Headline */}
        <View>
          <Text style={m.label}>Headline</Text>
          <TextField
            placeholder='e.g. "Aspiring full-stack developer"'
            value={headline}
            onChangeText={setHeadline}
            multiline
            numberOfLines={2}
          />
        </View>

      </View>
    </Modal>
  );
}

const m = StyleSheet.create({
  fields: { gap: 16, paddingBottom: 8 },
  label: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  avatarPreviewBg: { width: 64, height: 64, borderRadius: 12, backgroundColor: C.teal600, alignItems: 'center', justifyContent: 'center' },
  avatarPreview: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  avatarInitials: { fontSize: 15, fontFamily: F.mono, color: C.paper },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, flex: 1 },
  colorDot: { width: 30, height: 30, borderRadius: 15, borderWidth: 1, borderColor: C.line },
  colorDotSelected: { borderWidth: 2.5, borderColor: C.teal600 },
  readOnly: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12 },
  readOnlyText: { fontSize: 14, color: C.muted },
  hint: { fontSize: 11, fontFamily: F.mono, color: C.muted, marginTop: 5 },
  ghost: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10, backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
