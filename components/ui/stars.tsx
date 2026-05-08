import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';

interface Props {
  value: number;
  size?: number;
}

export function Stars({ value, size = 14 }: Props) {
  const full = Math.floor(value);
  const half = value - full >= 0.5;
  return (
    <View style={s.row}>
      {[0, 1, 2, 3, 4].map(i => {
        const filled = i < full || (i === full && half);
        return (
          <Ionicons
            key={i}
            name={filled ? 'star' : 'star-outline'}
            size={size}
            color={C.ember}
          />
        );
      })}
      <Text style={s.label}>{value.toFixed(1)}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  label: { fontSize: 12, fontFamily: F.mono, color: C.ink2, marginLeft: 4 },
});
