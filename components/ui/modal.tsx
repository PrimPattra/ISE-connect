import { Modal as RNModal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from '@/components/icon';
import { C, F, Shadow } from '@/constants/theme';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: Props) {
  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity style={s.overlay} activeOpacity={1} onPress={onClose}>
        <TouchableOpacity style={[s.sheet, Shadow.pop]} activeOpacity={1} onPress={() => {}}>
          <View style={s.header}>
            <Text style={s.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Icon name="x" size={18} color={C.ink2} />
            </TouchableOpacity>
          </View>
          <ScrollView style={s.body} contentContainerStyle={{ paddingBottom: 8 }}>
            {children}
          </ScrollView>
          {footer && <View style={s.footer}>{footer}</View>}
        </TouchableOpacity>
      </TouchableOpacity>
    </RNModal>
  );
}

const s = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(27,26,23,0.45)', justifyContent: 'center', padding: 16 },
  sheet: { backgroundColor: C.paper, borderRadius: 16, borderWidth: 1, borderColor: C.line, maxHeight: '88%' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line },
  title: { fontSize: 22, fontFamily: F.interSemiBold, color: C.ink, flex: 1 },
  closeBtn: { padding: 6, borderRadius: 6 },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.paper2 },
});
