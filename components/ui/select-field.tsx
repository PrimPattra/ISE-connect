import { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/components/icon';
import { C, F, Shadow } from '@/constants/theme';

interface Option {
  value: string;
  label: string;
}

interface Props {
  label?: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
}

export function SelectField({ label, options, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View>
      {label && <Text style={s.label}>{label}</Text>}
      <TouchableOpacity style={s.trigger} onPress={() => setOpen(true)}>
        <Text style={s.value}>{selected?.label ?? value}</Text>
        <Icon name="down" size={16} color={C.muted} />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          <TouchableOpacity style={[s.sheet, Shadow.pop]} activeOpacity={1} onPress={() => {}}>
            <Text style={s.sheetTitle}>{label}</Text>
            <ScrollView>
              {options.map(o => (
                <TouchableOpacity
                  key={o.value}
                  style={[s.option, o.value === value && s.optionActive]}
                  onPress={() => { onChange(o.value); setOpen(false); }}
                >
                  <Text style={[s.optionText, o.value === value && s.optionTextActive]}>{o.label}</Text>
                  {o.value === value && <Icon name="check" size={16} color={C.teal500} />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '500', color: C.ink2, marginBottom: 6 },
  trigger: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10 },
  value: { fontSize: 14, color: C.ink },
  overlay: { flex: 1, backgroundColor: 'rgba(27,26,23,0.4)', justifyContent: 'center', padding: 24 },
  sheet: { backgroundColor: C.paper, borderRadius: 14, borderWidth: 1, borderColor: C.line, maxHeight: 360 },
  sheetTitle: { fontSize: 14, fontWeight: '500', color: C.ink2, padding: 16, borderBottomWidth: 1, borderBottomColor: C.line, fontFamily: F.mono },
  option: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12 },
  optionActive: { backgroundColor: C.teal50 },
  optionText: { fontSize: 14, color: C.ink2 },
  optionTextActive: { color: C.teal600, fontWeight: '500' },
});
