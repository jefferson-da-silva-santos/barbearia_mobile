import React, { useState, useCallback } from 'react';
import {
  View, Text, SafeAreaView, ScrollView,
  TouchableOpacity, RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useBarberAppointments } from '../../hooks/useAppointments';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';
import { Card } from '../../components/common/Card';
import { typography } from '@/theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

export function DashboardScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const today = format(new Date(), 'yyyy-MM-dd');
  const { appointments, loading, refresh, updateStatus } = useBarberAppointments(user!.id, today);

  const confirmed = appointments.filter(a => a.status === 'CONFIRMADO').length;
  const done = appointments.filter(a => a.status === 'CONCLUIDO').length;
  const revenue = appointments
    .filter(a => a.status === 'CONCLUIDO')
    .reduce((sum, a) => sum + (a.servicePrice ?? 0), 0);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} />}
      >
        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <View>
            <Text style={[typography.caption, { color: theme.text.tertiary }]}>
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </Text>
            <Text style={[typography.h2, { color: theme.text.primary }]}>
              Dashboard ✂️
            </Text>
          </View>
          <TouchableOpacity onPress={signOut}>
            <Ionicons name="log-out-outline" size={22} color={theme.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* Métricas */}
        <View style={{ flexDirection: 'row', gap: spacing.sm, marginBottom: spacing.xl }}>
          {[
            { label: 'Agendados', value: confirmed, icon: 'calendar-outline' },
            { label: 'Concluídos', value: done, icon: 'checkmark-circle-outline' },
            { label: 'Faturamento', value: `R$${revenue.toFixed(0)}`, icon: 'cash-outline' },
          ].map(m => (
            <Card key={m.label} style={{ flex: 1, alignItems: 'center' }}>
              <Ionicons name={m.icon as any} size={20} color={theme.accent.secondary} />
              <Text style={[typography.h3, { color: theme.text.primary, marginTop: 4 }]}>
                {m.value}
              </Text>
              <Text style={[typography.caption, { color: theme.text.tertiary }]}>{m.label}</Text>
            </Card>
          ))}
        </View>

        {/* Agenda do dia */}
        <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
          Agenda de hoje
        </Text>

        {appointments.length === 0 ? (
          <View style={{
            backgroundColor: theme.background.secondary,
            borderRadius: borderRadius.lg,
            padding: spacing.xl,
            alignItems: 'center',
          }}>
            <Text style={{ fontSize: 32 }}>🎉</Text>
            <Text style={[typography.body, { color: theme.text.secondary, marginTop: spacing.sm, textAlign: 'center' }]}>
              Nenhum agendamento para hoje!
            </Text>
          </View>
        ) : (
          appointments.map(apt => (
            <View key={apt.id}>
              <AppointmentCard
                appointment={apt}
                showClient
                onPress={() => { }}
              />
              {apt.status === 'CONFIRMADO' && (
                <View style={{ flexDirection: 'row', gap: spacing.sm, marginTop: -spacing.xs, marginBottom: spacing.md }}>
                  <TouchableOpacity
                    onPress={() => updateStatus(apt.id, 'CONCLUIDO')}
                    style={{
                      flex: 1,
                      backgroundColor: theme.status.success + '22',
                      borderRadius: borderRadius.sm,
                      padding: spacing.sm,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={[typography.label, { color: theme.status.success }]}>✓ Concluir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => updateStatus(apt.id, 'FALTA')}
                    style={{
                      flex: 1,
                      backgroundColor: theme.status.warning + '22',
                      borderRadius: borderRadius.sm,
                      padding: spacing.sm,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={[typography.label, { color: theme.status.warning }]}>✗ Falta</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}