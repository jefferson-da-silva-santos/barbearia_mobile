// src/hooks/useAppointments.ts
import { useState, useCallback, useEffect } from 'react';
import { Appointment } from '../models/types';
import * as AppointmentService from '../services/appointmentService';

export function useClientAppointments(clientId: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await AppointmentService.getAppointmentsByClient(clientId);
      setAppointments(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [clientId]);

  useEffect(() => { load(); }, [load]);

  return { appointments, loading, error, refresh: load };
}

export function useBarberAppointments(barberId: string, date: string) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await AppointmentService.getAppointmentsByBarber(barberId, date);
      setAppointments(data);
    } finally {
      setLoading(false);
    }
  }, [barberId, date]);

  useEffect(() => { load(); }, [load]);

  const updateStatus = useCallback(async (id: string, status: any) => {
    await AppointmentService.updateAppointmentStatus(id, status);
    await load();
  }, [load]);

  return { appointments, loading, refresh: load, updateStatus };
}