// src/components/appointment/AppointmentCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Appointment, AppointmentStatus } from '../../models/types';
import { useTheme } from '../../context/ThemeContext';
import { Card } from '../common/Card';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  PENDENTE: 'Pendente',
  CONFIRMADO: 'Confirmado',
  CONCLUIDO: 'Concluído',
  CANCELADO: 'Cancelado',
  FALTA: 'Falta',
};

const STATUS_ICONS: Record<AppointmentStatus, string> = {
  PENDENTE: 'time-outline',
  CONFIRMADO: 'checkmark-circle-outline',
  CONCLUIDO: 'checkmark-done-circle-outline',
  CANCELADO: 'close-circle-outline',
  FALTA: 'alert-circle-outline',
};

interface AppointmentCardProps {
  appointment: Appointment;
  onPress?: () => void;
  showClient?: boolean;
}

export function AppointmentCard({ appointment, onPress, showClient = false }: AppointmentCardProps) {
  const { theme } = useTheme();

  const statusColors: Record<AppointmentStatus, string> = {
    PENDENTE: theme.status.pending,
    CONFIRMADO: theme.status.info,
    CONCLUIDO: theme.status.success,
    CANCELADO: theme.status.error,
    FALTA: theme.status.warning,
  };

  const statusColor = statusColors[appointment.status];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <Card style={{ marginBottom: spacing.sm }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View style={{ flex: 1 }}>
            <Text style={[typography.h4, { color: theme.text.primary }]}>
              {appointment.serviceName ?? 'Serviço'}
            </Text>
            {showClient && (
              <Text style={[typography.body, { color: theme.text.secondary }]}>
                {appointment.clientName}
              </Text>
            )}
            <Text style={[typography.label, { color: theme.accent.secondary, marginTop: 2 }]}>
              {appointment.startTime} — {appointment.endTime}
            </Text>
          </View>
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: statusColor + '22',
            paddingHorizontal: spacing.sm,
            paddingVertical: 4,
            borderRadius: 20,
            gap: 4,
          }}>
            <Ionicons
              name={STATUS_ICONS[appointment.status] as any}
              size={14}
              color={statusColor}
            />
            <Text style={[typography.caption, { color: statusColor, fontWeight: '600' }]}>
              {STATUS_LABELS[appointment.status]}
            </Text>
          </View>
        </View>
        {appointment.barberName && (
          <Text style={[typography.caption, { color: theme.text.tertiary, marginTop: spacing.xs }]}>
            ✂ {appointment.barberName} · R$ {appointment.servicePrice?.toFixed(2)}
          </Text>
        )}
      </Card>
    </TouchableOpacity>
  );
}