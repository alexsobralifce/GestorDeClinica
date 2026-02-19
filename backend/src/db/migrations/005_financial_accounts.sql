-- Migration 005: Financial Accounts (Contas a Pagar / Contas a Receber)
-- Sistema de Gestão Clínica

-- ============================================================================
-- ACCOUNTS PAYABLE (Contas a Pagar)
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounts_payable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    financial_transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
    creditor_name VARCHAR(200) NOT NULL,
    creditor_document VARCHAR(30),
    creditor_type VARCHAR(30) DEFAULT 'supplier' CHECK (creditor_type IN ('supplier', 'professional', 'government', 'other')),
    creditor_bank_data JSONB, -- { bank, agency, account, pix }
    original_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    fine DECIMAL(12, 2) DEFAULT 0,
    interest DECIMAL(12, 2) DEFAULT 0,
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_method VARCHAR(50),
    payment_proof TEXT, -- URL of uploaded proof
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'scheduled', 'paid', 'cancelled', 'renegotiated')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    is_recurring BOOLEAN DEFAULT FALSE,
    frequency VARCHAR(20) CHECK (frequency IN ('monthly', 'quarterly', 'yearly')),
    notes TEXT,
    tags TEXT[],
    requires_approval BOOLEAN DEFAULT FALSE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_payable_status ON accounts_payable(status);
CREATE INDEX idx_accounts_payable_due_date ON accounts_payable(due_date);
CREATE INDEX idx_accounts_payable_category ON accounts_payable(category_id);

-- ============================================================================
-- ACCOUNTS RECEIVABLE (Contas a Receber)
-- ============================================================================
CREATE TABLE IF NOT EXISTS accounts_receivable (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    financial_transaction_id UUID REFERENCES financial_transactions(id) ON DELETE SET NULL,
    debtor_type VARCHAR(20) NOT NULL DEFAULT 'patient' CHECK (debtor_type IN ('patient', 'convenio', 'other')),
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    debtor_name VARCHAR(200) NOT NULL,
    debtor_document VARCHAR(30),
    debtor_email VARCHAR(200),
    debtor_phone VARCHAR(30),
    original_amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    discount DECIMAL(12, 2) DEFAULT 0,
    interest_rate DECIMAL(5, 4) DEFAULT 0.02, -- 2% per month default
    interest_amount DECIMAL(12, 2) DEFAULT 0,
    due_date DATE NOT NULL,
    payment_date DATE,
    payment_method VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'cancelled', 'protested')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    installment_number INT,
    total_installments INT,
    parent_id UUID REFERENCES accounts_receivable(id) ON DELETE SET NULL, -- for installments
    collection_attempts JSONB DEFAULT '[]'::jsonb, -- [{ date, channel, status, message }]
    next_collection_date DATE,
    notes TEXT,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_accounts_receivable_status ON accounts_receivable(status);
CREATE INDEX idx_accounts_receivable_due_date ON accounts_receivable(due_date);
CREATE INDEX idx_accounts_receivable_patient ON accounts_receivable(patient_id);
CREATE INDEX idx_accounts_receivable_debtor_type ON accounts_receivable(debtor_type);

-- Trigger para updated_at em accounts_payable
CREATE TRIGGER update_accounts_payable_updated_at
    BEFORE UPDATE ON accounts_payable
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger para updated_at em accounts_receivable
CREATE TRIGGER update_accounts_receivable_updated_at
    BEFORE UPDATE ON accounts_receivable
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED: Default categories se não existirem
-- ============================================================================
INSERT INTO categories (name, type, color, icon) VALUES
  ('Consultas', 'income', '#4a7c65', 'Stethoscope'),
  ('Fisioterapia', 'income', '#5a8c75', 'Activity'),
  ('Procedimentos', 'income', '#6a9c85', 'Scissors'),
  ('Convênios', 'income', '#7aac95', 'Building2'),
  ('Outros (Receita)', 'income', '#8abca5', 'DollarSign'),
  ('Aluguel', 'expense', '#e85d3f', 'Home'),
  ('Material Clínico', 'expense', '#f06d4f', 'Package'),
  ('Salários', 'expense', '#f87d5f', 'Users'),
  ('Tecnologia', 'expense', '#ff8d6f', 'Monitor'),
  ('Energia/Água', 'expense', '#ff9d7f', 'Zap'),
  ('Impostos', 'expense', '#d54426', 'FileText'),
  ('Outros (Despesa)', 'expense', '#c03210', 'Minus')
ON CONFLICT DO NOTHING;
