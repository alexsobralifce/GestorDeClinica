# Pre-Production Checklist

Use esta checklist para garantir que o sistema está pronto para produção.

## 🗄️ Banco de Dados

### Railway PostgreSQL
- [ ] Serviço PostgreSQL criado no Railway
- [ ] Serviço PostgreSQL está rodando (status "Active")
- [ ] Consegue ver o PostgreSQL na lista de serviços

### Conexão
- [ ] `DATABASE_URL` copiada EXATAMENTE do PostgreSQL service → Connect tab
- [ ] `DATABASE_URL` configurada no backend service → Variables
- [ ] URL tem o formato: `postgresql://postgres:SENHA@host.railway.app:PORT/railway`
- [ ] **NÃO** está usando `localhost` ou `127.0.0.1`

### Validação Rápida
Execute localmente para testar a conexão:
```bash
# Criar arquivo .env.test com a DATABASE_URL do Railway
echo "DATABASE_URL=COLE_A_URL_AQUI" > backend/.env.test

# Testar conexão
cd backend
NODE_ENV=production DATABASE_URL="$(cat .env.test | grep DATABASE_URL | cut -d= -f2-)" npm run test:db
```

Se aparecer "✅ Database connected successfully" → Tudo certo!

---

## 🔐 Variáveis de Ambiente

### No Backend Service (Railway)
- [ ] `DATABASE_URL` - Copiada do PostgreSQL service
- [ ] `NODE_ENV=production`
- [ ] `PORT=3001`
- [ ] `JWT_SECRET` - Gerado com `openssl rand -base64 64` (mínimo 64 caracteres)
- [ ] `ALLOWED_ORIGINS` - URL do frontend (se tiver separado)

### Validação
- [ ] JWT_SECRET tem pelo menos 32 caracteres
- [ ] DATABASE_URL NÃO contém "localhost"
- [ ] Todas variáveis obrigatórias estão preenchidas

---

## 📦 Build & Deploy

### Código no GitHub
- [ ] Todo código commitado (especialmente `backend/src/` e `frontend/src/`)
- [ ] `.gitignore` NÃO exclui `src/` globalmente
- [ ] Push realizado: `git push origin main`

### Build Scripts
- [ ] `package.json` na raiz existe
- [ ] Script `build` configurado: `"build": "npm run build:prod --prefix backend"`
- [ ] Script `start` configurado: `"start": "npm start --prefix backend"`
- [ ] Migrações automáticas: backend `start` script inclui `npm run migrate &&`

### Railway Detection
- [ ] Railway detectou como Node.js project
- [ ] Build command: `npm run build`
- [ ] Start command: `npm start`

---

## 🧪 Testes Pré-Deploy

### Localmente
```bash
# 1. Build completo
npm run build

# 2. Testar em modo produção
cd backend
NODE_ENV=production npm start

# 3. Testar API
curl http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinica.com","password":"admin123"}'
```

Deve retornar token JWT! ✅

---

## 🚀 Deploy no Railway

### Primeira Vez
1. [ ] Projeto Railway criado
2. [ ] Conectado ao repositório GitHub
3. [ ] PostgreSQL adicionado ao projeto
4. [ ] Variáveis configuradas no backend
5. [ ] Deploy iniciou automaticamente

### Verificar Logs
```
Backend service → Deployments → Click no deploy → View Logs
```

Procure por:
- [ ] `✅ Database connected successfully`
- [ ] `Starting migration...`
- [ ] `✅ Migration XXX executed successfully`
- [ ] `All migrations completed successfully`
- [ ] `✅ Server running on http://localhost:3001`

### Se der erro:
1. **"ECONNREFUSED"** → DATABASE_URL não configurada
2. **"password authentication failed"** → DATABASE_URL com senha errada
3. **"Failed to resolve /src/main.tsx"** → Código fonte não está no GitHub
4. **"Cannot find module"** → Falta `--include=dev` no build script

---

## ✅ Verificação Final

### API Funcionando
```bash
# Pegar URL do Railway
# Backend service → Settings → Networking → Generate Domain

# Testar endpoint
curl https://SEU-APP.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinica.com","password":"admin123"}'
```

Deve retornar:
```json
{
  "token": "eyJhbGc...",
  "user": {
    "email": "admin@clinica.com",
    "role": "ADMIN"
  }
}
```

### Login no Frontend
- [ ] Abrir URL do Railway no navegador
- [ ] Login com `admin@clinica.com` / `admin123`
- [ ] Dashboard carrega corretamente
- [ ] **Trocar senha padrão imediatamente!**

---

## 🔒 Segurança Pós-Deploy

- [ ] Trocar senha do admin padrão
- [ ] Criar usuários específicos (não usar admin para tudo)
- [ ] Revisar CORS (`ALLOWED_ORIGINS`) - apenas domínios confiáveis
- [ ] Confirmar JWT_SECRET forte (64+ caracteres)
- [ ] Configurar backups do banco (Railway Pro)

---

## 📊 Monitoramento

### Logs do Railway
```bash
# Ver logs em tempo real
railway logs --service backend

# Ver métricas
Railway Dashboard → Backend service → Metrics
```

### Alertas (Recomendado)
- Configurar notificações de deploy failure no Railway
- Monitorar uso de memória/CPU
- Configurar uptime monitoring (UptimeRobot, Checkly, etc)

---

## 🆘 Troubleshooting Comum

### Problema: Deploy falha com "No start command"
**Solução:** Verificar `package.json` na raiz tem script `start`

### Problema: "password authentication failed"
**Solução:** 
1. PostgreSQL service → Connect → Copiar URL EXATA
2. Backend service → Variables → DATABASE_URL → Colar

### Problema: Migrations não executam
**Solução:** Verificar logs. Se necessário, executar manual:
```bash
railway run npm run migrate --service backend
```

### Problema: CORS error no frontend
**Solução:** Adicionar URL do frontend em `ALLOWED_ORIGINS`

### Problema: "Cannot find module @/*"
**Solução:** Build está falhando. Verificar `tsconfig.json` e `--include=dev`

---

## ✨ Está Tudo OK?

Se todos os itens estão ✅, seu sistema está em produção! 🎉

**Próximos passos:**
- Configurar domínio customizado (opcional)
- Configurar CI/CD para deploys automáticos
- Implementar monitoramento de erros (Sentry, etc)
- Configurar backups regulares
- Documentar processos para o time
