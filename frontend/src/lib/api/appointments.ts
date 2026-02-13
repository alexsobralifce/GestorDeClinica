import apiClient from './client';

export interface Appointment {
  id: string;
  patient_id: string;
  professional_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration: number;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  specialty?: string;
  notes?: string;
  patient_name?: string;
  professional_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AppointmentFilters {
  date?: string;
  professional_id?: string;
  patient_id?: string;
  status?: string;
}

export const appointmentsApi = {
  getAll: async (filters?: AppointmentFilters): Promise<Appointment[]> => {
    const response = await apiClient.get('/appointments', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get(`/appointments/${id}`);
    return response.data;
  },

  create: async (appointment: Omit<Appointment, 'id' | 'created_at' | 'updated_at' | 'patient_name' | 'professional_name'>): Promise<Appointment> => {
    const response = await apiClient.post('/appointments', appointment);
    return response.data;
  },

  update: async (id: string, appointment: Partial<Appointment>): Promise<Appointment> => {
    const response = await apiClient.put(`/appointments/${id}`, appointment);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/appointments/${id}`);
  },
};
