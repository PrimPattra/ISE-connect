import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import type { MediaItem } from '@/types';

const ICONS: Record<string, string> = { image: 'image', video: 'play', pdf: 'doc', link: 'link' };

interface Props { m: MediaItem }

export function MediaThumb({ m }: Props) {
  return (
    <View style={s.box}>
      <Icon name={ICONS[m.kind] ?? 'image'} size={18} color={C.muted} />
      <Text style={s.label} numberOfLines={2}>{m.label}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  box: { aspectRatio: 4 / 3, flex: 1, backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 8, alignItems: 'center', justifyContent: 'center', gap: 6, padding: 8 },
  label: { fontSize: 10, fontFamily: F.mono, color: C.muted, textAlign: 'center', backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 },
});
