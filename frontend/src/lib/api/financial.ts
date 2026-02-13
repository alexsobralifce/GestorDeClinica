import apiClient from './client';

export interface FinancialTransaction {
  id: string;
  type: 'income' | 'expense';
  category_id?: string;
  description: string;
  amount: number;
  transaction_date: string;
  due_date?: string;
  payment_date?: string;
  status: 'pending' | 'paid' | 'overdue' | 'cancelled';
  payment_method?: string;
  patient_id?: string;
  professional_id?: string;
  appointment_id?: string;
  notes?: string;
  category_name?: string;
  category_color?: string;
  patient_name?: string;
  professional_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface FinancialFilters {
  type?: 'income' | 'expense';
  status?: string;
  start_date?: string;
  end_date?: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  pending_income: number;
  pending_expenses: number;
  income_count: number;
  expense_count: number;
}

export const financialApi = {
  getAll: async (filters?: FinancialFilters): Promise<FinancialTransaction[]> => {
    const response = await apiClient.get('/financial', { params: filters });
    return response.data;
  },

  getSummary: async (filters?: { start_date?: string; end_date?: string }): Promise<FinancialSummary> => {
    const response = await apiClient.get('/financial/summary', { params: filters });
    return response.data;
  },

  getById: async (id: string): Promise<FinancialTransaction> => {
    const response = await apiClient.get(`/financial/${id}`);
    return response.data;
  },

  create: async (transaction: Omit<FinancialTransaction, 'id' | 'created_at' | 'updated_at' | 'category_name' | 'category_color' | 'patient_name' | 'professional_name'>): Promise<FinancialTransaction> => {
    const response = await apiClient.post('/financial', transaction);
    return response.data;
  },

  update: async (id: string, transaction: Partial<FinancialTransaction>): Promise<FinancialTransaction> => {
    const response = await apiClient.put(`/financial/${id}`, transaction);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/financial/${id}`);
  },
};
