import { StyleSheet, Text, View } from 'react-native';
import { Icon } from '@/components/icon';
import { C, F } from '@/constants/theme';

interface Props {
  steps: string[];
  current: number;
}

export function Stepper({ steps, current }: Props) {
  return (
    <View style={s.row}>
      {steps.map((step, i) => (
        <View key={step} style={s.item}>
          <View style={[s.circle, i < current ? s.done : i === current ? s.active : s.idle]}>
            {i < current
              ? <Icon name="check" size={11} color={C.paper} />
              : <Text style={[s.num, i === current ? s.numActive : s.numIdle]}>{i + 1}</Text>
            }
          </View>
          <Text style={[s.label, i === current ? s.labelActive : i < current ? s.labelDone : s.labelIdle]}>
            {step}
          </Text>
          {i < steps.length - 1 && <View style={s.line} />}
        </View>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 4 },
  item: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  circle: { width: 20, height: 20, borderRadius: 10, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  done: { backgroundColor: C.teal600, borderColor: C.teal600 },
  active: { backgroundColor: C.ink, borderColor: C.ink },
  idle: { backgroundColor: 'transparent', borderColor: C.line },
  num: { fontSize: 11, fontFamily: F.mono },
  numActive: { color: C.paper },
  numIdle: { color: C.muted },
  label: { fontSize: 11, fontFamily: F.mono, textTransform: 'uppercase', letterSpacing: 1 },
  labelActive: { color: C.ink },
  labelDone: { color: C.teal600 },
  labelIdle: { color: C.muted },
  line: { width: 20, height: 1, backgroundColor: C.line },
});
