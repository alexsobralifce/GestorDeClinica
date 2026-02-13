import apiClient from './client';

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  registration_number?: string;
  phone?: string;
  email?: string;
  schedule?: any;
  color?: string;
  active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export const professionalsApi = {
  getAll: async (): Promise<Professional[]> => {
    const response = await apiClient.get('/professionals');
    return response.data;
  },

  getById: async (id: string): Promise<Professional> => {
    const response = await apiClient.get(`/professionals/${id}`);
    return response.data;
  },

  create: async (professional: Omit<Professional, 'id' | 'created_at' | 'updated_at'>): Promise<Professional> => {
    const response = await apiClient.post('/professionals', professional);
    return response.data;
  },

  update: async (id: string, professional: Partial<Professional>): Promise<Professional> => {
    const response = await apiClient.put(`/professionals/${id}`, professional);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/professionals/${id}`);
  },
};
