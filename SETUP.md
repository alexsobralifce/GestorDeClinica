# 🚀 Setup Guide - Sistema de Gestão Clínica

## Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **npm** ou **yarn**

## 📦 Instalação

### 1. Instalar Dependências do Frontend

```bash
npm install
```

### 2. Instalar Dependências do Backend

```bash
cd server
npm install
cd ..
```

## 🐘 Configuração do Banco de Dados

### 1. Iniciar PostgreSQL com Docker

```bash
npm run db:up
```

Este comando irá:
- Criar um container PostgreSQL na porta 5432
- Criar um container pgAdmin na porta 5050 (opcional)
- Executar automaticamente as migrations (schema + seed data)

### 2. Verificar se o Banco está Rodando

```bash
docker ps
```

Você deve ver os containers `gestor-clinica-postgres` e `gestor-clinica-pgadmin` rodando.

### 3. Acessar pgAdmin (Opcional)

Abra o navegador em: `http://localhost:5050`

- **Email:** admin@gestorclinica.com
- **Password:** admin123

Para conectar ao PostgreSQL no pgAdmin:
- **Host:** postgres (ou localhost se conectar de fora do Docker)
- **Port:** 5432
- **Database:** gestor_clinica
- **Username:** postgres
- **Password:** postgres123

## 🚀 Executando a Aplicação

### Opção 1: Rodar Tudo de Uma Vez (Recomendado)

```bash
npm run dev:all
```

Este comando inicia:
- Frontend (Vite) em `http://localhost:3000`
- Backend API em `http://localhost:3001`

### Opção 2: Rodar Separadamente

**Terminal 1 - Frontend:**
```bash
npm run dev
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

## ✅ Verificação

### 1. Testar Conexão com o Banco de Dados

```bash
cd server
npm run test:db
```

Você deve ver:
```
✅ Connected to database
✅ Query executed successfully
📅 Server time: ...
📊 Tables in database:
  - patients
  - professionals
  - categories
  - appointments
  - medical_records
  - financial_transactions
```

### 2. Testar API

Abra o navegador ou use curl:

```bash
# Health check
curl http://localhost:3001/health

# Listar pacientes
curl http://localhost:3001/api/patients

# Listar profissionais
curl http://localhost:3001/api/professionals
```

### 3. Testar Frontend

Abra o navegador em `http://localhost:3000`

Você deve ver a aplicação rodando com:
- Dashboard
- Módulo de Pacientes
- Módulo de Agendamentos
- Módulo Financeiro
- Módulo de Prontuários

## 🗄️ Comandos Úteis do Banco de Dados

```bash
# Iniciar banco de dados
npm run db:up

# Parar banco de dados
npm run db:down

# Ver logs do PostgreSQL
npm run db:logs

# Conectar ao PostgreSQL via CLI
docker exec -it gestor-clinica-postgres psql -U postgres -d gestor_clinica
```

### Comandos SQL Úteis

Dentro do psql:

```sql
-- Listar todas as tabelas
\dt

-- Ver estrutura de uma tabela
\d patients

-- Contar registros
SELECT COUNT(*) FROM patients;
SELECT COUNT(*) FROM appointments;

-- Ver dados de exemplo
SELECT * FROM patients LIMIT 5;
SELECT * FROM professionals;
SELECT * FROM categories;
```

## 🔧 Troubleshooting

### Erro: "Port 5432 already in use"

Se você já tem PostgreSQL rodando localmente:

**Opção 1:** Parar o PostgreSQL local
```bash
# macOS
brew services stop postgresql

# Linux
sudo systemctl stop postgresql
```

**Opção 2:** Mudar a porta no `docker-compose.yml`
```yaml
ports:
  - "5433:5432"  # Mude para 5433
```

E atualize o `.env`:
```
DB_PORT=5433
```

### Erro: "Cannot connect to database"

1. Verifique se o Docker está rodando:
   ```bash
   docker ps
   ```

2. Verifique os logs do container:
   ```bash
   npm run db:logs
   ```

3. Reinicie o container:
   ```bash
   npm run db:down
   npm run db:up
   ```

### Erro: "Module not found"

Reinstale as dependências:

```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd server
rm -rf node_modules package-lock.json
npm install
```

### Banco de Dados Vazio

Se as migrations não rodaram automaticamente:

```bash
# Conectar ao PostgreSQL
docker exec -it gestor-clinica-postgres psql -U postgres -d gestor_clinica

# Executar migrations manualmente
\i /docker-entrypoint-initdb.d/001_initial_schema.sql
\i /docker-entrypoint-initdb.d/002_seed_data.sql
```

## 📊 Estrutura do Banco de Dados

### Tabelas Principais

1. **patients** - Cadastro de pacientes
2. **professionals** - Cadastro de profissionais
3. **appointments** - Agendamentos
4. **medical_records** - Prontuários eletrônicos
5. **financial_transactions** - Transações financeiras
6. **categories** - Categorias de receitas/despesas

### Dados de Exemplo

O sistema vem com dados de exemplo (seed data):
- 5 pacientes
- 5 profissionais (Medicina, Fisioterapia, Odontologia, Psicologia, Nutrição)
- 10 categorias financeiras

## 🌐 URLs da Aplicação

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/health
- **pgAdmin:** http://localhost:5050

## 📝 Variáveis de Ambiente

O arquivo `.env` contém todas as configurações necessárias:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres123@localhost:5432/gestor_clinica
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres123
DB_NAME=gestor_clinica

# Backend API
API_PORT=3001
NODE_ENV=development

# Frontend
VITE_API_URL=http://localhost:3001/api
```

## 🎯 Próximos Passos

1. ✅ Banco de dados configurado
2. ✅ Backend API rodando
3. ✅ Frontend conectado ao backend
4. 🔄 Integrar contextos do frontend com a API
5. 🔄 Testar CRUD completo de cada módulo
6. 🔄 Adicionar autenticação (opcional)

## 📚 Documentação Adicional

- [Design System](./src/DESIGN_SYSTEM.md)
- [README Principal](./src/README.md)
- [Plano de Implementação](./implementation_plan.md)

## 🆘 Suporte

Se encontrar problemas:

1. Verifique os logs do backend: `npm run dev:server`
2. Verifique os logs do banco: `npm run db:logs`
3. Verifique o console do navegador (F12)
4. Consulte a documentação do projeto

---

**Desenvolvido com ❤️ para gestão clínica humanizada**
