import apiClient from './client';

// --- Types ---

export interface EhrEvent {
  id: string;
  patient_id: string;
  encounter_id?: string;
  professional_id: string;
  event_type: string; // 'evolution', 'anamnesis', 'prescription', 'exam', 'consultation'
  payload: Record<string, any>;
  created_at: string;
  updated_at: string;
  current_version: number;
  professional_name?: string;
  professional_specialty?: string;
}

export interface TimelineFilters {
  from?: string;
  to?: string;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface CreateEventPayload {
  type: string;
  encounter_id?: string;
  payload: {
    title: string;
    content: string;
    specialty?: string;
    [key: string]: any;
  };
}

export interface DocumentDraft {
  id: string;
  status: string;
}

export interface Document {
  id: string;
  event_id?: string;
  content_html?: string;
  status: string;
  created_at: string;
  signed_at?: string;
  signer_id?: string;
}

// --- API Functions ---

export const ehrApi = {
  /**
   * Fetch patient's EHR timeline
   */
  getTimeline: async (patientId: string, filters?: TimelineFilters): Promise<EhrEvent[]> => {
    const params = new URLSearchParams();
    if (filters?.from) params.set('from', filters.from);
    if (filters?.to) params.set('to', filters.to);
    if (filters?.type) params.set('type', filters.type);
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.offset) params.set('offset', String(filters.offset));

    const response = await apiClient.get(`/patients/${patientId}/ehr/timeline?${params.toString()}`);
    return response.data;
  },

  /**
   * Create a new EHR event (evolution, anamnesis, etc.)
   */
  createEvent: async (patientId: string, event: CreateEventPayload): Promise<{ id: string; status: string }> => {
    const response = await apiClient.post(`/patients/${patientId}/ehr/events`, event);
    return response.data;
  },

  /**
   * Get a single EHR event by ID
   */
  getEvent: async (eventId: string): Promise<EhrEvent> => {
    const response = await apiClient.get(`/ehr/events/${eventId}`);
    return response.data;
  },

  /**
   * Create a document draft
   */
  createDocument: async (data: { event_id?: string; content_html: string }): Promise<DocumentDraft> => {
    const response = await apiClient.post('/documents', data);
    return response.data;
  },

  /**
   * Sign a document
   */
  signDocument: async (documentId: string): Promise<{ status: string; signature_id: string }> => {
    const response = await apiClient.post(`/documents/${documentId}/sign`, {});
    return response.data;
  },

  /**
   * Get a document
   */
  getDocument: async (documentId: string): Promise<Document> => {
    const response = await apiClient.get(`/documents/${documentId}`);
    return response.data;
  },

  /**
   * Submit audio for voice transcription
   */
  submitTranscription: async (): Promise<{ jobId: string; status: string }> => {
    const response = await apiClient.post('/ehr/voice/transcriptions', {});
    return response.data;
  },

  /**
   * Get transcription job status
   */
  getTranscription: async (jobId: string): Promise<{ id: string; status: string; text: string }> => {
    const response = await apiClient.get(`/ehr/voice/transcriptions/${jobId}`);
    return response.data;
  },
};
