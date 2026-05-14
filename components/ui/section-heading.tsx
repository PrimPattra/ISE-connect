import { C, F } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

interface Props {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
}

export function SectionHeading({ kicker, title, children }: Props) {
  return (
    <View style={s.row}>
      <View style={s.titleBlock}>
        {kicker && <Text style={s.kicker}>{kicker}</Text>}
        <Text style={s.title}>{title}</Text>
      </View>
      {children && <View style={s.actions}>{children}</View>}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
  titleBlock: { flex: 1, marginRight: 12 },
  kicker: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 4 },
  title: { fontSize: 30, fontFamily: F.interBold, color: C.ink, lineHeight: 36 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
