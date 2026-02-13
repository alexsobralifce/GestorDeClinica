# Railway Deployment Guide

## Overview
This guide will help you deploy the Gestor de Clínica application to Railway with PostgreSQL database.

## Prerequisites
- Railway account ([railway.app](https://railway.app))
- GitHub repository pushed with all source code
- Git authentication configured (push access to your repository)

## Step 1: Create Railway Project

1. Go to [railway.app](https://railway.app) and login
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your repository: `alexsobralifce/GestorDeClinica`
5. Railway will detect it as a Node.js project

## Step 2: Add PostgreSQL Database

1. In your Railway project dashboard, click **"New"**
2. Select **"Database"** → **"Add PostgreSQL"**
3. Railway will automatically create a PostgreSQL instance
4. The database will be automatically linked to your app

## Step 3: Configure Environment Variables

Railway automatically sets some variables, but you need to add custom ones:

### Navigate to Variables
1. Click on your **backend service** (not the database)
2. Go to **"Variables"** tab
3. Add the following variables:

### Required Variables

```bash
NODE_ENV=production
PORT=3001
JWT_SECRET=<generate-strong-secret-here>
ALLOWED_ORIGINS=https://your-app-url.railway.app
```

### Database Variables (Automatic)
Railway automatically provides these when you link the PostgreSQL service:
- `DATABASE_URL` - Complete connection string (auto-provided by Railway)

If `DATABASE_URL` is not automatically set:
1. Go to PostgreSQL service → **Connect** tab
2. Copy the **"Postgres Connection URL"**
3. Add it as `DATABASE_URL` variable in your backend service

### Generate Strong JWT Secret

Run locally to generate a secure secret:
```bash
openssl rand -base64 64
```

Copy the output and use it as `JWT_SECRET` value.

## Step 4: Configure Build Settings

Railway should auto-detect, but verify:

### Root Directory
If Railway doesn't auto-detect correctly:
1. Go to **Settings** → **Build Configuration**
2. If needed, set **Root Directory** to: `/` (root)

### Build Command
Railway should use the `build` script from root `package.json`:
```bash
npm run build
```

### Start Command  
Railway should use the `start` script from root `package.json`:
```bash
npm start
```

## Step 5: Database Migrations (Automatic)

**Good news!** Migrations are configured to run automatically on every deployment.

The `start` script in `backend/package.json` includes:
```json
"start": "npm run migrate && tsx src/index.ts"
```

This means:
- ✅ Migrations run automatically before the server starts
- ✅ No manual intervention needed
- ✅ Database always up-to-date with latest schema
- ✅ Default admin user created automatically

### Verify Migrations in Logs

After deployment:
1. Go to backend service → **Deployments**
2. Click latest deployment → **View Logs**
3. Look for migration output:
   ```
   Starting migration...
   ✅ Migration 001_initial_schema.sql executed successfully
   ✅ Migration 002_seed_data.sql executed successfully
   ...
   All migrations completed successfully.
   ✅ Server running on http://localhost:3001
   ```

### Manual Migration (if needed)

If you need to run migrations manually:
```bash
railway run npm run migrate --service backend
```

## Step 6: Verify Deployment

1. **Check Deployment Logs**
   - Go to backend service → **Deployments**
   - Click on latest deployment → **View Logs**
   - Look for: `✅ Server running on http://localhost:3001`

2. **Get Your App URL**
   - Go to backend service → **Settings** → **Networking**
   - Click **"Generate Domain"** to get a public URL
   - Your app will be available at: `https://your-app-name.railway.app`

3. **Test the API**
   ```bash
   curl https://your-app-name.railway.app/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"admin@clinica.com","password":"admin123"}'
   ```

4. **Test Admin Login**
   - Open your Railway URL in browser
   - Login with: `admin@clinica.com` / `admin123`
   - ⚠️ Change this password immediately after first login!

## Step 7: Frontend Configuration (if deploying separately)

If you want the frontend on a different URL:

1. Create a new service in Railway for frontend
2. Set environment variable:
   ```bash
   VITE_API_URL=https://your-backend.railway.app
   ```
3. Update `ALLOWED_ORIGINS` in backend to include frontend URL

## Common Issues & Solutions

### Build Failing: "No source code found"
**Cause:** Source code not in repository (`.gitignore` excluding `src/`)
**Solution:** Verify `.gitignore` doesn't exclude `src/`, then push:
```bash
git add -A
git commit -m "Add source code to repository"
git push
```

### Build Failing: "Cannot find module"
**Cause:** Dependencies not installed
**Solution:** Ensure `--include=dev` is in build script (already configured)

### Database Connection Failed
**Cause:** `DATABASE_URL` not set or incorrect
**Solution:** 
1. Check PostgreSQL service is running
2. Verify `DATABASE_URL` variable is set in backend service
3. Ensure database and backend are in the same project

### Migrations Not Running
**Solution:** Run manually using Railway CLI:
```bash
railway run npm run migrate --service backend
```

### CORS Errors
**Cause:** Frontend URL not in `ALLOWED_ORIGINS`
**Solution:** Add your Railway frontend URL to `ALLOWED_ORIGINS` variable

## Production Checklist

Before going live:
- [ ] Strong `JWT_SECRET` generated and set
- [ ] `ALLOWED_ORIGINS` configured for your domain
- [ ] PostgreSQL database created and linked
- [ ] Migrations executed successfully
- [ ] Admin password changed from default
- [ ] Database backups enabled (Railway Pro feature)
- [ ] Custom domain configured (optional)
- [ ] Environment variables reviewed and secured
- [ ] Health check endpoint tested

## Monitoring & Maintenance

### View Logs
```bash
railway logs --service backend
```

### Database Backups
- Railway Pro plans include automatic daily backups
- For free tier, export data manually using Railway CLI:
```bash
railway connect postgres
# Then use pg_dump commands
```

### Scaling
Railway automatically scales based on usage. For manual control:
1. Go to Service → **Settings** → **Resources**
2. Adjust memory/CPU allocation

## Cost Optimization

- **Free Tier:** $5/month credit (suitable for testing)
- **Pro Plan:** $20/month (recommended for production)
- **Database:** Included in project costs

### Tips:
- Use a single PostgreSQL instance for all environments
- Use different databases on same instance: `gestor_clinica_dev`, `gestor_clinica_prod`
- Monitor usage in Railway dashboard

## Support

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- GitHub Issues: Report bugs in your repository
