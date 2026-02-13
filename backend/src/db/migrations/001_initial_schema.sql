-- Sistema de Gestão Clínica - Database Schema
-- Version: 1.0.0
-- PostgreSQL 16+

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- PATIENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) UNIQUE,
    birth_date DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    allergies TEXT[],
    medical_conditions TEXT[],
    emergency_contact_name VARCHAR(255),
    emergency_contact_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_patients_name ON patients(name);
CREATE INDEX idx_patients_cpf ON patients(cpf);

-- ============================================================================
-- PROFESSIONALS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS professionals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(100) NOT NULL,
    registration_number VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(255),
    schedule JSONB,
    color VARCHAR(7) DEFAULT '#4a7c65',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_professionals_specialty ON professionals(specialty);
CREATE INDEX idx_professionals_active ON professionals(active);

-- ============================================================================
-- CATEGORIES TABLE (for financial transactions)
-- ============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    color VARCHAR(7) DEFAULT '#4a7c65',
    icon VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_categories_type ON categories(type);

-- ============================================================================
-- APPOINTMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    appointment_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration INTEGER NOT NULL, -- in minutes
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'confirmed', 'completed', 'cancelled', 'no_show')),
    specialty VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_professional ON appointments(professional_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- ============================================================================
-- MEDICAL RECORDS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS medical_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    professional_id UUID NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    record_date DATE NOT NULL DEFAULT CURRENT_DATE,
    specialty VARCHAR(100),
    chief_complaint TEXT,
    diagnosis TEXT,
    treatment TEXT,
    prescription TEXT,
    notes TEXT,
    attachments JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_medical_records_patient ON medical_records(patient_id);
CREATE INDEX idx_medical_records_professional ON medical_records(professional_id);
CREATE INDEX idx_medical_records_date ON medical_records(record_date);

-- ============================================================================
-- FINANCIAL TRANSACTIONS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS financial_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('income', 'expense')),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    description TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    due_date DATE,
    payment_date DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')),
    payment_method VARCHAR(50),
    patient_id UUID REFERENCES patients(id) ON DELETE SET NULL,
    professional_id UUID REFERENCES professionals(id) ON DELETE SET NULL,
    appointment_id UUID REFERENCES appointments(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_financial_type ON financial_transactions(type);
CREATE INDEX idx_financial_status ON financial_transactions(status);
CREATE INDEX idx_financial_date ON financial_transactions(transaction_date);
CREATE INDEX idx_financial_patient ON financial_transactions(patient_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON patients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professionals_updated_at BEFORE UPDATE ON professionals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_medical_records_updated_at BEFORE UPDATE ON medical_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_financial_transactions_updated_at BEFORE UPDATE ON financial_transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
