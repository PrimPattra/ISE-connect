import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '@/components/ui/card';
import { TagPill } from '@/components/ui/tag-pill';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { Resource } from '@/types';

interface Props { res: Resource }

export function ResourceCard({ res }: Props) {
  const iconName = res.kind === 'Video' ? 'play' : 'doc';
  return (
    <Card style={s.card}>
      <View style={s.thumb}>
        <Icon name={iconName} size={20} color={C.muted} />
      </View>
      <View style={s.info}>
        <View style={s.row}><TagPill>{res.kind}</TagPill><Text style={s.mins}>{res.mins} min</Text></View>
        <Text style={s.title} numberOfLines={2}>{res.title}</Text>
        <Text style={s.author}>{res.author}</Text>
      </View>
      <TouchableOpacity style={s.btn}>
        <Icon name="arrow-right" size={15} color={C.ink2} />
      </TouchableOpacity>
    </Card>
  );
}

const s = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12, marginBottom: 8 },
  thumb: { width: 52, height: 52, borderRadius: 8, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  mins: { fontSize: 11, fontFamily: F.mono, color: C.muted },
  title: { fontSize: 14, color: C.ink, lineHeight: 18 },
  author: { fontSize: 12, color: C.muted, marginTop: 2 },
  btn: { padding: 8 },
});
