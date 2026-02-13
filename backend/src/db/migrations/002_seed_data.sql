-- Seed data for Sistema de Gestão Clínica
-- Version: 1.0.0

-- ============================================================================
-- SEED CATEGORIES
-- ============================================================================
INSERT INTO categories (name, type, color, icon) VALUES
    -- Income categories
    ('Consulta', 'income', '#10b981', 'stethoscope'),
    ('Procedimento', 'income', '#3b82f6', 'activity'),
    ('Exame', 'income', '#8b5cf6', 'file-text'),
    ('Retorno', 'income', '#06b6d4', 'repeat'),
    
    -- Expense categories
    ('Aluguel', 'expense', '#ef4444', 'home'),
    ('Salários', 'expense', '#f59e0b', 'users'),
    ('Material', 'expense', '#ec4899', 'package'),
    ('Equipamento', 'expense', '#6366f1', 'tool'),
    ('Utilities', 'expense', '#14b8a6', 'zap'),
    ('Marketing', 'expense', '#f97316', 'megaphone')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED PROFESSIONALS
-- ============================================================================
INSERT INTO professionals (name, specialty, registration_number, phone, email, color, schedule) VALUES
    ('Dr. João Silva', 'Medicina', 'CRM 12345', '(11) 98765-4321', 'joao.silva@clinic.com', '#3b82f6', 
     '{"monday": {"start": "08:00", "end": "18:00"}, "tuesday": {"start": "08:00", "end": "18:00"}, "wednesday": {"start": "08:00", "end": "18:00"}, "thursday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "08:00", "end": "14:00"}}'::jsonb),
    
    ('Dra. Maria Santos', 'Fisioterapia', 'CREFITO 67890', '(11) 98765-1234', 'maria.santos@clinic.com', '#10b981',
     '{"monday": {"start": "09:00", "end": "17:00"}, "tuesday": {"start": "09:00", "end": "17:00"}, "wednesday": {"start": "09:00", "end": "17:00"}, "thursday": {"start": "09:00", "end": "17:00"}, "friday": {"start": "09:00", "end": "15:00"}}'::jsonb),
    
    ('Dr. Pedro Costa', 'Odontologia', 'CRO 11223', '(11) 98765-5678', 'pedro.costa@clinic.com', '#8b5cf6',
     '{"monday": {"start": "08:00", "end": "18:00"}, "wednesday": {"start": "08:00", "end": "18:00"}, "friday": {"start": "08:00", "end": "18:00"}}'::jsonb),
    
    ('Dra. Ana Oliveira', 'Psicologia', 'CRP 44556', '(11) 98765-9012', 'ana.oliveira@clinic.com', '#f59e0b',
     '{"tuesday": {"start": "10:00", "end": "19:00"}, "thursday": {"start": "10:00", "end": "19:00"}, "saturday": {"start": "09:00", "end": "13:00"}}'::jsonb),
    
    ('Dra. Carla Lima', 'Nutrição', 'CRN 78901', '(11) 98765-3456', 'carla.lima@clinic.com', '#84cc16',
     '{"monday": {"start": "08:00", "end": "17:00"}, "wednesday": {"start": "08:00", "end": "17:00"}, "friday": {"start": "08:00", "end": "17:00"}}'::jsonb)
ON CONFLICT DO NOTHING;

-- ============================================================================
-- SEED SAMPLE PATIENTS (for testing)
-- ============================================================================
INSERT INTO patients (name, cpf, birth_date, gender, phone, email, address, allergies, medical_conditions) VALUES
    ('Carlos Eduardo Souza', '123.456.789-00', '1985-03-15', 'Masculino', '(11) 91234-5678', 'carlos.souza@email.com', 
     'Rua das Flores, 123 - São Paulo, SP', ARRAY['Penicilina'], ARRAY['Hipertensão']),
    
    ('Juliana Ferreira', '987.654.321-00', '1990-07-22', 'Feminino', '(11) 92345-6789', 'juliana.ferreira@email.com',
     'Av. Paulista, 456 - São Paulo, SP', ARRAY[]::text[], ARRAY['Diabetes tipo 2']),
    
    ('Roberto Almeida', '456.789.123-00', '1978-11-30', 'Masculino', '(11) 93456-7890', 'roberto.almeida@email.com',
     'Rua Augusta, 789 - São Paulo, SP', ARRAY['Dipirona'], ARRAY[]::text[]),
    
    ('Fernanda Costa', '321.654.987-00', '1995-05-18', 'Feminino', '(11) 94567-8901', 'fernanda.costa@email.com',
     'Rua Consolação, 321 - São Paulo, SP', ARRAY[]::text[], ARRAY[]::text[]),
    
    ('Marcos Pereira', '789.123.456-00', '1982-09-25', 'Masculino', '(11) 95678-9012', 'marcos.pereira@email.com',
     'Av. Faria Lima, 654 - São Paulo, SP', ARRAY['Lactose'], ARRAY['Asma'])
ON CONFLICT DO NOTHING;
