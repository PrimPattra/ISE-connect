import { Icon } from '@/components/icon';
import { Modal } from '@/components/ui/modal';
import { TagPill } from '@/components/ui/tag-pill';
import { C, F } from '@/constants/theme';
import type { Resource } from '@/types';
import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  res: Resource;
  open: boolean;
  onClose: () => void;
}

export function ResourceDetailModal({ res, open, onClose }: Props) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={res.title}
      footer={
        res.url ? (
          <TouchableOpacity style={[btn.base, btn.primary]} onPress={() => Linking.openURL(res.url!)}>
            <Text style={btn.primaryText}>Open link</Text>
            <Icon name="arrow-right" size={15} color={C.paper} />
          </TouchableOpacity>
        ) : undefined
      }
    >
      <View style={s.stack}>
        <View style={s.tagRow}>
          <TagPill>{res.kind}</TagPill>
          {res.mins > 0 && <Text style={s.mins}>{res.mins} min read</Text>}
        </View>

        {res.description ? (
          <View style={s.section}>
            <Text style={s.sectionLabel}>Description</Text>
            <Text style={s.body}>{res.description}</Text>
          </View>
        ) : (
          <Text style={s.empty}>No description provided.</Text>
        )}

        <View style={s.divider} />

        <View style={s.metaRow}>
          <Text style={s.metaKey}>Shared by</Text>
          <Text style={s.metaVal}>{res.author}</Text>
        </View>

        {res.url && (
          <>
            <View style={s.divider} />
            <View style={s.metaRow}>
              <Text style={s.metaKey}>External link</Text>
              <Text style={s.metaLink} numberOfLines={1}>{res.url}</Text>
            </View>
          </>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  stack: { gap: 14 },
  tagRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  mins: { fontSize: 12, fontFamily: F.mono, color: C.muted },
  section: { gap: 6 },
  sectionLabel: { fontSize: 11, fontFamily: F.mono, color: C.muted, textTransform: 'uppercase', letterSpacing: 1 },
  body: { fontSize: 14, color: C.ink2, lineHeight: 21 },
  empty: { fontSize: 14, color: C.muted, fontStyle: 'italic' },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  metaKey: { fontSize: 13, color: C.muted, flexShrink: 0 },
  metaVal: { fontSize: 13, color: C.ink2, textAlign: 'right', flex: 1 },
  metaLink: { fontSize: 12, fontFamily: F.mono, color: C.teal600, textAlign: 'right', flex: 1 },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 10 },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  primary: { backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
