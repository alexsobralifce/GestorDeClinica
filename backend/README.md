# Backend - Sistema de Gestão Clínica

API backend construída com Node.js, Hono e PostgreSQL.

## 🚀 Tecnologias

- **Runtime:** Node.js
- **Framework:** Hono (web framework rápido e leve)
- **Database:** PostgreSQL 16
- **ORM/Query:** pg (node-postgres)
- **TypeScript:** Para type safety

## 📁 Estrutura

```
backend/
├── src/
│   ├── index.ts           # Servidor principal
│   ├── db/
│   │   ├── connection.ts  # Pool PostgreSQL
│   │   └── migrations/    # SQL migrations
│   └── routes/
│       ├── patients.ts
│       ├── professionals.ts
│       ├── appointments.ts
│       ├── medical-records.ts
│       ├── financial.ts
│       └── categories.ts
├── .env
├── package.json
└── tsconfig.json
```

## 🔧 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
# Development
npm run dev

# Build
npm run build

# Start em produção
npm start
```

## 🌐 API Endpoints

### Health Check
- `GET /health` - Status da API

### Patients (Pacientes)
- `GET /api/patients` - Listar todos
- `GET /api/patients/:id` - Buscar por ID
- `POST /api/patients` - Criar
- `PUT /api/patients/:id` - Atualizar
- `DELETE /api/patients/:id` - Deletar

### Professionals (Profissionais)
- `GET /api/professionals` - Listar ativos
- `GET /api/professionals/:id` - Buscar por ID
- `POST /api/professionals` - Criar
- `PUT /api/professionals/:id` - Atualizar
- `DELETE /api/professionals/:id` - Desativar

### Appointments (Agendamentos)
- `GET /api/appointments` - Listar (com filtros)
- `POST /api/appointments` - Criar
- `PUT /api/appointments/:id` - Atualizar
- `DELETE /api/appointments/:id` - Deletar

### Medical Records (Prontuários)
- `GET /api/medical-records` - Listar
- `POST /api/medical-records` - Criar
- `PUT /api/medical-records/:id` - Atualizar
- `DELETE /api/medical-records/:id` - Deletar

### Financial (Financeiro)
- `GET /api/financial` - Listar transações
- `GET /api/financial/summary` - Resumo financeiro
- `POST /api/financial` - Criar transação
- `PUT /api/financial/:id` - Atualizar
- `DELETE /api/financial/:id` - Deletar

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/gestor_clinica
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=gestor_clinica

# API
API_PORT=3001
NODE_ENV=development
```

## 🗄️ Database

O backend usa PostgreSQL. Para iniciar:

```bash
# Da raiz do projeto
npm run db:up
```

## 📝 Schema

- `patients` - Dados dos pacientes
- `professionals` - Profissionais de saúde
- `appointments` - Agendamentos
- `medical_records` - Prontuários
- `financial_transactions` - Transações financeiras
- `categories` - Categorias

## 🔐 CORS

CORS configurado para aceitar requisições do frontend (localhost:3000).
