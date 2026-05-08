import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { C } from '@/constants/theme';

interface Option {
  value: string;
  label: string;
}

interface Props {
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}

export function Segmented({ value, onChange, options }: Props) {
  return (
    <View style={s.wrap}>
      {options.map(o => (
        <TouchableOpacity
          key={o.value}
          onPress={() => onChange(o.value)}
          style={[s.item, value === o.value && s.active]}
        >
          <Text style={[s.label, value === o.value && s.labelActive]}>{o.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flexDirection: 'row', backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 3 },
  item: { flex: 1, paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, alignItems: 'center' },
  active: { backgroundColor: C.paper },
  label: { fontSize: 13, color: C.muted, textAlign: 'center' },
  labelActive: { color: C.ink },
});
