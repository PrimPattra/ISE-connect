import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import { Icon } from '@/components/icon';
import { C } from '@/constants/theme';

interface ReviewDraft {
  company: string; role: string; reviewText: string;
  includeSalary: boolean; amount: string; period: string; currency: string; salaryRole: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: ReviewDraft) => void;
}

export function WriteReviewModal({ open, onClose, onSubmit }: Props) {
  const [d, setD] = useState<ReviewDraft>({
    company: '', role: '', reviewText: '',
    includeSalary: false, amount: '', period: 'month', currency: 'THB', salaryRole: '',
  });
  const upd = <K extends keyof ReviewDraft>(k: K, v: ReviewDraft[K]) => setD(x => ({ ...x, [k]: v }));

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Write a review"
      footer={
        <>
          <TouchableOpacity style={[btn.base, btn.ghost]} onPress={onClose}>
            <Text style={btn.ghostText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[btn.base, btn.primary]} onPress={() => onSubmit(d)}>
            <Text style={btn.primaryText}>Post anonymously</Text>
            <Icon name="send" size={15} color={C.paper} />
          </TouchableOpacity>
        </>
      }
    >
      <View style={s.grid}>
        <TextField label="Company / lab" placeholder="e.g. Linewell Robotics" value={d.company} onChangeText={v => upd('company', v)} />
        <TextField label="Your role there" placeholder="e.g. SWE Intern" value={d.role} onChangeText={v => upd('role', v)} />
      </View>

      <View style={s.field}>
        <Text style={s.fieldLabel}>Your review</Text>
        <TextInput
          style={s.textarea}
          multiline
          numberOfLines={5}
          placeholder="Share your honest experience — what was the culture like? Would you recommend it to a fellow ISE student?"
          placeholderTextColor={C.muted}
          value={d.reviewText}
          onChangeText={v => upd('reviewText', v)}
          textAlignVertical="top"
        />
      </View>

      <View style={s.salaryBox}>
        <TouchableOpacity style={s.salaryToggle} onPress={() => upd('includeSalary', !d.includeSalary)}>
          <View style={[s.checkbox, d.includeSalary && s.checkboxActive]}>
            {d.includeSalary && <Icon name="check" size={12} color={C.paper} />}
          </View>
          <View style={s.salaryMeta}>
            <Text style={s.salaryTitle}>Include my salary (optional)</Text>
            <Text style={s.salaryHint}>Appears only in aggregated view, never beside your name.</Text>
          </View>
        </TouchableOpacity>
        {d.includeSalary && (
          <View style={s.salaryFields}>
            <TextField label="Amount" placeholder="28000" value={d.amount} onChangeText={v => upd('amount', v)} keyboardType="numeric" />
            <SelectField label="Period" value={d.period} onChange={v => upd('period', v)} options={[{ value: 'month', label: 'per month' }, { value: 'hour', label: 'per hour' }, { value: 'year', label: 'per year' }]} />
            <SelectField label="Currency" value={d.currency} onChange={v => upd('currency', v)} options={[{ value: 'THB', label: 'THB ฿' }, { value: 'USD', label: 'USD $' }, { value: 'EUR', label: 'EUR €' }]} />
            <TextField label="Role label" placeholder="e.g. SWE Intern" value={d.salaryRole} onChangeText={v => upd('salaryRole', v)} />
          </View>
        )}
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  grid: { gap: 10, marginBottom: 14 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '500', color: C.ink2, marginBottom: 6 },
  textarea: { backgroundColor: C.paper2, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: C.ink, minHeight: 120 },
  salaryBox: { borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 14, backgroundColor: C.paper2, marginTop: 4 },
  salaryToggle: { flexDirection: 'row', gap: 12, alignItems: 'flex-start' },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 1, borderColor: C.line, backgroundColor: C.paper, marginTop: 2, alignItems: 'center', justifyContent: 'center' },
  checkboxActive: { backgroundColor: C.teal600, borderColor: C.teal600 },
  salaryMeta: { flex: 1 },
  salaryTitle: { fontSize: 14, color: C.ink },
  salaryHint: { fontSize: 12, color: C.muted, marginTop: 2 },
  salaryFields: { gap: 10, marginTop: 12 },
});

const btn = StyleSheet.create({
  base: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 10 },
  ghost: { borderWidth: 1, borderColor: C.line },
  ghostText: { fontSize: 14, color: C.ink },
  primary: { backgroundColor: C.teal600 },
  primaryText: { fontSize: 14, color: C.paper, fontWeight: '500' },
});
