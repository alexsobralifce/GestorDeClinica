# Passo a Passo Definitivo: Configuração no Railway 🚀

Este guia resolve o erro de conexão (`Invalid URL`) e coloca o sistema no ar.

## 1️⃣ Configurar o Banco de Dados (PostgreSQL)

1. No Dashboard do Railway, clique no serviço **PostgreSQL**.
2. Vá na aba **Connect**.
3. Copie a **"Postgres Connection URL"**.
   - Ela se parece com: `postgresql://postgres:RoundhouseKick@viaduct.proxy.rlwy.net:12345/railway`
   - **NÃO COPIE** variáveis como `${DB_USER}` ou `${DB_HOST}`. Use a URL real!

## 2️⃣ Configurar o Backend (Node.js)

1. Clique no serviço **Backend** (seu repositório).
2. Vá na aba **Variables**.
3. Adicione/Edite as seguintes variáveis **EXATAMENTE** assim:

| Variável | Valor | Observação |
| :--- | :--- | :--- |
| `DATABASE_URL` | `postgresql://...` (Cole a URL copiada no passo 1) | **CRÍTICO:** Cole o valor real, não placeholders! |
| `NODE_ENV` | `production` | Obrigatório |
| `PORT` | `3001` | Obrigatório |
| `JWT_SECRET` | (Qualquer texto longo e aleatório) | Ex: `meusecretosuperseguro123456` |

4. **Apague** quaisquer outras variáveis de banco se existirem (`DB_HOST`, `DB_USER`, `DB_PASSWORD`). O Railway só precisa da `DATABASE_URL`.

## 3️⃣ Verificar e Fazer Deploy

1. O Railway deve reiniciar o deploy automaticamente ao salvar as variáveis.
2. Se não iniciar, vá em **Deployments** e clique em **Trigger Deploy**.
3. Acompanhe os **Logs** do deploy.
4. Você deve ver:
   ```
   🔌 Connecting to database: postgresql://postgres:****@...
   ✅ Database connected successfully
   Starting migration...
   All migrations completed successfully.
   ✅ Server running on http://localhost:3001
   ```

## 🚨 Se der erro "Invalid URL" Novamente

Significa que você ainda tem uma variável com `${...}` no valor.
- Revise todas as variáveis no Railway.
- Certifique-se de que **nenhuma** delas tem `${}`.
- Elas devem ter valores REAIS.

---

## Dica: Domínio Público

Para acessar seu sistema:
1. Vá em **Settings** do serviço Backend.
2. Em **Networking**, clique em **Generate Domain**.
3. Acesse a URL gerada!
