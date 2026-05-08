import { StyleSheet, View, type ViewProps } from 'react-native';
import { C, Shadow } from '@/constants/theme';

interface Props extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, style, ...rest }: Props) {
  return (
    <View style={[s.card, Shadow.card, style]} {...rest}>
      {children}
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: C.paper,
    borderWidth: 1,
    borderColor: C.line,
    borderRadius: 12,
  },
});
