# 🏥 Sistema de Gestão Clínica Multidisciplinar

Sistema completo para gestão de clínicas multidisciplinares com foco em humanização, acessibilidade e eficiência.

## 📋 Sobre

Sistema web para gerenciar:
- **Pacientes** - Cadastro completo com histórico
- **Agendamentos** - Sistema de calendário integrado
- **Prontuários** - Registros médicos eletrônicos
- **Financeiro** - Controle de receitas e despesas
- **Profissionais** - Gestão da equipe multidisciplinar

## 🏗️ Arquitetura

```
GestorDeClinica/
├── backend/                 # API Node.js + Hono + PostgreSQL
│   ├── src/
│   └── README.md
├── frontend/                # React + TypeScript + Tailwind
│   ├── src/
│   └── README.md
├── docker-compose.yml       # PostgreSQL container
├── package.json             # Root workspace scripts
└── README.md
```

### Stack Tecnológica

**Backend:**
- Node.js + TypeScript
- Hono (web framework)
- PostgreSQL 16
- Docker

**Frontend:**
- React 18+ + TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Framer Motion

## 🚀 Quick Start

### 1. Instalar Dependências

```bash
# Instalar tudo de uma vez
npm run install:all

# Ou separadamente
npm run install:backend
npm run install:frontend
```

### 2. Iniciar Banco de Dados

```bash
npm run db:up
```

### 3. Executar Aplicação

```bash
# Rodar backend e frontend juntos
npm run dev

# Ou separadamente
npm run dev:backend  # API em localhost:3001
npm run dev:frontend  # App em localhost:3000
```

## 📚 Documentação Detalhada

- [Backend README](./backend/README.md) - API e banco de dados
- [Frontend README](./frontend/README.md) - Interface e componentes
- [SETUP.md](./SETUP.md) - Guia completo de instalação

## 🗄️ Banco de Dados

PostgreSQL rodando em Docker com:
- 6 tabelas (patients, professionals, appointments, medical_records, financial_transactions, categories)
- Migrations automáticas
- Dados de exemplo inclusos

### Comandos

```bash
npm run db:up     # Iniciar
npm run db:down   # Parar
npm run db:logs   # Ver logs
```

## 🌐 URLs

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## 📊 Features

✅ **Gestão de Pacientes**
- Cadastro completo
- Histórico médico
- Contatos de emergência

✅ **Sistema de Agendamentos**
- Calendário visual
- Filtros por profissional/especialidade
- Status de agendamento

✅ **Prontuários Eletrônicos**
- Registro de consultas
- Diagnósticos e tratamentos
- Anexos

✅ **Controle Financeiro**
- Receitas e despesas
- Categorização
- Relatórios

✅ **Gestão de Profissionais**
- Cadastro da equipe
- Especialidades
- Horários

## 🎨 Design

O sistema segue princípios de:
- **Humanização** - Interface amigável e acolhedora
- **Acessibilidade** - ARIA completo, navegação por teclado
- **Responsividade** - Funciona em todos os dispositivos
- **Performance** - Otimizado para velocidade

Ver [DESIGN_SYSTEM.md](./frontend/src/DESIGN_SYSTEM.md) para detalhes.

## 🔧 Scripts Disponíveis

```bash
# Instalação
npm run install:all         # Instalar tudo
npm run install:backend     # Só backend
npm run install:frontend    # Só frontend

# Development
npm run dev                 # Rodar tudo
npm run dev:backend         # Só backend
npm run dev:frontend        # Só frontend

# Build
npm run build              # Build completo
npm run build:backend      # Build backend
npm run build:frontend     # Build frontend

# Database
npm run db:up              # Iniciar PostgreSQL
npm run db:down            # Parar PostgreSQL
npm run db:logs            # Ver logs
```

## 🧪 API Endpoints

Ver [backend/README.md](./backend/README.md) para lista completa de endpoints.

Principais:
- `GET /api/patients` - Listar pacientes
- `GET /api/appointments` - Listar agendamentos
- `GET /api/financial/summary` - Resumo financeiro

## 📝 Variáveis de Ambiente

### Backend (.env no backend/)
```env
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/gestor_clinica
API_PORT=3001
NODE_ENV=development
```

### Frontend (.env no frontend/)
```env
VITE_API_URL=http://localhost:3001/api
```

## 🤝 Contribuindo

1. Clone o repositório
2. Instale as dependências (`npm run install:all`)
3. Inicie o banco (`npm run db:up`)
4. Execute em dev (`npm run dev`)

## 📄 Licença

Projeto para gestão clínica humanizada.

---

**Desenvolvido com ❤️ para profissionais de saúde**