import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Modal } from '@/components/ui/modal';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import { Icon } from '@/components/icon';
import { Ionicons } from '@expo/vector-icons';
import { C, F } from '@/constants/theme';

interface ReviewDraft {
  company: string; role: string;
  overall: number; culture: number; wlb: number; mentorship: number;
  pros: string; cons: string;
  includeSalary: boolean; amount: string; period: string; currency: string; salaryRole: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (d: ReviewDraft) => void;
}

function RatingRow({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <View style={r.wrap}>
      <Text style={r.label}>{label}</Text>
      <View style={r.stars}>
        {[1, 2, 3, 4, 5].map(n => (
          <TouchableOpacity key={n} onPress={() => onChange(n)}>
            <Ionicons name={n <= value ? 'star' : 'star-outline'} size={24} color={C.ember} />
          </TouchableOpacity>
        ))}
        <Text style={r.val}>{value}</Text>
      </View>
    </View>
  );
}

const r = StyleSheet.create({
  wrap: { marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '500', color: C.ink2, marginBottom: 6 },
  stars: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  val: { fontSize: 13, fontFamily: F.mono, color: C.muted, marginLeft: 4 },
});

export function WriteReviewModal({ open, onClose, onSubmit }: Props) {
  const [d, setD] = useState<ReviewDraft>({
    company: '', role: '', overall: 4, culture: 4, wlb: 4, mentorship: 4,
    pros: '', cons: '', includeSalary: false, amount: '', period: 'month', currency: 'THB', salaryRole: '',
  });
  const upd = (k: keyof ReviewDraft, v: ReviewDraft[typeof k]) => setD(x => ({ ...x, [k]: v }));

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

      <View style={s.ratings}>
        <RatingRow label="Culture" value={d.culture} onChange={v => upd('culture', v)} />
        <RatingRow label="Work-life balance" value={d.wlb} onChange={v => upd('wlb', v)} />
        <RatingRow label="Mentorship" value={d.mentorship} onChange={v => upd('mentorship', v)} />
      </View>

      <View style={s.field}>
        <Text style={s.fieldLabel}>Pros</Text>
        <TextInput
          style={s.textarea}
          multiline numberOfLines={3}
          placeholder="What worked? Be specific."
          placeholderTextColor={C.muted}
          value={d.pros}
          onChangeText={v => upd('pros', v)}
        />
      </View>
      <View style={s.field}>
        <Text style={s.fieldLabel}>Cons</Text>
        <TextInput
          style={s.textarea}
          multiline numberOfLines={3}
          placeholder="What would you change?"
          placeholderTextColor={C.muted}
          value={d.cons}
          onChangeText={v => upd('cons', v)}
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
  grid: { gap: 10, marginBottom: 16 },
  ratings: { marginBottom: 16 },
  field: { marginBottom: 12 },
  fieldLabel: { fontSize: 12, fontWeight: '500', color: C.ink2, marginBottom: 6 },
  textarea: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: C.ink, minHeight: 80, textAlignVertical: 'top' },
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
