# Especificação Técnica: Módulo Prontuário Eletrônico Compartilhado (PEC)

## 1. Visão Geral
Este documento especifica a implementação técnica do módulo de Prontuário Eletrônico Compartilhado para o sistema de gestão clínica. O módulo foca em conformidade legal (CFM/LGPD), segurança granular e uma experiência de timeline integrada.

**Premissas:**
- **Stack:** Node.js (Hono), PostgreSQL, React (Frontend).
- **Compliance:** Resolução CFM 1.821/2007 (Nível de Garantia de Segurança 2), LGPD.

---

## 2. Modelo de Dados (PostgreSQL)

O modelo de dados adota uma abordagem híbrida de tabelas relacionais para entidades core e uma estrutura flexível (JSONB) para o payload de eventos clínicos, permitindo evolução do esquema sem migrations constantes (pattern *Event Sourcing* simplificado para a timeline).

### 2.1. Tabelas Core

```sql
-- Pacientes (Já existente, referência)
CREATE TABLE patients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    cpf TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profissionais (Já existente, referência)
CREATE TABLE professionals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    specialty TEXT,
    crm TEXT, -- ou outro registro de classe
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Atendimentos (Encounters) - Agrupa eventos de uma sessão
CREATE TABLE encounters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    professional_id UUID NOT NULL REFERENCES professionals(id),
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL, -- 'scheduled', 'in_progress', 'completed', 'canceled'
    type TEXT NOT NULL, -- 'consultation', 'exam', 'procedure'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Timeline de Eventos (EHR Events) - Tabela central
CREATE TABLE ehr_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    encounter_id UUID REFERENCES encounters(id), -- Opcional, pois pode ser um evento isolado (ex: anexo avulso)
    professional_id UUID NOT NULL REFERENCES professionals(id),
    event_type TEXT NOT NULL, -- 'anamnesis', 'evolution', 'prescription', 'exam_result', 'voice_transcription', 'document_signed'
    payload JSONB NOT NULL, -- Conteúdo clínico estruturado (ex: campos da anamnese, texto da evolução)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(), -- Data da última versão
    is_deleted BOOLEAN DEFAULT FALSE, -- Soft delete (apenas para correção, mantendo histórico)
    current_version INT DEFAULT 1
);

-- Versionamento de Eventos (Imutabilidade)
CREATE TABLE ehr_event_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES ehr_events(id),
    version INT NOT NULL,
    payload JSONB NOT NULL,
    created_by UUID NOT NULL REFERENCES professionals(id), -- Quem fez esta versão
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reason_for_change TEXT -- Obrigatório se for edição
);

-- Compartilhamento de Prontuário (Shares)
CREATE TABLE ehr_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_id UUID NOT NULL REFERENCES patients(id),
    granted_by UUID NOT NULL REFERENCES professionals(id), -- Quem concedeu (geralmente médico assistente ou coord.)
    granted_to UUID NOT NULL REFERENCES professionals(id), -- Quem recebe acesso
    scope TEXT[] NOT NULL, -- ['read', 'write_evolution', 'read_attachments']
    valid_until TIMESTAMP WITH TIME ZONE, -- Expiração
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE -- Se revogado antes do prazo
);

-- Anexos e Arquivos
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    storage_path TEXT NOT NULL, -- S3 key ou path local
    filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    size_bytes BIGINT NOT NULL,
    hash_sha256 TEXT NOT NULL, -- Integridade
    uploaded_by UUID NOT NULL REFERENCES professionals(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB -- Tags, OCR result, DICOM metadata
);

-- Vínculo Arquivo <-> Evento/Paciente
CREATE TABLE file_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    file_id UUID NOT NULL REFERENCES files(id),
    event_id UUID REFERENCES ehr_events(id),
    patient_id UUID REFERENCES patients(id), -- Para busca rápida por paciente
    context TEXT -- 'exam_result', 'profile_photo', 'document_scan'
);

-- Templates de Anamnese
CREATE TABLE anamnesis_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    specialties TEXT[] NOT NULL, -- Array de especialidades que usam este template
    structure_schema JSONB NOT NULL, -- Definição dos campos (form builder)
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Prescrições e Medicamentos
CREATE TABLE prescriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES ehr_events(id),
    medications JSONB NOT NULL, -- Lista de medicamentos, posologia, via
    signed_document_id UUID, -- Referência se foi gerado PDF assinado
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Alertas Clínicos (Ocorrências)
CREATE TABLE alert_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID NOT NULL REFERENCES ehr_events(id), -- Contexto (prescription)
    professional_id UUID NOT NULL REFERENCES professionals(id),
    alert_type TEXT NOT NULL, -- 'allergy', 'interaction', 'duplicity'
    severity TEXT NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    action_taken TEXT NOT NULL, -- 'accepted', 'ignored', 'changed_prescription'
    justification TEXT, -- Obrigatório se ignorado/alto risco
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Documentos e Assinaturas Digitais
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES ehr_events(id),
    content_html TEXT, -- Conteúdo original antes de gerar PDF
    pdf_file_id UUID REFERENCES files(id), -- Versão final (draft ou assinado)
    status TEXT NOT NULL, -- 'draft', 'pending_signature', 'signed', 'voided'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE document_signatures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id),
    signer_id UUID NOT NULL REFERENCES professionals(id), -- Ou null se PF/certificado externo (futuro)
    signature_data TEXT NOT NULL, -- Base64 da assinatura (PKCS#7 / CMS)
    timestamp_token TEXT, -- Carimbo de tempo
    certificate_info JSONB, -- Dados do certificado usado (Emissor, Serial, Validade)
    signed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Auditoria (Audit Logs) - Tabela High-Volume
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_id UUID NOT NULL, -- User ID
    patient_id UUID, -- Se a ação envolve um paciente específico
    resource_type TEXT NOT NULL, -- 'ehr_event', 'file', 'prescription'
    resource_id UUID,
    action TEXT NOT NULL, -- 'view', 'create', 'update', 'delete', 'print', 'sign'
    details JSONB, -- Diff, IP, User-Agent
    performed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 3. Regras de Acesso e Segurança (Lógica de Negócio)

A segurança é baseada em camadas: autenticação prévia (JWT) e autorização contextual (ABAC) verificada em **cada request**.

### Pseudo-código das Políticas

```typescript
// Verifica se o usuário pode visualizar a timeline do paciente
function canViewEHR(user: User, patientId: string): boolean {
    if (user.role === 'ADMIN') return true; // Auditoria deve registrar motivo
    if (user.role === 'PATIENT' && user.id === patientId) return true;

    if (user.role === 'PROFESSIONAL') {
        // 1. Vínculo direto por atendimento (histórico ou agendado futuro próximo)
        const hasEncounter = db.exists(
            "SELECT 1 FROM encounters WHERE professional_id = ? AND patient_id = ?", 
            user.id, patientId
        );
        if (hasEncounter) return true;

        // 2. Compartilhamento explícito ativo
        const hasShare = db.exists(
            "SELECT 1 FROM ehr_shares WHERE granted_to = ? AND patient_id = ? AND now() < valid_until",
            user.id, patientId
        );
        if (hasShare) return true;
    }

    if (user.role === 'RECEPTION' || user.role === 'FINANCIAL') {
        // Acesso restrito: apenas dados cadastrais e financeiros, NÃO clínicos
        // (Isso deve ser filtrado no endpoint, não apenas booleano)
        return false; // Para endpoints de dados clínicos
    }

    return false;
}

// Verifica se pode criar/editar eventos na timeline
function canEditEHR(user: User, patientId: string, eventType: string): boolean {
    if (user.role !== 'PROFESSIONAL') return false;

    // Apenas profissionais ativos podem editar
    
    // Verifica share com permissão de escrita
    const share = db.query(
        "SELECT scope FROM ehr_shares WHERE granted_to = ? AND patient_id = ? AND now() < valid_until",
        user.id, patientId
    );
    
    if (share && share.scope.includes('write')) return true;

    // Se é o profissional do atendimento ATUAL (em andamento)
    const currentEncounter = db.exists(
        "SELECT 1 FROM encounters WHERE professional_id = ? AND patient_id = ? AND status = 'in_progress'",
        user.id, patientId
    );
    
    return currentEncounter;
}
```

---

## 4. Endpoints REST (API Specification)

Prefix: `/api/v1`

| Método | Rota | Descrição | Exemplo JSON (Body/Response) |
|---|---|---|---|
| **Timeline** | | | |
| `GET` | `/patients/:id/ehr/timeline` | Lista eventos (paginado). Query params: `from`, `to`, `type`, `prof_id` | `[{ "id": "...", "type": "evolution", "preview": "Paciente relata..." }]` |
| `POST` | `/patients/:id/ehr/events` | Cria novo evento (Evolução, Anamnese) | `{ "type": "anamnesis", "encounter_id": "...", "payload": { ... } }` |
| `GET` | `/ehr/events/:eventId` | Detalhe de um evento | `{ "id": "...", "payload": {...}, "history": [...] }` |
| `PUT` | `/ehr/events/:eventId` | Atualiza evento (Gera nova versão) | `{ "payload": { ... }, "reason": "Correção de erro digitação" }` |
| **Voz (IA)** | | | |
| `POST` | `/ehr/voice/transcriptions` | Upload audio p/ transcrição | `multipart/form-data` (file: audio.wav) -> `{ "jobId": "123" }` |
| `GET` | `/ehr/voice/transcriptions/:jobId` | Status da transcrição | `{ "status": "completed", "text": "Paciente refere dor..." }` |
| **Arquivos** | | | |
| `POST` | `/files/presigned-url` | Get URL segura p/ upload direto (S3) | `{ "filename": "raio-x.jpg", "mime": "image/jpeg" }` |
| `POST` | `/files` | Registra metadados após upload | `{ "path": "/s3/buckets...", "context": "exam" }` |
| **Compartilhamento** | | | |
| `POST` | `/patients/:id/ehr/shares` | Compartilha prontuário | `{ "granted_to": "uuid-medico-2", "valid_hours": 24, "scope": ["read"] }` |
| `DELETE` | `/ehr/shares/:shareId` | Revoga acesso | - |
| **Documentos** | | | |
| `POST` | `/documents` | Gera rascunho de documento | `{ "template_id": "...", "data": {...} }` |
| `POST` | `/documents/:id/sign` | Assina documento (Internal/ICP) | `{ "certificate_token": "..." }` -> `{ "signed_url": "..." }` |
| **Prescrições** | | | |
| `POST` | `/prescriptions` | Valida interações e salva | `{ "medications": [...] }` -> Retorna alertas se houver. |

---

## 5. Fluxos de UI e Experiência do Usuário

### 5.1. Fluxo de Evolução por Voz
1.  **Botão "Nova Evolução (Voz)"**: Abre modal/drawer flutuante.
2.  **Gravação**: Visualizador de onda sonora, botão REC/PAUSE/STOP. Timer visível.
3.  **Processamento**: Ao dar STOP, upload automático em background. Status "Transcrevendo...".
4.  **Revisão**: Texto transcrito aparece em editor rico.
    *   *Diff visual*: Se o usuário editar a transcrição, destacar mudanças.
    *   *Player*: Pode ouvir trechos clicando na palavra (se timestamp support).
5.  **Salvar**: Salva como evento de timeline tipo `voice_evolution`. Armazena áudio e texto.

### 5.2. Fluxo de Assinatura de Documento
1.  **Redação**: Profissional preenche atestado/receita.
2.  **Preview**: Botão "Visualizar Impressão" (Gera PDF em memória).
3.  **Assinar**:
    *   Opção Checkbox: "Assinar digitalmente (ICP-Brasil)".
    *   Se marcado: Solicita senha do token A3 ou seleciona certificado A1 instalado no browser/cloud.
    *   Feedback: "Assinando..." e validação de revogação (OCSP/CRL).
4.  **Conclusão**: Documento muda status para `signed`. Ícone de cadeado verde.
    *   **Imutável**: Botão "Editar" desaparece. Botão "Retificar" aparece (gera novo doc referenciando o antigo).

---

## 6. Critérios de Aceite (DoD)

1.  **Auditoria**: Qualquer `GET` em `/ehr/timeline` ou detalhe de evento DEVE gerar um registro em `audit_logs` com `action='view'`.
2.  **Imutabilidade**: Tentativa de `UPDATE` direto na tabela `ehr_events` (via SQL injection ou bug) sem criar linha em `ehr_event_versions` deve ser bloqueada (preferencialmente por trigger DB ou controller rígido).
3.  **Segurança de Arquivos**: URLs de arquivos (anexos) NÃO devem ser públicas. Devem ser Signed URLs com expiração máxima de 15 minutos.
4.  **Controle de Acesso**: Profissional A não consegue ver prontuário de Paciente B se não houver atendimento ou share explícito (Teste de integração deve falhar com 403 Forbidden).
5.  **Offline (Voz)**: Se a internet cair durante o upload do áudio, a UI deve salvar o blob no IndexedDB local e permitir retry quando voltar online.

---

## 7. Plano de Testes (QA & Validação)

Para garantir que a implementação atenda aos requisitos de segurança e negócio, os seguintes testes automatizados e manuais devem ser executados:

### 7.1. Testes Automatizados (Backend)
Criar uma suíte de testes de integração (`projects/backend/tests/ehr_integration.test.ts`) cobrindo:

1.  **Cenário: Isolamento de Dados (Tenant/Patient)**
    *   *Setup*: Criar Medico A, Medico B, Paciente P (vinculado apenas a A).
    *   *Ação*: Medico B tenta acessar `GET /patients/P/ehr/timeline`.
    *   *Resultado Esperado*: Status `403 Forbidden`. Audit Log registra tentativa negada.

2.  **Cenário: Imutabilidade do Prontuário**
    *   *Setup*: Criar um evento de evolução para Paciente P.
    *   *Ação*: Disparar `PUT /ehr/events/:id` com novo payload.
    *   *Resultado Esperado*:
        *   Status `200 OK`.
        *   Tabela `ehr_events` atualizada com versão incremental.
        *   Tabela `ehr_event_versions` contém a versão original inalterada.

3.  **Cenário: Assinatura Digital**
    *   *Ação*: Finalizar documento sem assinatura válida.
    *   *Resultado Esperado*: Documento permanece como `draft` ou `pending`.
    *   *Ação*: Enviar payload assinado (mock válido).
    *   *Resultado Esperado*: Documento transita para `signed` e se torna somente leitura.

### 7.2. Teste de Carga (Stress Test)
*   **Simulação**: 50 usuários simultâneos gravando evoluções de voz.
*   **Métrica**: O endpoint de upload de áudio deve responder em < 200ms (antes do processamento assíncrono).

### 7.3. Validação de Segurança (Pentest Básico)
*   Tentar acessar anexo direto pela URL do S3 sem passar pela API (Deve falhar: Access Denied).
*   Tentar acessar anexo com Presigned URL expirada (Deve falhar).


