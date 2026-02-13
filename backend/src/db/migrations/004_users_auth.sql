-- ============================================================================
-- USERS TABLE (Authentication & Authorization)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER' CHECK (role IN ('ADMIN', 'USER')),
    modules TEXT[] NOT NULL DEFAULT '{}',
    active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_active ON users(active);

-- Trigger for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- SEED: Default admin user (password: admin123)
-- Hash generated with bcrypt (10 rounds)
-- ============================================================================
INSERT INTO users (name, email, password_hash, role, modules, active)
VALUES (
    'Administrador',
    'admin@clinica.com',
    '$2b$10$CT1FP.nSWGm5RBDLPdagxOgBU/iffwtJwLdPBXQ1zmZvXbU3Qg.Di',
    'ADMIN',
    ARRAY['dashboard', 'agenda', 'pacientes', 'prontuario', 'financeiro', 'bi', 'admin'],
    true
)
ON CONFLICT (email) DO NOTHING;
