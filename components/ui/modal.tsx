import { Icon } from '@/components/icon';
import { C, F, Shadow } from '@/constants/theme';
import { Pressable, Modal as RNModal, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ open, onClose, title, children, footer }: Props) {
  const { height } = useWindowDimensions();
  
  return (
    <RNModal visible={open} transparent animationType="fade" onRequestClose={onClose}>
      <View style={s.overlay}>
        {/* 1. Backdrop positioned absolutely behind the modal content */}
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />

        {/* 2. Modal Sheet changed to a standard View */}
        <View style={[s.sheet, Shadow.pop]}>
          <View style={s.header}>
            <Text style={s.title}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s.closeBtn}>
              <Icon name="x" size={18} color={C.ink2} />
            </TouchableOpacity>
          </View>
          
          <ScrollView
            style={[s.body, { maxHeight: height * 0.6 }]}
            contentContainerStyle={{ paddingBottom: 24 }}
            nestedScrollEnabled
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
          
          {footer && <View style={s.footer}>{footer}</View>}
        </View>
      </View>
    </RNModal>
  );
}

const s = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: 'rgba(27,26,23,0.45)', 
    justifyContent: 'center', 
    paddingHorizontal: 32, 
    paddingVertical: 16 
  },
  sheet: { 
    backgroundColor: C.paper, 
    borderRadius: 16, 
    borderWidth: 1, 
    borderColor: C.line, 
    maxHeight: '88%',
    // Added zIndex to ensure it sits above the absolute backdrop
    zIndex: 1 
  },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line },
  title: { fontSize: 22, fontFamily: F.interSemiBold, color: C.ink, flex: 1 },
  closeBtn: { padding: 6, borderRadius: 6 },
  body: { paddingHorizontal: 20, paddingTop: 16 },
  footer: { flexDirection: 'row', justifyContent: 'center', gap: 8, paddingHorizontal: 20, paddingVertical: 12, borderTopWidth: 1, borderTopColor: C.line, backgroundColor: C.paper2, borderBottomLeftRadius: 16, borderBottomRightRadius: 16 },
});