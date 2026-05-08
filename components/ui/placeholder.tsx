import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

interface Props {
  label: string;
  aspectRatio?: number;
}

export function Placeholder({ label, aspectRatio = 4 / 3 }: Props) {
  return (
    <View style={[s.box, { aspectRatio }]}>
      <Text style={s.label}>{label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 8, alignItems: 'center', justifyContent: 'center', width: '100%' },
  label: { fontSize: 11, fontFamily: F.mono, color: C.muted, paddingHorizontal: 8, paddingVertical: 2, backgroundColor: C.paper, borderRadius: 4, borderWidth: 1, borderColor: C.line, textAlign: 'center' },
});
