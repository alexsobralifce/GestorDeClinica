import apiClient from './client';

export interface AccountPayable {
  id: string;
  financial_transaction_id?: string;
  creditor_name: string;
  creditor_document?: string;
  creditor_type: 'supplier' | 'professional' | 'government' | 'other';
  original_amount: number;
  paid_amount: number;
  discount: number;
  fine: number;
  interest: number;
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  payment_proof?: string;
  status: 'pending' | 'scheduled' | 'paid' | 'cancelled' | 'renegotiated';
  category_id?: string;
  category_name?: string;
  category_color?: string;
  is_recurring: boolean;
  frequency?: 'monthly' | 'quarterly' | 'yearly';
  notes?: string;
  tags?: string[];
  requires_approval: boolean;
  created_at: string;
}

export interface AccountReceivable {
  id: string;
  financial_transaction_id?: string;
  debtor_type: 'patient' | 'convenio' | 'other';
  patient_id?: string;
  debtor_name: string;
  debtor_document?: string;
  debtor_email?: string;
  debtor_phone?: string;
  original_amount: number;
  paid_amount: number;
  discount: number;
  interest_rate: number;
  interest_amount: number;
  due_date: string;
  payment_date?: string;
  payment_method?: string;
  status: 'pending' | 'partial' | 'paid' | 'cancelled' | 'protested';
  category_id?: string;
  category_name?: string;
  category_color?: string;
  appointment_id?: string;
  installment_number?: number;
  total_installments?: number;
  days_overdue: number;
  notes?: string;
  created_at: string;
}

export interface AccountsDashboard {
  total_open: number;
  total_overdue: number;
  due_today: number;
  due_next_7_days: number;
  pending_count: number;
  overdue_count: number;
  default_rate?: number;
}

export interface PaymentData {
  paid_amount?: number;
  payment_method: string;
  payment_date?: string;
  payment_proof?: string;
}

export const accountsApi = {
  // Contas a Pagar
  getPayable: async (filters?: { status?: string; start_date?: string; end_date?: string; category_id?: string }): Promise<AccountPayable[]> => {
    const response = await apiClient.get('/accounts/payable', { params: filters });
    return response.data;
  },
  getPayableDashboard: async (): Promise<AccountsDashboard> => {
    const response = await apiClient.get('/accounts/payable/dashboard');
    return response.data;
  },
  createPayable: async (data: Omit<AccountPayable, 'id' | 'paid_amount' | 'discount' | 'fine' | 'interest' | 'status' | 'category_name' | 'category_color' | 'created_at'>): Promise<AccountPayable> => {
    const response = await apiClient.post('/accounts/payable', data);
    return response.data;
  },
  payAccount: async (id: string, data: PaymentData): Promise<AccountPayable> => {
    const response = await apiClient.patch(`/accounts/payable/${id}/pay`, data);
    return response.data;
  },
  cancelPayable: async (id: string): Promise<void> => {
    await apiClient.delete(`/accounts/payable/${id}`);
  },

  // Contas a Receber
  getReceivable: async (filters?: { status?: string; debtor_type?: string; start_date?: string; end_date?: string }): Promise<AccountReceivable[]> => {
    const response = await apiClient.get('/accounts/receivable', { params: filters });
    return response.data;
  },
  getReceivableDashboard: async (): Promise<AccountsDashboard> => {
    const response = await apiClient.get('/accounts/receivable/dashboard');
    return response.data;
  },
  createReceivable: async (data: Omit<AccountReceivable, 'id' | 'paid_amount' | 'discount' | 'interest_amount' | 'status' | 'days_overdue' | 'category_name' | 'category_color' | 'created_at'>): Promise<AccountReceivable> => {
    const response = await apiClient.post('/accounts/receivable', data);
    return response.data;
  },
  receivePayment: async (id: string, data: Omit<PaymentData, 'payment_proof'>): Promise<AccountReceivable> => {
    const response = await apiClient.patch(`/accounts/receivable/${id}/receive`, data);
    return response.data;
  },
};
