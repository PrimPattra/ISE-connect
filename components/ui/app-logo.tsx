import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';
import { StyleSheet, Text, View } from 'react-native';

export function AppLogo() {
  return (
    <View style={s.row}>
      <View style={s.icon}><Icon name="logo" size={18} color={C.paper} /></View>
      <Text style={s.text}><Text style={s.ise}>ISE</Text> Connect</Text>
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  icon: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.teal600, alignItems: 'center', justifyContent: 'center' },
  text: { fontSize: 18, fontWeight: '500', color: C.ink },
  ise: { color: C.red },
});
