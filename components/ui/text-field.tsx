import { Icon } from '@/components/icon';
import { C } from '@/constants/theme';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, type TextInputProps, TouchableOpacity, View } from 'react-native';

interface Props extends TextInputProps {
  label?: string;
  hint?: string;
  error?: string;
  icon?: string;
}

export function TextField({ label, hint, error, icon, secureTextEntry, style, ...rest }: Props) {
  const [hidden, setHidden] = useState(true);

  return (
    <View>
      {label && <Text style={s.label}>{label}</Text>}
      <View style={s.inputWrap}>
        {icon && (
          <View style={s.iconWrap}>
            <Icon name={icon} size={16} color={C.muted} />
          </View>
        )}
        <TextInput
          style={[s.input, icon && s.inputWithIcon, secureTextEntry && s.inputWithEye, error ? s.inputError : null, style as any]}
          placeholderTextColor={C.muted}
          secureTextEntry={secureTextEntry && hidden}
          {...rest}
        />
        {secureTextEntry && (
          <TouchableOpacity style={s.eyeWrap} onPress={() => setHidden(h => !h)} hitSlop={8}>
            <Icon name={hidden ? 'eye' : 'eye-off'} size={16} color={C.muted} />
          </TouchableOpacity>
        )}
      </View>
      {hint && !error && <Text style={s.hint}>{hint}</Text>}
      {error && <Text style={s.errorText}>{error}</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  label: { fontSize: 12, fontWeight: '500', color: C.ink2, marginBottom: 6 },
  inputWrap: { position: 'relative' },
  iconWrap: { position: 'absolute', left: 12, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 },
  eyeWrap: { position: 'absolute', right: 12, top: 0, bottom: 0, justifyContent: 'center', zIndex: 1 },
  input: { backgroundColor: C.paper, borderWidth: 1, borderColor: C.line, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 10, fontSize: 14, color: C.ink },
  inputWithIcon: { paddingLeft: 38 },
  inputWithEye: { paddingRight: 38 },
  inputError: { borderColor: C.ember },
  hint: { fontSize: 11, color: C.muted, marginTop: 4 },
  errorText: { fontSize: 11, color: C.ember, marginTop: 4 },
});
