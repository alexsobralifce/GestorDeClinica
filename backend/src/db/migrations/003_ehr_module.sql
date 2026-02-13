-- ============================================================================
-- EHR MODULE SCHEMA (PEC)
-- ============================================================================

-- ENCOUNTERS (Atendimentos)
CREATE TABLE IF NOT EXISTS encounters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    appointment_id UUID REFERENCES appointments(id), -- Optional link to schedule
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(50) NOT NULL, -- 'scheduled', 'in_progress', 'completed', 'canceled'
    type VARCHAR(50) NOT NULL, -- 'consultation', 'exam', 'procedure'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- TIMELINE EVENTS (EHR Events)
CREATE TABLE IF NOT EXISTS ehr_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    encounter_id UUID REFERENCES encounters(id),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    event_type VARCHAR(50) NOT NULL, -- 'anamnesis', 'evolution', 'prescription', etc.
    payload JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE,
    current_version INT DEFAULT 1
);

CREATE INDEX idx_ehr_events_patient ON ehr_events(patient_id);
CREATE INDEX idx_ehr_events_date ON ehr_events(created_at);

-- EVENT VERSIONING
CREATE TABLE IF NOT EXISTS ehr_event_versions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES ehr_events(id),
    version INT NOT NULL,
    payload JSONB NOT NULL,
    created_by UUID NOT NULL REFERENCES professionals(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason_for_change TEXT
);

-- SHARES (Compartilhamento)
CREATE TABLE IF NOT EXISTS ehr_shares (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    granted_by UUID NOT NULL REFERENCES professionals(id),
    granted_to UUID NOT NULL REFERENCES professionals(id),
    scope TEXT[] NOT NULL,
    valid_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_ehr_shares_patient ON ehr_shares(patient_id);
CREATE INDEX idx_ehr_shares_granted_to ON ehr_shares(granted_to);

-- FILES (Anexos)
CREATE TABLE IF NOT EXISTS files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path TEXT NOT NULL,
    filename TEXT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    size_bytes BIGINT NOT NULL,
    hash_sha256 TEXT NOT NULL,
    uploaded_by UUID NOT NULL REFERENCES professionals(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB
);

-- FILE LINKS
CREATE TABLE IF NOT EXISTS file_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    file_id UUID NOT NULL REFERENCES files(id),
    event_id UUID REFERENCES ehr_events(id),
    patient_id UUID REFERENCES patients(id),
    context VARCHAR(50) -- 'exam_result', 'profile_photo', 'document_scan'
);

-- ANAMNESIS TEMPLATES
CREATE TABLE IF NOT EXISTS anamnesis_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    specialties TEXT[] NOT NULL,
    structure_schema JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- PRESCRIPTIONS
CREATE TABLE IF NOT EXISTS prescriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES ehr_events(id),
    medications JSONB NOT NULL,
    signed_document_id UUID, -- Will reference documents(id) later
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ALERT EVENTS
CREATE TABLE IF NOT EXISTS alert_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID NOT NULL REFERENCES ehr_events(id),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    alert_type VARCHAR(50) NOT NULL,
    severity VARCHAR(20) NOT NULL,
    description TEXT NOT NULL,
    action_taken VARCHAR(50) NOT NULL,
    justification TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- DOCUMENTS & SIGNATURES
CREATE TABLE IF NOT EXISTS documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES ehr_events(id),
    content_html TEXT,
    pdf_file_id UUID REFERENCES files(id),
    status VARCHAR(50) NOT NULL, -- 'draft', 'pending_signature', 'signed', 'voided'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Now we can add the FK to prescriptions
ALTER TABLE prescriptions 
ADD CONSTRAINT fk_prescriptions_document 
FOREIGN KEY (signed_document_id) REFERENCES documents(id);

CREATE TABLE IF NOT EXISTS document_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id),
    signer_id UUID NOT NULL REFERENCES professionals(id),
    signature_data TEXT NOT NULL,
    timestamp_token TEXT,
    certificate_info JSONB,
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AUDIT LOGS
CREATE TABLE IF NOT EXISTS audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID NOT NULL,
    patient_id UUID,
    resource_type VARCHAR(50) NOT NULL,
    resource_id UUID,
    action VARCHAR(50) NOT NULL,
    details JSONB,
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_patient ON audit_logs(patient_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX idx_audit_logs_date ON audit_logs(performed_at);

