import React from 'react';
import { View, Text, SafeAreaView, ScrollView, RefreshControl } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useClientAppointments } from '../../hooks/useAppointments';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';
import { typography } from '../../theme/typography';
import { spacing } from '@/theme/spacing';

export function HistoricoScreen() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const { appointments, loading, refresh } = useClientAppointments(user!.id);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        <Text style={[typography.h2, { color: theme.text.primary, marginBottom: spacing.lg }]}>
          Histórico
        </Text>
        {appointments.map(apt => (
          <AppointmentCard key={apt.id} appointment={apt} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}