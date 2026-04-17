// src/screens/client/PerfilScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { typography } from '../../theme/typography';
import { spacing } from '@/theme/spacing';

export function PerfilScreen() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: theme.text.primary, marginBottom: spacing.lg }]}>Perfil</Text>
        <Card style={{ marginBottom: spacing.md }}>
          <Text style={[typography.h3, { color: theme.text.primary }]}>{user?.name}</Text>
          <Text style={[typography.body, { color: theme.text.secondary }]}>{user?.phone}</Text>
          <Text style={[typography.caption, { color: theme.accent.secondary }]}>{user?.role}</Text>
        </Card>
        <Button
          label={isDark ? '☀️ Tema claro' : '🌙 Tema escuro'}
          onPress={toggleTheme}
          variant="secondary"
          style={{ marginBottom: spacing.sm }}
        />
        <Button label="Sair" onPress={signOut} variant="ghost" />
      </View>
    </SafeAreaView>
  );
}
