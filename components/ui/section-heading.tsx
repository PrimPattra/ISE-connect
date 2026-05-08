import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

interface Props {
  kicker?: string;
  title: string;
  children?: React.ReactNode;
}

export function SectionHeading({ kicker, title, children }: Props) {
  return (
    <View style={s.row}>
      <View>
        {kicker && <Text style={s.kicker}>{kicker}</Text>}
        <Text style={s.title}>{title}</Text>
      </View>
      {children && <View style={s.actions}>{children}</View>}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 16 },
  kicker: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1.4, marginBottom: 4 },
  title: { fontSize: 30, fontFamily: F.serif, fontStyle: 'italic', color: C.ink, lineHeight: 32 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
});
