// src/screens/barber/ConfiguracoesScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { typography } from '../../theme/typography';
import { spacing } from '@/theme/spacing';

export function ConfiguracoesScreen() {
  const { signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: theme.text.primary, marginBottom: spacing.lg }]}>Configurações</Text>
        <Button label={isDark ? '☀️ Tema claro' : '🌙 Tema escuro'} onPress={toggleTheme} variant="secondary" style={{ marginBottom: spacing.sm }} />
        <Button label="Sair" onPress={signOut} variant="ghost" />
      </View>
    </SafeAreaView>
  );
}
