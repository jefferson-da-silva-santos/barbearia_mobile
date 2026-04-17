import React, { useState } from 'react';
import {
  View, Text, SafeAreaView, ScrollView,
  KeyboardAvoidingView, Platform, Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { typography } from '../../theme/typography';
import { spacing } from '@/theme/spacing';

export function LoginScreen() {
  const { theme } = useTheme();
  const { signIn } = useAuth();
  const [phone, setPhone] = useState('11900000003');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleLogin() {
    const errs: Record<string, string> = {};
    if (!phone.trim()) errs.phone = 'Informe o telefone';
    if (!password.trim()) errs.password = 'Informe a senha';
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setLoading(true);
    try {
      await signIn(phone.replace(/\D/g, ''), password);
    } catch (e: any) {
      Alert.alert('Erro ao entrar', e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: spacing.lg }}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo / Header */}
          <View style={{ alignItems: 'center', marginBottom: spacing.xxl }}>
            <Text style={{ fontSize: 48, marginBottom: spacing.sm }}>✂️</Text>
            <Text style={[typography.h1, { color: theme.text.primary, letterSpacing: 3 }]}>
              BARBERFLOW
            </Text>
            <Text style={[typography.body, { color: theme.text.tertiary, marginTop: 4 }]}>
              Seu controle de agendamentos
            </Text>
          </View>

          {/* Demo hint */}
          <View style={{
            backgroundColor: theme.background.secondary,
            borderRadius: 8,
            padding: spacing.sm,
            marginBottom: spacing.lg,
            borderLeftWidth: 3,
            borderLeftColor: theme.accent.primary,
          }}>
            <Text style={[typography.caption, { color: theme.text.secondary }]}>
              Demo: use 11900000001 (Dono) · 11900000002 (Barbeiro) · 11900000003 (Cliente) — senha: demo123
            </Text>
          </View>

          <Input
            label="Telefone"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="(11) 9 0000-0000"
            error={errors.phone}
          />
          <Input
            label="Senha"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
            error={errors.password}
          />

          <Button
            label="Entrar"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: spacing.sm }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}