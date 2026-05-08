import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Stepper } from '@/components/auth/stepper';
import { RoleCard } from '@/components/auth/role-card';
import { TextField } from '@/components/ui/text-field';
import { SelectField } from '@/components/ui/select-field';
import { Icon } from '@/components/icon';
import { useAppContext } from '@/context/app-context';
import { C, F } from '@/constants/theme';

type Mode = 'signin' | 'signup';
type Role = 'hunter' | 'recruiter';

interface FormState {
  name: string; email: string; password: string;
  cohort: string; track: string; headline: string; skills: string;
  company: string; companyTag: string; isAlumni: boolean; alumniCohort: string; position: string;
}

const COHORT_OPTIONS = ['ICE#19', 'ICE#20', 'ICE#21', 'ICE#22', 'ICE#23', 'Alumni', 'Faculty'].map(v => ({ value: v, label: v }));
const TRACK_OPTIONS = ['Computer', 'Communication', 'Industrial', 'Other'].map(v => ({ value: v, label: v }));
const ALUMNI_OPTIONS = ['ICE#08', 'ICE#10', 'ICE#11', 'ICE#13', 'ICE#14', 'ICE#16', 'ICE#18', 'Faculty'].map(v => ({ value: v, label: v }));

export default function AuthScreen() {
  const { setUser, toast } = useAppContext();
  const [mode, setMode] = useState<Mode>('signup');
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>('hunter');
  const [form, setForm] = useState<FormState>({
    name: '', email: '', password: '',
    cohort: 'ICE#22', track: 'Computer', headline: '', skills: 'Python, React',
    company: '', companyTag: '', isAlumni: true, alumniCohort: 'ICE#16', position: '',
  });
  const upd = (k: keyof FormState, v: FormState[typeof k]) => setForm(f => ({ ...f, [k]: v }));

  const stepsByRole = {
    hunter: ['Account', 'Role', 'You', 'Profile'],
    recruiter: ['Account', 'Role', 'You', 'Company'],
  };

  const finish = () => {
    const profile = role === 'hunter'
      ? {
          name: form.name || 'Proudmorakod T.',
          email: form.email || 'me@ise.example',
          cohort: form.cohort,
          track: form.track,
          headline: form.headline || 'ICE student · open to off-cycle internships',
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        }
      : {
          name: form.name || 'Anong K.',
          email: form.email || 'me@ise.example',
          company: form.company || 'Linewell Robotics',
          companyTag: form.companyTag || 'Bangkok · Hardware/AI',
          isAlumni: form.isAlumni,
          alumniCohort: form.alumniCohort,
          position: form.position || 'Engineering Lead',
        };

    setUser({ role, profile });
    toast('Welcome to ISE Connect.');
  };

  if (mode === 'signin') {
    return (
      <SafeAreaView style={s.safe}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
          <ScrollView contentContainerStyle={s.scrollContent}>
            <View style={s.logoRow}>
              <View style={s.logoIcon}><Icon name="logo" size={18} color={C.paper} /></View>
              <Text style={s.logoText}>ISE Connect</Text>
            </View>
            <Stepper steps={['Sign in']} current={0} />
            <Text style={s.heading}>Welcome back.</Text>
            <Text style={s.subheading}>Pick up where you left off.</Text>
            <View style={s.fields}>
              <TextField label="Email" icon="mail" keyboardType="email-address" placeholder="you@chula.ise" value={form.email} onChangeText={v => upd('email', v)} />
              <TextField label="Password" icon="lock" secureTextEntry placeholder="••••••••" value={form.password} onChangeText={v => upd('password', v)} />
            </View>
            <View style={s.roleToggle}>
              <TouchableOpacity style={[s.roleBtn, role === 'hunter' && s.roleBtnActive]} onPress={() => setRole('hunter')}>
                <Text style={[s.roleBtnText, role === 'hunter' && s.roleBtnTextActive]}>Job Hunter</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.roleBtn, role === 'recruiter' && s.roleBtnActive]} onPress={() => setRole('recruiter')}>
                <Text style={[s.roleBtnText, role === 'recruiter' && s.roleBtnTextActive]}>Recruiter</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={finish}>
              <Text style={s.primaryBtnText}>Sign in</Text>
              <Icon name="arrow-right" size={16} color={C.paper} />
            </TouchableOpacity>
            <View style={s.switchRow}>
              <Text style={s.switchText}>New to ISE Connect? </Text>
              <TouchableOpacity onPress={() => { setMode('signup'); setStep(0); }}>
                <Text style={s.switchLink}>Create account</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scrollContent}>
          <View style={s.logoRow}>
            <View style={s.logoIcon}><Icon name="logo" size={18} color={C.paper} /></View>
            <Text style={s.logoText}>ISE Connect</Text>
          </View>
          <View style={s.stepperWrap}>
            <Stepper steps={stepsByRole[role]} current={step} />
          </View>

          {step === 0 && (
            <>
              <Text style={s.heading}>Create your account.</Text>
              <Text style={s.subheading}>Use your university email for faster verification.</Text>
              <View style={s.fields}>
                <TextField label="Full name" icon="user" placeholder="e.g. Proudmorakod T." value={form.name} onChangeText={v => upd('name', v)} />
                <TextField label="Email" icon="mail" keyboardType="email-address" placeholder="you@chula.ise" value={form.email} onChangeText={v => upd('email', v)} />
                <TextField label="Password" icon="lock" secureTextEntry placeholder="At least 8 characters" value={form.password} onChangeText={v => upd('password', v)} hint="Mix letters, numbers, and one symbol." />
              </View>
              <TouchableOpacity style={s.primaryBtn} onPress={() => setStep(1)}>
                <Text style={s.primaryBtnText}>Continue</Text>
                <Icon name="arrow-right" size={16} color={C.paper} />
              </TouchableOpacity>
              <View style={s.switchRow}>
                <Text style={s.switchText}>Already have an account? </Text>
                <TouchableOpacity onPress={() => setMode('signin')}>
                  <Text style={s.switchLink}>Sign in</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 1 && (
            <>
              <Text style={s.heading}>How will you use ISE Connect?</Text>
              <Text style={s.subheading}>You can add the other role later from settings.</Text>
              <View style={s.roleCards}>
                <RoleCard value="hunter" current={role} onPick={setRole} icon="compass" title="Job Hunter" sub="Student, recent grad, or anyone looking." bullets={['Browse off-cycle & research roles', 'One-click apply with your portfolio', 'Read anonymous workplace reviews']} />
                <RoleCard value="recruiter" current={role} onPick={setRole} icon="briefcase" title="Recruiter" sub="Employer, professor, or project lead." bullets={['Post roles to the ISE community', 'Filter candidates by skill & cohort', 'Manage applicants in one inbox']} />
              </View>
              <View style={s.navRow}>
                <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(0)}>
                  <Icon name="arrow-left" size={16} color={C.ink} />
                  <Text style={s.ghostBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.primaryBtn} onPress={() => setStep(2)}>
                  <Text style={s.primaryBtnText}>Continue</Text>
                  <Icon name="arrow-right" size={16} color={C.paper} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 2 && (
            <>
              <Text style={s.heading}>Tell us about you.</Text>
              <Text style={s.subheading}>{role === 'hunter' ? 'This becomes your community tag and profile headline.' : 'Your community tag tells students how you connect to the program.'}</Text>
              <View style={s.fields}>
                {role === 'hunter' ? (
                  <>
                    <SelectField label="Cohort tag" value={form.cohort} onChange={v => upd('cohort', v)} options={COHORT_OPTIONS} />
                    <SelectField label="Track" value={form.track} onChange={v => upd('track', v)} options={TRACK_OPTIONS} />
                    <TextField label="Headline" placeholder="e.g. Looking for ML internships, summer 2026" value={form.headline} onChangeText={v => upd('headline', v)} />
                  </>
                ) : (
                  <>
                    <TextField label="Your title" placeholder="e.g. Engineering Lead" value={form.position} onChangeText={v => upd('position', v)} />
                    <SelectField
                      label="ISE alumni?"
                      value={form.isAlumni ? 'y' : 'n'}
                      onChange={v => upd('isAlumni', v === 'y')}
                      options={[{ value: 'y', label: 'Yes — I am an alum' }, { value: 'n', label: 'No' }]}
                    />
                    {form.isAlumni && <SelectField label="Alumni cohort" value={form.alumniCohort} onChange={v => upd('alumniCohort', v)} options={ALUMNI_OPTIONS} />}
                  </>
                )}
              </View>
              <View style={s.navRow}>
                <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(1)}>
                  <Icon name="arrow-left" size={16} color={C.ink} />
                  <Text style={s.ghostBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.primaryBtn} onPress={() => setStep(3)}>
                  <Text style={s.primaryBtnText}>Continue</Text>
                  <Icon name="arrow-right" size={16} color={C.paper} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 3 && role === 'hunter' && (
            <>
              <Text style={s.heading}>Build a starter profile.</Text>
              <Text style={s.subheading}>Add a few skills so recruiters and the board can match you.</Text>
              <View style={s.fields}>
                <TextField label="Top skills (comma separated)" placeholder="Python, React, OpenCV…" value={form.skills} onChangeText={v => upd('skills', v)} />
                <View style={s.uploadBox}>
                  <Icon name="upload" size={18} color={C.muted} />
                  <Text style={s.uploadText}>Drop a PDF or tap to upload resume (optional)</Text>
                </View>
              </View>
              <View style={s.navRow}>
                <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(2)}>
                  <Icon name="arrow-left" size={16} color={C.ink} />
                  <Text style={s.ghostBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.primaryBtn} onPress={finish}>
                  <Text style={s.primaryBtnText}>Enter ISE Connect</Text>
                  <Icon name="arrow-right" size={16} color={C.paper} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {step === 3 && role === 'recruiter' && (
            <>
              <Text style={s.heading}>Tell us about your team.</Text>
              <Text style={s.subheading}>This appears beside every role you post. Verified within 24h.</Text>
              <View style={s.fields}>
                <TextField label="Company / lab name" placeholder="e.g. Linewell Robotics" value={form.company} onChangeText={v => upd('company', v)} />
                <TextField label="Tag (location · industry)" placeholder="e.g. Bangkok · Hardware/AI" value={form.companyTag} onChangeText={v => upd('companyTag', v)} />
              </View>
              <View style={s.navRow}>
                <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(2)}>
                  <Icon name="arrow-left" size={16} color={C.ink} />
                  <Text style={s.ghostBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={s.primaryBtn} onPress={finish}>
                  <Text style={s.primaryBtnText}>Enter ISE Connect</Text>
                  <Icon name="arrow-right" size={16} color={C.paper} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.paper },
  scrollContent: { padding: 24, paddingBottom: 48 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  logoIcon: { width: 32, height: 32, borderRadius: 8, backgroundColor: C.teal600, alignItems: 'center', justifyContent: 'center' },
  logoText: { fontSize: 18, fontWeight: '500', color: C.ink },
  stepperWrap: { marginBottom: 20 },
  heading: { fontSize: 36, fontFamily: F.serif, fontStyle: 'italic', color: C.ink, lineHeight: 40, marginBottom: 6 },
  subheading: { fontSize: 14, color: C.muted, marginBottom: 20, lineHeight: 20 },
  fields: { gap: 12, marginBottom: 20 },
  roleCards: { gap: 12, marginBottom: 20 },
  navRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 12 },
  primaryBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.teal600, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { fontSize: 15, fontWeight: '500', color: C.paper },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.line },
  ghostBtnText: { fontSize: 15, color: C.ink },
  roleToggle: { flexDirection: 'row', backgroundColor: C.paper2, borderRadius: 10, padding: 3, marginBottom: 16 },
  roleBtn: { flex: 1, paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  roleBtnActive: { backgroundColor: C.paper },
  roleBtnText: { fontSize: 13, color: C.muted },
  roleBtnTextActive: { color: C.ink },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { fontSize: 13, color: C.muted },
  switchLink: { fontSize: 13, color: C.ink, textDecorationLine: 'underline' },
  uploadBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, borderRadius: 10, padding: 20, alignItems: 'center', gap: 8 },
  uploadText: { fontSize: 13, color: C.muted, textAlign: 'center' },
});
