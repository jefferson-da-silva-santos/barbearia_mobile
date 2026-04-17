import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { Button } from '../../components/common/Button';
import { typography } from '../../theme/typography';
import { spacing } from '@/theme/spacing';  

export function ConfirmacaoScreen({ navigation, route }: any) {
  const { theme } = useTheme();
  const { isNew } = route.params ?? {};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary, justifyContent: 'center', alignItems: 'center', padding: spacing.xl }}>
      <Text style={{ fontSize: 64, marginBottom: spacing.lg }}>{isNew ? '✅' : '📅'}</Text>
      <Text style={[typography.h2, { color: theme.text.primary, textAlign: 'center' }]}>
        {isNew ? 'Agendamento confirmado!' : 'Detalhes do agendamento'}
      </Text>
      <Text style={[typography.body, { color: theme.text.secondary, textAlign: 'center', marginTop: spacing.sm, marginBottom: spacing.xl }]}>
        {isNew
          ? 'Você receberá um lembrete antes do horário.'
          : 'Acompanhe seu agendamento aqui.'}
      </Text>
      <Button label="Voltar para o início" onPress={() => navigation.popToTop()} />
    </SafeAreaView>
  );
}