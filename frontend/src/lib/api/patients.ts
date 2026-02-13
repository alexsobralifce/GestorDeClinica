import apiClient from './client';

export interface Patient {
  id: string;
  name: string;
  cpf?: string;
  birth_date?: string;
  gender?: string;
  phone?: string;
  email?: string;
  address?: string;
  allergies?: string[];
  medical_conditions?: string[];
  emergency_contact_name?: string;
  emergency_contact_phone?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export const patientsApi = {
  getAll: async (): Promise<Patient[]> => {
    const response = await apiClient.get('/patients');
    return response.data;
  },

  getById: async (id: string): Promise<Patient> => {
    const response = await apiClient.get(`/patients/${id}`);
    return response.data;
  },

  create: async (patient: Omit<Patient, 'id' | 'created_at' | 'updated_at'>): Promise<Patient> => {
    const response = await apiClient.post('/patients', patient);
    return response.data;
  },

  update: async (id: string, patient: Partial<Patient>): Promise<Patient> => {
    const response = await apiClient.put(`/patients/${id}`, patient);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/patients/${id}`);
  },
};
