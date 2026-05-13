import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { C, F } from '@/constants/theme';

interface Props {
  label: string;
  children: React.ReactNode;
}

export function Tooltip({ label, children }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <View
      style={s.wrap}
      {...{
        onMouseEnter: () => setVisible(true),
        onMouseLeave: () => setVisible(false),
      } as any}
    >
      {children}
      {visible && (
        <View style={s.tip} pointerEvents="none">
          <Text style={s.text}>{label}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { position: 'relative', alignItems: 'center' },
  tip: {
    position: 'absolute',
    bottom: 34,
    backgroundColor: C.ink,
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    zIndex: 999,
  },
  text: { fontSize: 11, color: C.paper, fontFamily: F.mono } as any,
});
