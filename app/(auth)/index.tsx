import { useState } from 'react';
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
  firstName: string; lastName: string;
  email: string; password: string; confirmPassword: string;
  studentId: string;
  major: string; batchNo: string; skills: string;
  company: string; position: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const MAJOR_OPTIONS = ['ICE', 'AI', 'ADME', 'NANO', 'AERO', 'SEMI'].map(v => ({ value: v, label: v }));
const BATCH_OPTIONS = Array.from({ length: 20 }, (_, i) => ({ value: String(i + 1), label: `#${i + 1}` }));

const ENGLISH_RE = /^[A-Za-z\s'\-.]+$/;
const STUDENT_ID_RE = /^\d{10}$/;
const ALLOWED_DOMAINS = ['gmail.com', 'student.chula.ac.th', 'alumni.chula.ac.th'];

function validateEmailDomain(email: string): string | undefined {
  if (!email.trim()) return 'Email is required.';
  const domain = email.split('@')[1];
  if (!domain || !ALLOWED_DOMAINS.includes(domain)) {
    return 'Use @gmail.com, @student.chula.ac.th, or @alumni.chula.ac.th.';
  }
  return undefined;
}

export default function AuthScreen() {
  const { setUser, toast, registerUser, isEmailRegistered } = useAppContext();
  const [mode, setMode] = useState<Mode>('signup');
  const [step, setStep] = useState(0);
  const [role, setRole] = useState<Role>('hunter');
  const [form, setForm] = useState<FormState>({
    firstName: '', lastName: '',
    email: '', password: '', confirmPassword: '', studentId: '',
    major: 'ICE', batchNo: '19', skills: '',
    company: '', position: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const upd = (k: keyof FormState, v: FormState[typeof k]) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const stepLabels = {
    hunter: ['Role', 'Account', 'About you', 'Skills'],
    recruiter: ['Role', 'Account', 'About you'],
  };

  const validateAccount = (): FormErrors => {
    const e: FormErrors = {};
    if (!form.firstName.trim()) e.firstName = 'First name is required.';
    else if (!ENGLISH_RE.test(form.firstName)) e.firstName = 'English characters only.';
    if (!form.lastName.trim()) e.lastName = 'Last name is required.';
    else if (!ENGLISH_RE.test(form.lastName)) e.lastName = 'English characters only.';
    const emailErr = validateEmailDomain(form.email);
    if (emailErr) e.email = emailErr;
    if (!form.studentId.trim()) e.studentId = 'Student ID is required.';
    else if (!STUDENT_ID_RE.test(form.studentId)) e.studentId = 'Must be exactly 10 digits.';
    if (!form.password) e.password = 'Password is required.';
    else if (form.password.length < 8) e.password = 'At least 8 characters.';
    if (!form.confirmPassword) e.confirmPassword = 'Please confirm your password.';
    else if (form.confirmPassword !== form.password) e.confirmPassword = 'Passwords do not match.';
    return e;
  };

  const validateDetails = (): FormErrors => ({});

  const validateProfile = (): FormErrors => {
    const e: FormErrors = {};
    if (role === 'hunter') {
      if (!form.skills.trim()) e.skills = 'Please enter at least one skill.';
    } else {
      if (!form.position.trim()) e.position = 'Your title is required.';
      if (!form.company.trim()) e.company = 'Company name is required.';
    }
    return e;
  };

  const advance = (next: number) => {
    let errs: FormErrors = {};
    if (step === 1) errs = validateAccount();
    else if (step === 2) errs = validateDetails();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStep(next);
  };

  const finish = () => {
    const errs = validateProfile();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    const fullName = `${form.firstName} ${form.lastName}`;
    const cohort = `${form.major}#${form.batchNo}`;
    const profile = role === 'hunter'
      ? {
          name: fullName, firstName: form.firstName, lastName: form.lastName,
          email: form.email, studentId: form.studentId,
          cohort,
          skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        }
      : {
          name: fullName, firstName: form.firstName, lastName: form.lastName,
          email: form.email, studentId: form.studentId,
          cohort,
          company: form.company,
          position: form.position,
        };
    registerUser(form.email);
    setUser({ role, profile });
    toast('Welcome to ISE Connect.');
  };

  const signIn = () => {
    const e: FormErrors = {};
    if (!form.email.trim()) e.email = 'Email is required.';
    if (!form.password.trim()) e.password = 'Password is required.';
    if (!e.email && !isEmailRegistered(form.email)) {
      e.email = 'No account found with this email. Please sign up first.';
    }
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setUser({ role: 'hunter', profile: { name: 'User', email: form.email } });
    toast('Welcome back.');
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
              <TextField
                label="Email *" icon="mail" keyboardType="email-address"
                placeholder="you@student.chula.ac.th"
                value={form.email} onChangeText={v => upd('email', v)}
                error={errors.email}
              />
              <TextField
                label="Password *" icon="lock" secureTextEntry
                placeholder="••••••••"
                value={form.password} onChangeText={v => upd('password', v)}
                error={errors.password}
              />
            </View>
            <TouchableOpacity style={s.primaryBtn} onPress={signIn}>
              <Text style={s.primaryBtnText}>Sign in</Text>
              <Icon name="arrow-right" size={16} color={C.paper} />
            </TouchableOpacity>
            <View style={s.switchRow}>
              <Text style={s.switchText}>New to ISE Connect? </Text>
              <TouchableOpacity onPress={() => { setMode('signup'); setStep(0); setErrors({}); }}>
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
            <Stepper steps={stepLabels[role]} current={step} />
          </View>

          {/* Step 0 — Role selection */}
          {step === 0 && (
            <>
              <Text style={s.heading}>How will you use ISE Connect?</Text>
              <Text style={s.subheading}>Choose your role to get started. You can add another later.</Text>
              <View style={s.roleCards}>
                <RoleCard value="hunter" current={role} onPick={setRole} icon="compass" title="Job Hunter" sub="Student, recent grad, or anyone looking." bullets={['Browse off-cycle & research roles', 'Apply with your portfolio', 'Read anonymous workplace reviews']} />
                <RoleCard value="recruiter" current={role} onPick={setRole} icon="briefcase" title="Recruiter" sub="Employer, professor, or project lead." bullets={['Post roles to the ISE community', 'Filter candidates by skill & cohort', 'Manage applicants in one inbox']} />
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

          {/* Step 1 — Account details */}
          {step === 1 && (
            <>
              <Text style={s.heading}>Create your account.</Text>
              <Text style={s.subheading}>All fields are required. Use your university email.</Text>
              <View style={s.fields}>
                <View style={s.nameRow}>
                  <View style={s.nameField}>
                    <TextField label="First name *" icon="user" placeholder="e.g. Proudmorakod" value={form.firstName} onChangeText={v => upd('firstName', v)} error={errors.firstName} />
                  </View>
                  <View style={s.nameField}>
                    <TextField label="Last name *" placeholder="e.g. Tanaka" value={form.lastName} onChangeText={v => upd('lastName', v)} error={errors.lastName} />
                  </View>
                </View>
                <TextField label="Email *" icon="mail" keyboardType="email-address" placeholder="you@student.chula.ac.th" value={form.email} onChangeText={v => upd('email', v)} error={errors.email} hint="@gmail.com · @student.chula.ac.th · @alumni.chula.ac.th" />
                <TextField label="Student ID *" icon="id-card" keyboardType="numeric" placeholder="10-digit number" value={form.studentId} onChangeText={v => upd('studentId', v)} error={errors.studentId} />
                <TextField label="Password *" icon="lock" secureTextEntry placeholder="At least 8 characters" value={form.password} onChangeText={v => upd('password', v)} error={errors.password} />
                <TextField label="Confirm password *" icon="lock" secureTextEntry placeholder="Re-enter your password" value={form.confirmPassword} onChangeText={v => upd('confirmPassword', v)} error={errors.confirmPassword} />
              </View>
              <View style={s.navRow}>
                <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(0)}>
                  <Icon name="arrow-left" size={16} color={C.ink} />
                  <Text style={s.ghostBtnText}>Back</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[s.primaryBtn, s.flex1]} onPress={() => advance(2)}>
                  <Text style={s.primaryBtnText}>Continue</Text>
                  <Icon name="arrow-right" size={16} color={C.paper} />
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* Step 2 — ISE identity (+ company for recruiters) */}
          {step === 2 && (
            <>
              <Text style={s.heading}>Tell us about you.</Text>
              <Text style={s.subheading}>Pick your ISE major and batch — this becomes your community tag.</Text>
              <View style={s.fields}>
                <SelectField label="ISE major *" value={form.major} onChange={v => upd('major', v)} options={MAJOR_OPTIONS} />
                <SelectField label="Batch No. *" value={form.batchNo} onChange={v => upd('batchNo', v)} options={BATCH_OPTIONS} />
                <Text style={s.tagPreview}>Your tag: <Text style={s.tagPreviewBold}>{form.major}#{form.batchNo}</Text></Text>
                {role === 'recruiter' && (
                  <>
                    <View style={s.divider} />
                    <TextField label="Your title *" placeholder="e.g. Engineering Lead" value={form.position} onChangeText={v => upd('position', v)} error={errors.position} />
                    <TextField label="Company / lab name *" placeholder="e.g. Linewell Robotics" value={form.company} onChangeText={v => upd('company', v)} error={errors.company} />
                  </>
                )}
              </View>
              <View style={s.navRow}>
                <TouchableOpacity style={s.ghostBtn} onPress={() => setStep(1)}>
                  <Icon name="arrow-left" size={16} color={C.ink} />
                  <Text style={s.ghostBtnText}>Back</Text>
                </TouchableOpacity>
                {role === 'hunter' ? (
                  <TouchableOpacity style={[s.primaryBtn, s.flex1]} onPress={() => advance(3)}>
                    <Text style={s.primaryBtnText}>Continue</Text>
                    <Icon name="arrow-right" size={16} color={C.paper} />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity style={[s.primaryBtn, s.flex1]} onPress={finish}>
                    <Text style={s.primaryBtnText}>Enter ISE Connect</Text>
                    <Icon name="arrow-right" size={16} color={C.paper} />
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}

          {/* Step 3 — Hunter: skills */}
          {step === 3 && role === 'hunter' && (
            <>
              <Text style={s.heading}>Build a starter profile.</Text>
              <Text style={s.subheading}>Add your top skills so recruiters and the board can match you.</Text>
              <View style={s.fields}>
                <TextField
                  label="Top skills * (comma separated)"
                  placeholder="Python, React, OpenCV…"
                  value={form.skills}
                  onChangeText={v => upd('skills', v)}
                  error={errors.skills}
                />
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
                <TouchableOpacity style={[s.primaryBtn, s.flex1]} onPress={finish}>
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
  nameRow: { flexDirection: 'row', gap: 10 },
  nameField: { flex: 1 },
  navRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  flex1: { flex: 1 },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: C.teal600, paddingVertical: 12, borderRadius: 12 },
  primaryBtnText: { fontSize: 15, fontWeight: '500', color: C.paper },
  ghostBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, borderColor: C.line },
  ghostBtnText: { fontSize: 15, color: C.ink },
  switchRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  switchText: { fontSize: 13, color: C.muted },
  switchLink: { fontSize: 13, color: C.ink, textDecorationLine: 'underline' },
  uploadBox: { borderWidth: 1, borderStyle: 'dashed', borderColor: C.line, borderRadius: 10, padding: 20, alignItems: 'center', gap: 8 },
  uploadText: { fontSize: 13, color: C.muted, textAlign: 'center' },
  tagPreview: { fontSize: 13, color: C.muted, marginTop: 4 },
  tagPreviewBold: { color: C.teal600, fontFamily: F.mono },
  divider: { height: 1, backgroundColor: C.line, marginVertical: 12 },
});
