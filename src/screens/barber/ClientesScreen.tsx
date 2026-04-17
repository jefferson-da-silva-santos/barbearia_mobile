// src/screens/barber/ClientesScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '@/theme/spacing';

export function ClientesScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: theme.text.primary }]}>Clientes</Text>
        <Text style={[typography.body, { color: theme.text.tertiary, marginTop: spacing.sm }]}>
          Lista de clientes com histórico e observações
        </Text>
      </View>
    </SafeAreaView>
  );
}
