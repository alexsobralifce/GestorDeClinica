/// <reference types="vite/client" />
import axios from 'axios';

// Public client for booking (no auth token needed)
const bookingClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface PublicProfessional {
  id: string;
  name: string;
  specialty: string;
  phone?: string;
}

export interface BookingPatient {
  id?: string;
  name: string;
  cpf: string;
  email: string;
  phone: string;
}

export const bookingApi = {
  getProfessionals: async (): Promise<PublicProfessional[]> => {
    const response = await bookingClient.get('/booking/professionals');
    return response.data;
  },

  getSlots: async (professionalId: string, date: string): Promise<string[]> => {
    const response = await bookingClient.get('/booking/slots', {
      params: { professional_id: professionalId, date }
    });
    return response.data;
  },

  registerPatient: async (patient: BookingPatient): Promise<{ id: string }> => {
    const response = await bookingClient.post('/booking/register', patient);
    return response.data;
  },

  createAppointment: async (data: {
    patient_id: string;
    professional_id: string;
    date: string;
    time: string;
  }): Promise<{ id: string }> => {
    const response = await bookingClient.post('/booking/appointment', data);
    return response.data;
  },
};
