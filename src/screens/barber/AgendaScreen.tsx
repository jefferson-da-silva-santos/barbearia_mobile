// src/screens/barber/AgendaScreen.tsx
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { typography } from '../../theme/typography';
import { spacing } from '@/theme/spacing';

export function AgendaScreen() {
  const { theme } = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <View style={{ padding: spacing.lg }}>
        <Text style={[typography.h2, { color: theme.text.primary }]}>Agenda semanal</Text>
        <Text style={[typography.body, { color: theme.text.tertiary, marginTop: spacing.sm }]}>
          Em desenvolvimento — semana completa com bloqueio de horários
        </Text>
      </View>
    </SafeAreaView>
  );
}
