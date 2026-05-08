import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { C } from '@/constants/theme';

interface Props {
  msg: string;
}

export function Toast({ msg }: Props) {
  if (!msg) return null;
  return (
    <View style={s.wrap} pointerEvents="none">
      <View style={s.pill}>
        <Icon name="check" size={15} color={C.paper} />
        <Text style={s.text}>{msg}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'absolute', bottom: 32, left: 0, right: 0, alignItems: 'center', zIndex: 99 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: C.ink, paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10 },
  text: { color: C.paper, fontSize: 13 },
});
