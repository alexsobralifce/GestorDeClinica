# 📚 Documentação do Sistema de Gestão Clínica

Este documento fornece uma visão completa do sistema para orientar a resolução de problemas e facilitar o desenvolvimento de novas funcionalidades.

---

## 📋 Índice

1. [Visão Geral do Sistema](#visão-geral-do-sistema)
2. [Stack Tecnológica](#stack-tecnológica)
3. [Arquitetura do Projeto](#arquitetura-do-projeto)
4. [Banco de Dados](#banco-de-dados)
5. [API e Rotas](#api-e-rotas)
6. [Autenticação e Autorização](#autenticação-e-autorização)
7. [Módulos do Sistema](#módulos-do-sistema)
8. [Variáveis de Ambiente](#variáveis-de-ambiente)
9. [Guia de Troubleshooting](#guia-de-troubleshooting)
10. [Comandos Úteis](#comandos-úteis)

---

## 1. Visão Geral do Sistema

O **Sistema de Gestão Clínica Multidisciplinar** é uma aplicação web completa para gestão de clínicas com múltiplas especialidades. O sistema oferece:

- **Gestão de Pacientes**: Cadastro completo com histórico médico, contato de emergência
- **Agendamentos**: Calendário visual integrado com profissionais e especialidades
- **Prontuários Eletrônicos (EHR)**: Registros médicos completos com timeline
- **Controle Financeiro**: Receitas, despesas, categorias e fluxo de caixa
- **Gestão de Profissionais**: Equipe multidisciplinar com especialidades
- **Dashboard BI**: Indicadores e métricas executivas

### URLs da Aplicação

| Ambiente | URL |
|----------|-----|
| Frontend (Desenvolvimento) | http://localhost:3000 |
| Backend API (Desenvolvimento) | http://localhost:3001 |
| Health Check | http://localhost:3001/health |
| pgAdmin | http://localhost:5050 |

---

## 2. Stack Tecnológica

### Backend

|ão | Prop Tecnologia | Versósito |
|------------|--------|-----------|
| Node.js | 18+ | Runtime JavaScript |
| TypeScript | ^5.3.3 | Tipagem estática |
| Hono | ^4.0.0 | Framework web (similar ao Express mas mais leve) |
| PostgreSQL | 16 | Banco de dados relacional |
| Docker | - | Containerização |
| JWT | ^9.0.3 | Autenticação por tokens |
| bcryptjs | ^3.0.3 | Hash de senhas |
| pg | ^8.11.3 | Driver PostgreSQL |

### Frontend

| Tecnologia | Versão | Propósito |
|------------|--------|-----------|
| React | ^18.3.1 | Biblioteca de UI |
| TypeScript | ^5.3.3 | Tipagem estática |
| Vite | ^6.3.5 | Build tool e dev server |
| Tailwind CSS | ^3.4.1 | Framework de CSS |
| Radix UI | - | Componentes acessíveis |
| Framer Motion | ^11.0.3 | Animações |
| React Router DOM | ^6.22.0 | Roteamento |
| Axios | ^1.6.5 | HTTP client |
| Recharts | ^2.15.2 | Gráficos |
| date-fns | ^3.6.0 | Manipulação de datas |

---

## 3. Arquitetura do Projeto

```
GestorDeClinica/
├── backend/                      # API Node.js + Hono
│   ├── src/
│   │   ├── index.ts              # Entry point da aplicação
│   │   ├── db/
│   │   │   ├── connection.ts     # Conexão PostgreSQL
│   │   │   ├── migrate.ts         # Script de migrações
│   │   │   ├── migrations/       # Arquivos SQL de schema
│   │   │   └── seeds/            # Dados iniciais
│   │   ├── routes/               # Rotas da API
│   │   ├── middleware/           # Middleware (auth, ABAC)
│   │   └── services/             # Serviços auxiliares
│   └── .env                      # Variáveis de ambiente
│
├── frontend/                     # React + TypeScript
│   ├── src/
│   │   ├── App.tsx               # Componente principal
│   │   ├── routes.tsx            # Configuração de rotas
│   │   ├── components/
│   │   │   ├── auth/             # Componentes de autenticação
│   │   │   ├── dashboard/        # Dashboard principal
│   │   │   ├── agenda/           # Sistema de agendamentos
│   │   │   ├── pacientes/       # Gestão de pacientes
│   │   │   ├── prontuario/       # Prontuários EHR
│   │   │   ├── financeiro/       # Controle financeiro
│   │   │   ├── mobile/           # Componentes mobile
│   │   │   ├── ui/               # Componentes Radix UI
│   │   │   └── landing/          # Página inicial/pública
│   │   └── index.css             # Estilos globais
│   └── .env                      # Variáveis de ambiente
│
├── docker-compose.yml            # Configuração PostgreSQL
├── package.json                  # Scripts root
└── README.md                     # Documentação principal
```

---

## 4. Banco de Dados

### Estrutura do Banco

O banco de dados PostgreSQL contém as seguintes tabelas principais:

| Tabela | Descrição |
|--------|-----------|
| `patients` | Cadastro de pacientes |
| `professionals` | Profissionais da clínica |
| `appointments` | Agendamentos |
| `medical_records` | Prontuários médicos |
| `financial_transactions` | Transações financeiras |
| `categories` | Categorias de receitas/despesas |
| `users` | Usuários do sistema (autenticação) |
| `ehr_events` | Eventos da timeline EHR |

###Migrações

As migrações estão localizadas em `backend/src/db/migrations/`:

| Arquivo | Descrição |
|---------|-----------|
| `001_initial_schema.sql` | Schema inicial (patients, professionals, appointments, etc.) |
| `002_seed_data.sql` | Dados de exemplo |
| `003_ehr_module.sql` | Módulo de prontuário eletrônico |
| `004_users_auth.sql` | Tabela de usuários e autenticação |

### Dados de Exemplo (Seed)

O sistema inclui dados iniciais:
- 5 pacientes de exemplo
- 5 profissionais (Medicina, Fisioterapia, Odontologia, Psicologia, Nutrição)
- 10 categorias financeiras
- Usuário admin padrão

### Estrutura da Tabela `patients`

```sql
patients (
    id UUID PRIMARY KEY,
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
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

### Estrutura da Tabela `users`

```sql
users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('ADMIN', 'USER')),
    modules TEXT[],  -- Módulos que o usuário pode acessar
    active BOOLEAN,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
)
```

---

## 5. API e Rotas

### Endpoints Principais

#### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|------------|
| POST | `/api/auth/login` | Login de usuário |
| GET | `/api/auth/me` | Dados do usuário atual |
| POST | `/api/auth/refresh` | Renovação de token |

#### Pacientes

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/patients` | Listar todos os pacientes |
| GET | `/api/patients/:id` | Detalhar paciente |
| POST | `/api/patients` | Criar paciente |
| PUT | `/api/patients/:id` | Atualizar paciente |
| DELETE | `/api/patients/:id` | Excluir paciente |

#### Profissionais

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/professionals` | Listar profissionais |
| GET | `/api/professionals/:id` | Detalhar profissional |
| POST | `/api/professionals` | Criar profissional |
| PUT | `/api/professionals/:id` | Atualizar profissional |
| DELETE | `/api/professionals/:id` | Excluir profissional |

#### Agendamentos

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/appointments` | Listar agendamentos (com filtros) |
| GET | `/api/appointments/:id` | Detalhar agendamento |
| POST | `/api/appointments` | Criar agendamento |
| PUT | `/api/appointments/:id` | Atualizar agendamento |
| DELETE | `/api/appointments/:id` | Cancelar agendamento |

Parâmetros de query para `/api/appointments`:
- `date` - Filtrar por data
- `professional_id` - Filtrar por profissional
- `patient_id` - Filtrar por paciente
- `status` - Filtrar por status (scheduled, confirmed, completed, cancelled, no_show)

#### Prontuários (EHR)

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/ehr/:patientId` | Timeline EHR do paciente |
| POST | `/api/ehr/:patientId` | Criar evento EHR |
| GET | `/api/medical-records` | Listar prontuários |
| POST | `/api/medical-records` | Criar prontuário |

#### Financeiro

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/financial` | Listar transações |
| GET | `/api/financial/summary` | Resumo financeiro |
| POST | `/api/financial` | Criar transação |
| PUT | `/api/financial/:id` | Atualizar transação |
| DELETE | `/api/financial/:id` | Excluir transação |
| GET | `/api/categories` | Listar categorias |

Parâmetros de query para `/api/financial`:
- `type` - income ou expense
- `status` - paid ou pending
- `start_date` - Data inicial
- `end_date` - Data final

#### Usuários (Admin)

| Método | Endpoint | Descrição |
|--------|----------|------------|
| GET | `/api/users` | Listar usuários |
| GET | `/api/users/:id` | Detalhar usuário |
| POST | `/api/users` | Criar usuário |
| PUT | `/api/users/:id` | Atualizar usuário |
| DELETE | `/api/users/:id` | Desativar usuário |

### Headers Obrigatórios

Para rotas autenticadas, incluir:
```
Authorization: Bearer <token_jwt>
Content-Type: application/json
```

### Exemplo de Resposta

**GET /api/patients**
```json
[
  {
    "id": "uuid-aqui",
    "name": "João Silva",
    "cpf": "123.456.789-00",
    "birth_date": "1990-01-15",
    "gender": "male",
    "phone": "(11) 99999-9999",
    "email": "joao@email.com",
    "address": "Rua Example, 123",
    "allergies": ["Penicilina"],
    "medical_conditions": ["Diabetes"],
    "emergency_contact_name": "Maria Silva",
    "emergency_contact_phone": "(11) 88888-8888",
    "notes": "Paciente優先",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
]
```

---

## 6. Autenticação e Autorização

### Fluxo de Login

1. Usuário envia `email` e `password` para `/api/auth/login`
2. Backend verifica credenciais contra tabela `users`
3. Gera token JWT com dados do usuário (id, name, email, role, modules)
4. Frontend armazena token no localStorage
5. Token expira em 8 horas

### Estrutura do Token JWT

```json
{
  "id": "uuid-do-usuario",
  "name": "Nome do Usuário",
  "email": "email@clinica.com",
  "role": "ADMIN",  // ou "USER"
  "modules": ["dashboard", "agenda", "pacientes", "prontuario", "financeiro", "bi", "admin"],
  "iat": 1704067200,
  "exp": 1704103200
}
```

### Roles e Permissões

| Role | Descrição |
|------|-----------|
| ADMIN | Acesso total ao sistema, incluindo gestão de usuários |
| USER | Acesso conforme módulos atribuídos |

### Módulos do Sistema

| Módulo | Descrição |
|--------|-----------|
| dashboard | Dashboard principal |
| agenda | Sistema de agendamentos |
| pacientes | Gestão de pacientes |
| prontuario | Prontuários EHR |
| financeiro | Controle financeiro |
| bi | Dashboard executivo |
| admin | Gestão de usuários |

### Middleware de Autenticação

O middleware `authMiddleware` (localizado em `backend/src/middleware/auth.ts`):
- Verifica presença do header `Authorization`
- Decodifica e valida o token JWT
- Adiciona dados do usuário ao contexto da requisição

### Middleware ABAC

O sistema implementa controle de acesso baseado em atributos (ABAC) em `backend/src/middleware/abac.ts`:
- `canViewEHR()` - Verifica se usuário pode visualizar EHR
- `canEditEHR()` - Verifica se usuário pode editar EHR

---

## 7. Módulos do Sistema

### Dashboard Principal

- **Localização**: `frontend/src/components/dashboard/Dashboard.tsx`
- **Funcionalidades**: KPIs, gráficos, overview rápido

### Agenda

- **Localização**: `frontend/src/components/agenda/`
- **Componentes**:
  - `Agenda.tsx` - Visualização em grade
  - `AgendaProfissional.tsx` - Agenda por profissional
  - `NovoAgendamentoModal.tsx` - Modal de criação
- **Funcionalidades**: Criar, editar, cancelar agendamentos; filtrar por profissional/data

### Pacientes

- **Localização**: `frontend/src/components/pacientes/`
- **Componentes**:
  - `Pacientes.tsx` - Lista de pacientes
  - `PacienteModal.tsx` - Formulário de paciente
- **Funcionalidades**: CRUD completo de pacientes, busca, filtros

### Prontuários (EHR)

- **Localização**: `frontend/src/components/prontuario/`
- **Componentes**:
  - `Prontuario.tsx` - Timeline do paciente
  - `ProntuarioListing.tsx` - Lista de prontuários
- **Funcionalidades**: Visualizar histórico, criar registros, anexar documentos

### Financeiro

- **Localização**: `frontend/src/components/financeiro/`
- **Componentes**:
  - `FinanceiroPage.tsx` - Página principal
  - `FluxoCaixaPage.tsx` - Fluxo de caixa
  - `GraficoFluxoCaixa.tsx` - Gráficos
- **Funcionalidades**: Receitas, despesas, categorias, relatórios

### Mobile

- **Localização**: `frontend/src/components/mobile/`
- Componentes otimizados para dispositivos móveis
- Interface responsiva com navegação por bottom nav

### Landing Page

- **Localização**: `frontend/src/components/landing/`
- Página pública de apresentação do sistema

---

## 8. Variáveis de Ambiente

### Backend (`backend/.env`)

```env
# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/gestor_clinica
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=gestor_clinica

# API
PORT=3001
NODE_ENV=development

# JWT
JWT_SECRET=your-secret-key-change-this-in-production-minimum-32-characters

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Frontend (`frontend/.env`)

```env
VITE_API_URL=http://localhost:3001/api
```

---

## 9. Guia de Troubleshooting

### Problemas Comuns e Soluções

#### 1. Erro de Conexão com Banco de Dados

**Sintoma**: `Cannot connect to database` ou similar

**Soluções**:
```bash
# Verificar se Docker está rodando
docker ps

# Iniciar banco de dados
npm run db:up

# Ver logs do PostgreSQL
npm run db:logs

# Testar conexão
cd backend && npm run test:db

# Reiniciar containers
npm run db:down
npm run db:up
```

#### 2. Porta Já em Uso

**Sintoma**: `Port 3000/3001/5432 already in use`

**Soluções**:
```bash
# Identificar processo usando a porta
lsof -i :3001

# Parar processo ou usar porta diferente
# Alterar no .env ou docker-compose.yml
```

#### 3. Erro de CORS

**Sintoma**: `Access to fetch has been blocked by CORS policy`

**Soluções**:
1. Verificar se URL da API está correta no frontend
2. Adicionar origem ao `ALLOWED_ORIGINS` no backend/.env
3. Verificar middleware CORS em `backend/src/index.ts`

#### 4. Token JWT Expirado

**Sintoma**: `Token expirado` ou `401 Unauthorized`

**Soluções**:
1. Frontend deve tratar erro 401 e redirecionar para login
2. Usuário faz novo login
3. Verificar relógio do sistema

#### 5. Migrations Não Executaram

**Sintoma**: Tabelas não existem no banco

**Soluções**:
```bash
# Executar migrações manualmente
cd backend && npm run migrate

# Verificar se migrations estão em /docker-entrypoint-initdb.d
docker exec -it gestor-clinica-postgres ls -la /docker-entrypoint-initdb.d/
```

#### 6. Dados de Exemplo Não Carregaram

**Sintoma**: Banco vazio ou sem dados seed

**Soluções**:
```bash
# Executar seeds
cd backend && npm run seed

# Verificar dados no banco
docker exec -it gestor-clinica-postgres psql -U postgres -d gestor_clinica -c "SELECT * FROM patients;"
```

#### 7. Erro de Build no Frontend

**Sintoma**: Erros durante `npm run build`

**Soluções**:
```bash
# Limpar node_modules e reinstalar
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install

# Verificar TypeScript
cd frontend && npx tsc --noEmit
```

#### 8. Erro de Autenticação (Login Falha)

**Sintoma**: Login não funciona mesmo com credenciais corretas

**Verificações**:
1. Banco de dados está rodando
2. Tabela `users` tem registros
3. Senha está correta (hash bcrypt)
4. Usuário está `active = true`

**Resetar senha admin**:
```bash
cd backend && npm run reset-admin-password
```

#### 9. API Retorna 404

**Sintoma**: Endpoint não encontrado

**Verificações**:
1. Servidor backend está rodando na porta correta
2. Rota está registrada em `backend/src/index.ts`
3. URL está correta (lembrar do `/api` prefix)

#### 10. Frontend Não Carrega

**Sintoma**: Página em branco ou erro de console

**Verificações**:
1. Verificar console do navegador (F12)
2. API backend está rodando
3. Variáveis de ambiente estão configuradas
4. Erros de build foram resolvidos

---

## 10. Comandos Úteis

### Instalação

```bash
# Instalar todas as dependências
npm run install:all

# Instalar apenas backend
npm run install:backend

# Instalar apenas frontend
npm run install:frontend
```

### Desenvolvimento

```bash
# Rodar tudo (backend + frontend)
npm run dev

# Rodar apenas backend (porta 3001)
npm run dev:backend

# Rodar apenas frontend (porta 3000)
npm run dev:frontend
```

### Banco de Dados

```bash
# Iniciar PostgreSQL
npm run db:up

# Parar PostgreSQL
npm run db:down

# Ver logs
npm run db:logs

# Testar conexão
cd backend && npm run test:db

# Executar migrações
cd backend && npm run migrate

# Executar seeds
cd backend && npm run seed
```

### Build

```bash
# Build completo
npm run build

# Build apenas backend
npm run build:backend

# Build apenas frontend
npm run build:frontend
```

### Acessar Banco via CLI

```bash
# Conectar ao PostgreSQL
docker exec -it gestor-clinica-postgres psql -U postgres -d gestor_clinica

# Comandos úteis no psql
\l                 # Listar bancos
\dt                # Listar tabelas
\d patients        # Ver estrutura da tabela
SELECT * FROM users;  # Ver usuários
```

---

## 🔧 Quick Reference para Debug

### Verificar Status dos Serviços

```bash
# Ver containers Docker
docker ps

# Ver processos Node
lsof -i :3000 -i :3001

# Health check API
curl http://localhost:3001/health
```

### Logs Importantes

| Serviço | Como acessar |
|---------|-------------|
| Backend | Output do terminal `npm run dev:backend` |
| Frontend | Console do navegador (F12) |
| PostgreSQL | `npm run db:logs` |
| pgAdmin | http://localhost:5050 |

### Arquivos de Referência Rápida

| Tema | Arquivo |
|------|---------|
| Schema DB | `backend/src/db/migrations/001_initial_schema.sql` |
| Rotas API | `backend/src/routes/*.ts` |
| Autenticação | `backend/src/routes/auth-routes.ts` |
| Middleware Auth | `backend/src/middleware/auth.ts` |
| Frontend Routes | `frontend/src/routes.tsx` |
| Variáveis Ambiente | `backend/.env.example` |

---

## 📞 Como Usar Esta Documentação

Ao reportar ou resolver problemas:

1. **Identifique o módulo** - Determine se é frontend, backend ou banco
2. **Consulte a seção relevante** - API, autenticação, etc.
3. **Use o guia de troubleshooting** - Problemas comuns e soluções
4. **Consulte os comandos** - Scripts úteis para diagnóstico
5. **Verifique variáveis de ambiente** - Configurações necessárias

---

**Última atualização**: Fevereiro 2026
**Versão do Sistema**: 1.0.0
