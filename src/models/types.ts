// src/models/types.ts

export type UserRole = 'CLIENTE' | 'BARBEIRO' | 'DONO' | 'ADMIN';

export type AppointmentStatus =
  | 'PENDENTE'
  | 'CONFIRMADO'
  | 'CONCLUIDO'
  | 'CANCELADO'
  | 'FALTA';

export interface User {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  barbershopId?: string;
}

export interface Barbershop {
  id: string;
  name: string;
  address: string;
  phone: string;
  openTime: string;   // "08:00"
  closeTime: string;  // "19:00"
  workDays: number[]; // [1,2,3,4,5,6] = seg-sab
  createdAt: string;
}

export interface Service {
  id: string;
  barbershopId: string;
  barberId?: string;
  name: string;
  description?: string;
  price: number;
  durationMinutes: number;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  clientId: string;
  barberId: string;
  serviceId: string;
  barbershopId: string;
  date: string;        // "2024-12-20"
  startTime: string;   // "14:00"
  endTime: string;     // "14:30"
  status: AppointmentStatus;
  notes?: string;
  createdAt: string;
  // Joined fields
  clientName?: string;
  barberName?: string;
  serviceName?: string;
  servicePrice?: number;
}

export interface BlockedSlot {
  id: string;
  barberId: string;
  date: string;
  startTime: string;
  endTime: string;
  reason?: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  body: string;
  type: 'CONFIRMACAO' | 'LEMBRETE' | 'CANCELAMENTO' | 'SISTEMA';
  isRead: boolean;
  relatedAppointmentId?: string;
  createdAt: string;
}

export interface Rating {
  id: string;
  appointmentId: string;
  clientId: string;
  barberId: string;
  score: number; // 1-5
  comment?: string;
  createdAt: string;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}

export interface BarberMetrics {
  totalAppointments: number;
  completedToday: number;
  canceledToday: number;
  estimatedRevenue: number;
  rating: number;
}