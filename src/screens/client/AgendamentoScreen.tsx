// src/screens/client/AgendamentoScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View, Text, SafeAreaView, ScrollView,
  TouchableOpacity, FlatList, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getDB } from '../../database/db';
import { Service, TimeSlot } from '../../models/types';
import { getAvailableSlots, createAppointment } from '../../services/appointmentService';
import { Button } from '../../components/common/Button';
import { typography } from '../../theme/typography';
import { spacing, borderRadius } from '@/theme/spacing';

type Step = 'servico' | 'barbeiro' | 'data' | 'horario' | 'confirmando';

export function AgendamentoScreen({ navigation }: any) {
  const { user, theme: _ } = useAuth() as any;
  const { theme } = useTheme();

  const [step, setStep] = useState<Step>('servico');
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [slots, setSlots] = useState<TimeSlot[]>([]);

  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedBarber, setSelectedBarber] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const next7Days = Array.from({ length: 14 }, (_, i) => addDays(new Date(), i + 1));

  useEffect(() => { loadServices(); }, []);
  useEffect(() => {
    if (selectedBarber && selectedDate && selectedService) loadSlots();
  }, [selectedBarber, selectedDate, selectedService]);

  async function loadServices() {
    const db = await getDB();
    const data = await db.getAllAsync<any>(
      `SELECT * FROM services WHERE barbershop_id = ? AND is_active = 1`,
      [user?.barbershopId ?? 'shop_demo_001']
    );
    setServices(data.map(r => ({
      id: r.id, barbershopId: r.barbershop_id, barberId: r.barber_id,
      name: r.name, description: r.description,
      price: r.price, durationMinutes: r.duration_minutes, isActive: !!r.is_active,
    })));
  }

  async function loadBarbers() {
    const db = await getDB();
    const data = await db.getAllAsync<any>(
      `SELECT * FROM users WHERE role = 'BARBEIRO' AND barbershop_id = ? AND is_active = 1`,
      [user?.barbershopId ?? 'shop_demo_001']
    );
    setBarbers(data);
  }

  async function loadSlots() {
    if (!selectedService || !selectedBarber || !selectedDate) return;
    const available = await getAvailableSlots(
      selectedBarber.id, selectedDate, selectedService.durationMinutes
    );
    setSlots(available);
  }

  async function handleConfirm() {
    if (!selectedService || !selectedBarber || !selectedDate || !selectedSlot) return;
    setLoading(true);
    try {
      const apt = await createAppointment({
        clientId: user!.id,
        barberId: selectedBarber.id,
        serviceId: selectedService.id,
        barbershopId: user?.barbershopId ?? 'shop_demo_001',
        date: selectedDate,
        startTime: selectedSlot,
        durationMinutes: selectedService.durationMinutes,
      });
      navigation.replace('Confirmacao', { appointmentId: apt.id, isNew: true });
    } catch (e: any) {
      Alert.alert('Erro', e.message);
    } finally {
      setLoading(false);
    }
  }

  const stepIndex = ['servico', 'barbeiro', 'data', 'horario'].indexOf(step);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background.primary }}>
      {/* Progress */}
      <View style={{ flexDirection: 'row', padding: spacing.lg, gap: spacing.xs }}>
        {['Serviço', 'Barbeiro', 'Data', 'Horário'].map((label, i) => (
          <View key={label} style={{ flex: 1, alignItems: 'center' }}>
            <View style={{
              height: 3, borderRadius: 2,
              backgroundColor: i <= stepIndex ? theme.accent.primary : theme.border.primary,
              marginBottom: 4,
            }} />
            <Text style={[typography.caption, {
              color: i <= stepIndex ? theme.accent.secondary : theme.text.tertiary,
            }]}>{label}</Text>
          </View>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.lg, paddingTop: 0 }}>

        {/* STEP: Serviço */}
        {step === 'servico' && (
          <View>
            <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
              Escolha o serviço
            </Text>
            {services.map(svc => (
              <TouchableOpacity
                key={svc.id}
                onPress={() => { setSelectedService(svc); loadBarbers(); setStep('barbeiro'); }}
                style={{
                  backgroundColor: theme.background.secondary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  borderWidth: 1,
                  borderColor: selectedService?.id === svc.id
                    ? theme.accent.primary : theme.border.primary,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={[typography.h4, { color: theme.text.primary }]}>{svc.name}</Text>
                  <Text style={[typography.h4, { color: theme.accent.secondary }]}>
                    R$ {svc.price.toFixed(2)}
                  </Text>
                </View>
                <Text style={[typography.caption, { color: theme.text.tertiary, marginTop: 2 }]}>
                  ⏱ {svc.durationMinutes} min
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* STEP: Barbeiro */}
        {step === 'barbeiro' && (
          <View>
            <TouchableOpacity onPress={() => setStep('servico')} style={{ marginBottom: spacing.md }}>
              <Text style={[typography.label, { color: theme.text.tertiary }]}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
              Escolha o barbeiro
            </Text>
            {barbers.map(b => (
              <TouchableOpacity
                key={b.id}
                onPress={() => { setSelectedBarber(b); setStep('data'); }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  backgroundColor: theme.background.secondary,
                  borderRadius: borderRadius.md,
                  padding: spacing.md,
                  marginBottom: spacing.sm,
                  borderWidth: 1,
                  borderColor: selectedBarber?.id === b.id
                    ? theme.accent.primary : theme.border.primary,
                }}
              >
                <View style={{
                  width: 44, height: 44, borderRadius: 22,
                  backgroundColor: theme.accent.primary + '33',
                  alignItems: 'center', justifyContent: 'center', marginRight: spacing.md,
                }}>
                  <Text style={{ fontSize: 20 }}>✂️</Text>
                </View>
                <View>
                  <Text style={[typography.h4, { color: theme.text.primary }]}>{b.name}</Text>
                  <Text style={[typography.caption, { color: theme.text.tertiary }]}>Barbeiro profissional</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* STEP: Data */}
        {step === 'data' && (
          <View>
            <TouchableOpacity onPress={() => setStep('barbeiro')} style={{ marginBottom: spacing.md }}>
              <Text style={[typography.label, { color: theme.text.tertiary }]}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
              Escolha a data
            </Text>
            <FlatList
              data={next7Days}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={d => d.toISOString()}
              renderItem={({ item: day }) => {
                const dateStr = format(day, 'yyyy-MM-dd');
                const isSelected = selectedDate === dateStr;
                return (
                  <TouchableOpacity
                    onPress={() => { setSelectedDate(dateStr); setStep('horario'); }}
                    style={{
                      alignItems: 'center',
                      backgroundColor: isSelected ? theme.accent.primary : theme.background.secondary,
                      borderRadius: borderRadius.md,
                      padding: spacing.sm,
                      marginRight: spacing.sm,
                      minWidth: 60,
                      borderWidth: 1,
                      borderColor: isSelected ? theme.accent.primary : theme.border.primary,
                    }}
                  >
                    <Text style={[typography.caption, {
                      color: isSelected ? theme.text.inverse : theme.text.tertiary,
                      textTransform: 'uppercase',
                    }]}>
                      {format(day, 'EEE', { locale: ptBR })}
                    </Text>
                    <Text style={[typography.h3, {
                      color: isSelected ? theme.text.inverse : theme.text.primary,
                    }]}>
                      {format(day, 'd')}
                    </Text>
                    <Text style={[typography.caption, {
                      color: isSelected ? theme.text.inverse : theme.text.tertiary,
                    }]}>
                      {format(day, 'MMM', { locale: ptBR })}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        )}

        {/* STEP: Horário */}
        {step === 'horario' && (
          <View>
            <TouchableOpacity onPress={() => setStep('data')} style={{ marginBottom: spacing.md }}>
              <Text style={[typography.label, { color: theme.text.tertiary }]}>← Voltar</Text>
            </TouchableOpacity>
            <Text style={[typography.h3, { color: theme.text.primary, marginBottom: spacing.md }]}>
              Escolha o horário
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {slots.map(slot => (
                <TouchableOpacity
                  key={slot.time}
                  disabled={!slot.available}
                  onPress={() => setSelectedSlot(slot.time)}
                  style={{
                    paddingHorizontal: spacing.md,
                    paddingVertical: spacing.sm,
                    borderRadius: borderRadius.sm,
                    borderWidth: 1,
                    borderColor: !slot.available
                      ? theme.border.primary
                      : selectedSlot === slot.time
                        ? theme.accent.primary
                        : theme.border.secondary,
                    backgroundColor: !slot.available
                      ? theme.background.secondary
                      : selectedSlot === slot.time
                        ? theme.accent.primary
                        : 'transparent',
                    opacity: slot.available ? 1 : 0.4,
                  }}
                >
                  <Text style={[typography.label, {
                    color: selectedSlot === slot.time
                      ? theme.text.inverse
                      : slot.available
                        ? theme.text.primary
                        : theme.text.tertiary,
                  }]}>
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedSlot && (
              <View style={{
                marginTop: spacing.xl,
                backgroundColor: theme.background.secondary,
                borderRadius: borderRadius.md,
                padding: spacing.md,
                borderWidth: 1, borderColor: theme.border.primary,
                marginBottom: spacing.lg,
              }}>
                <Text style={[typography.h4, { color: theme.text.primary, marginBottom: spacing.xs }]}>
                  Resumo do agendamento
                </Text>
                <Text style={[typography.body, { color: theme.text.secondary }]}>
                  ✂️ {selectedService?.name}
                </Text>
                <Text style={[typography.body, { color: theme.text.secondary }]}>
                  👤 {selectedBarber?.name}
                </Text>
                <Text style={[typography.body, { color: theme.text.secondary }]}>
                  📅 {format(new Date(selectedDate + 'T12:00:00'), "d 'de' MMMM", { locale: ptBR })} às {selectedSlot}
                </Text>
                <Text style={[typography.body, { color: theme.accent.secondary, fontWeight: '700' }]}>
                  💰 R$ {selectedService?.price.toFixed(2)}
                </Text>
              </View>
            )}

            {selectedSlot && (
              <Button
                label="Confirmar agendamento"
                onPress={handleConfirm}
                loading={loading}
              />
            )}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}