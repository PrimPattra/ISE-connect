import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { C } from '@/constants/theme';

export const PREDEFINED_SKILLS = [
  'Python', 'JavaScript', 'TypeScript', 'React', 'React Native', 'Next.js',
  'Node.js', 'C++', 'Java', 'SQL', 'PyTorch', 'TensorFlow', 'OpenCV',
  'ROS', 'Linux', 'Figma', 'AWS', 'Docker', 'Go', 'Rust',
];

interface Props {
  value: string[];
  onChange: (skills: string[]) => void;
}

export function SkillPicker({ value, onChange }: Props) {
  const [customSkill, setCustomSkill] = useState('');
  const [showCustom, setShowCustom] = useState(false);

  const toggle = (skill: string) =>
    onChange(value.includes(skill) ? value.filter(s => s !== skill) : [...value, skill]);

  const addCustom = () => {
    const s = customSkill.trim();
    if (s && !value.includes(s)) onChange([...value, s]);
    setCustomSkill('');
  };

  const customAdded = value.filter(sk => !PREDEFINED_SKILLS.includes(sk));

  return (
    <View>
      <View style={s.chips}>
        {PREDEFINED_SKILLS.map(sk => (
          <TouchableOpacity key={sk} style={[s.chip, value.includes(sk) && s.chipActive]} onPress={() => toggle(sk)}>
            <Text style={[s.chipText, value.includes(sk) && s.chipTextActive]}>{sk}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={[s.chip, showCustom && s.chipActive]} onPress={() => setShowCustom(v => !v)}>
          <Text style={[s.chipText, showCustom && s.chipTextActive]}>+ Others</Text>
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
            onSubmitEditing={addCustom}
            returnKeyType="done"
          />
          <TouchableOpacity style={s.addBtn} onPress={addCustom}>
            <Text style={s.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>
      )}

      {customAdded.length > 0 && (
        <View style={s.customAdded}>
          {customAdded.map(sk => (
            <TouchableOpacity key={sk} style={s.chipActive} onPress={() => toggle(sk)}>
              <Text style={s.chipTextActive}>{sk} ×</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 99, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper },
  chipActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  chipText: { fontSize: 12, color: C.ink2 },
  chipTextActive: { fontSize: 12, color: C.paper },
  customRow: { flexDirection: 'row', gap: 8, marginTop: 8 },
  customInput: { flex: 1, borderWidth: 1, borderColor: C.line, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 8, fontSize: 13, color: C.ink, backgroundColor: C.paper },
  addBtn: { backgroundColor: C.teal600, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  addBtnText: { fontSize: 13, color: C.paper, fontWeight: '500' },
  customAdded: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
});
