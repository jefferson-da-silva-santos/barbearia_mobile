// src/services/appointmentService.ts
import { getDB } from '../database/db';
import { Appointment, AppointmentStatus, TimeSlot } from '../models/types';
import { format, addMinutes, parseISO } from 'date-fns';

function generateId() {
  return 'apt_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
}

export async function getAppointmentsByClient(clientId: string): Promise<Appointment[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(`
    SELECT a.*,
           u_barber.name as barber_name,
           s.name as service_name,
           s.price as service_price
    FROM appointments a
    LEFT JOIN users u_barber ON a.barber_id = u_barber.id
    LEFT JOIN services s ON a.service_id = s.id
    WHERE a.client_id = ?
    ORDER BY a.date DESC, a.start_time DESC
  `, [clientId]);

  return rows.map(mapRow);
}

export async function getAppointmentsByBarber(
  barberId: string, date: string
): Promise<Appointment[]> {
  const db = await getDB();
  const rows = await db.getAllAsync<any>(`
    SELECT a.*,
           u_client.name as client_name,
           s.name as service_name,
           s.price as service_price
    FROM appointments a
    LEFT JOIN users u_client ON a.client_id = u_client.id
    LEFT JOIN services s ON a.service_id = s.id
    WHERE a.barber_id = ? AND a.date = ?
    ORDER BY a.start_time
  `, [barberId, date]);

  return rows.map(mapRow);
}

export async function getAvailableSlots(
  barberId: string, date: string, durationMinutes: number
): Promise<TimeSlot[]> {
  const db = await getDB();

  // Busca agendamentos e bloqueios do dia
  const booked = await db.getAllAsync<any>(
    `SELECT start_time, end_time FROM appointments
     WHERE barber_id = ? AND date = ? AND status NOT IN ('CANCELADO')`,
    [barberId, date]
  );
  const blocked = await db.getAllAsync<any>(
    `SELECT start_time, end_time FROM blocked_slots WHERE barber_id = ? AND date = ?`,
    [barberId, date]
  );

  const slots: TimeSlot[] = [];
  let cursor = '08:00';
  const endOfDay = '19:00';

  while (cursor < endOfDay) {
    const [h, m] = cursor.split(':').map(Number);
    const slotEnd = format(addMinutes(new Date(2000, 0, 1, h, m), durationMinutes), 'HH:mm');
    if (slotEnd > endOfDay) break;

    const isBooked = [...booked, ...blocked].some(
      r => cursor < r.end_time && slotEnd > r.start_time
    );

    slots.push({ time: cursor, available: !isBooked });

    const [hh, mm] = cursor.split(':').map(Number);
    cursor = format(addMinutes(new Date(2000, 0, 1, hh, mm), 30), 'HH:mm');
  }

  return slots;
}

export async function createAppointment(data: {
  clientId: string;
  barberId: string;
  serviceId: string;
  barbershopId: string;
  date: string;
  startTime: string;
  durationMinutes: number;
}): Promise<Appointment> {
  const db = await getDB();
  const [h, m] = data.startTime.split(':').map(Number);
  const endTime = format(addMinutes(new Date(2000, 0, 1, h, m), data.durationMinutes), 'HH:mm');
  const id = generateId();

  await db.runAsync(`
    INSERT INTO appointments
      (id, client_id, barber_id, service_id, barbershop_id, date, start_time, end_time, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'CONFIRMADO')
  `, [id, data.clientId, data.barberId, data.serviceId, data.barbershopId, data.date, data.startTime, endTime]);

  // Notifica o cliente
  await createNotification({
    userId: data.clientId,
    title: '✅ Agendamento confirmado',
    body: `Seu horário às ${data.startTime} do dia ${data.date} está confirmado!`,
    type: 'CONFIRMACAO',
    relatedAppointmentId: id,
  });

  const created = await db.getFirstAsync<any>(`SELECT * FROM appointments WHERE id = ?`, [id]);
  return mapRow(created);
}

export async function updateAppointmentStatus(
  id: string, status: AppointmentStatus
): Promise<void> {
  const db = await getDB();
  await db.runAsync(
    `UPDATE appointments SET status = ? WHERE id = ?`,
    [status, id]
  );
}

export async function createNotification(data: {
  userId: string;
  title: string;
  body: string;
  type: string;
  relatedAppointmentId?: string;
}) {
  const db = await getDB();
  const id = 'notif_' + Date.now();
  await db.runAsync(`
    INSERT INTO notifications (id, user_id, title, body, type, related_appointment_id)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [id, data.userId, data.title, data.body, data.type, data.relatedAppointmentId ?? null]);
}

function mapRow(r: any): Appointment {
  return {
    id: r.id,
    clientId: r.client_id,
    barberId: r.barber_id,
    serviceId: r.service_id,
    barbershopId: r.barbershop_id,
    date: r.date,
    startTime: r.start_time,
    endTime: r.end_time,
    status: r.status,
    notes: r.notes,
    createdAt: r.created_at,
    clientName: r.client_name,
    barberName: r.barber_name,
    serviceName: r.service_name,
    servicePrice: r.service_price,
  };
}