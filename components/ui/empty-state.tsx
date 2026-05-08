import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';

interface Props {
  icon?: string;
  title: string;
  body?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = 'compass', title, body, action }: Props) {
  return (
    <View style={s.wrap}>
      <View style={s.iconWrap}>
        <Icon name={icon} size={22} color={C.teal500} />
      </View>
      <Text style={s.title}>{title}</Text>
      {body && <Text style={s.body}>{body}</Text>}
      {action && <View style={s.action}>{action}</View>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: 48, paddingHorizontal: 24 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, backgroundColor: C.paper2, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  title: { fontSize: 24, fontFamily: F.serif, fontStyle: 'italic', color: C.ink },
  body: { fontSize: 14, color: C.muted, marginTop: 6, textAlign: 'center', maxWidth: 280 },
  action: { marginTop: 16 },
});
