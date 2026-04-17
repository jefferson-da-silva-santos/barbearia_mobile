// src/screens/client/HomeScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View, Text, SafeAreaView, ScrollView,
  TouchableOpacity, FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useClientAppointments } from '../../hooks/useAppointments';
import { AppointmentCard } from '../../components/appointment/AppointmentCard';
import { Button } from '../../components/common/Button';
import { typography } from '../../theme/typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { spacing, borderRadius } from '@/theme/spacing';

export function HomeScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { appointments, loading, refresh } = useClientAppointments(user!.id);

  const upcoming = appointments.filter(a =>
    ['CONFIRMADO', 'PENDENTE'].includes(a.status) && a.date >= format(new Date(), 'yyyy-MM-dd')
  ).slice(0, 3);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      <ScrollView contentContainerStyle={{ padding: spacing.lg }}>

        {/* Header */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.xl }}>
          <View>
            <Text style={[typography.caption, { color: theme.text.tertiary }]}>
              {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
            </Text>
            <Text style={[typography.h2, { color: theme.text.primary }]}>
              Olá, {user?.name.split(' ')[0]} 👋
            </Text>
          </View>
          <TouchableOpacity
            onPress={signOut}
            style={{ padding: spacing.xs }}
          >
            <Ionicons name="log-out-outline" size={22} color={theme.text.tertiary} />
          </TouchableOpacity>
        </View>

        {/* CTA principal */}
        <Button
          label="+ Novo agendamento"
          onPress={() => navigation.navigate('Agendamento')}
          style={{ marginBottom: spacing.xl }}
        />

        {/* Próximos agendamentos */}
        <View style={{ marginBottom: spacing.lg }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md }}>
            <Text style={[typography.h3, { color: theme.text.primary }]}>
              Próximos
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Historico')}>
              <Text style={[typography.label, { color: theme.accent.secondary }]}>Ver tudo</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={[typography.body, { color: theme.text.tertiary }]}>Carregando...</Text>
          ) : upcoming.length === 0 ? (
            <View style={{
              backgroundColor: theme.background.secondary,
              borderRadius: borderRadius.lg,
              padding: spacing.xl,
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 32, marginBottom: spacing.sm }}>📅</Text>
              <Text style={[typography.body, { color: theme.text.secondary, textAlign: 'center' }]}>
                Nenhum agendamento por aqui.{'\n'}Que tal marcar um corte?
              </Text>
            </View>
          ) : (
            upcoming.map(apt => (
              <AppointmentCard
                key={apt.id}
                appointment={apt}
                onPress={() => navigation.navigate('Confirmacao', { appointmentId: apt.id })}
              />
            ))
          )}
        </View>

        {/* Ações rápidas */}
        <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
          Ações rápidas
        </Text>
        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          {[
            { icon: 'time-outline', label: 'Histórico', screen: 'Historico' },
            { icon: 'person-outline', label: 'Perfil', screen: 'Perfil' },
            { icon: 'notifications-outline', label: 'Avisos', screen: 'Notificacoes' },
          ].map(item => (
            <TouchableOpacity
              key={item.screen}
              onPress={() => navigation.navigate(item.screen)}
              style={{
                flex: 1,
                backgroundColor: theme.background.secondary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                alignItems: 'center',
                borderWidth: 1,
                borderColor: theme.border.primary,
              }}
            >
              <Ionicons name={item.icon as any} size={24} color={theme.accent.secondary} />
              <Text style={[typography.caption, { color: theme.text.secondary, marginTop: 4 }]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}