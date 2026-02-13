# Production Database Setup and Deployment Guide

## Overview
This guide covers deploying the PostgreSQL database for the Gestor de Clínica application in a production environment.

## Files
- `docker-compose.prod.yml` - Production database configuration
- `.env.production.example` - Example environment variables

## Pre-Deployment Checklist

### 1. Environment Variables
Copy the example file and configure it:
```bash
cp .env.production.example .env.production
```

**CRITICAL: Update these values before deployment:**
- `DB_PASSWORD` - Use a strong password (minimum 32 characters, random)
- `JWT_SECRET` - Use a strong secret (minimum 64 characters, random)
- `ALLOWED_ORIGINS` - Set to your actual domain(s)

### 2. Generate Secure Secrets
```bash
# Generate strong DB password
openssl rand -base64 32

# Generate JWT secret
openssl rand -base64 64
```

## Deployment Options

### Option 1: Railway (Recommended for Managed Database)

Railway provides managed PostgreSQL databases with automatic backups and scaling.

1. **Create PostgreSQL Service** in Railway dashboard
2. **Copy connection string** from Railway database settings
3. **Update backend `.env`** with Railway's `DATABASE_URL`
4. **No Docker needed** - Railway manages the database

### Option 2: Self-Hosted with Docker

For VPS or dedicated servers:

```bash
# Start the database
docker-compose -f docker-compose.prod.yml --env-file .env.production up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f postgres
```

### Option 3: Managed Database Provider

Use providers like:
- **Supabase** (PostgreSQL with additional features)
- **Neon** (Serverless PostgreSQL)
- **AWS RDS** (Enterprise-grade)
- **DigitalOcean Managed Databases**

Update `DATABASE_URL` in backend `.env` with the provider's connection string.

## Database Migrations

After deploying the database, run migrations:

```bash
cd backend
npm run migrate
```

## Backup Strategy

### Automated Backups (Docker)
```bash
# Create backup directory
mkdir -p ./backups

# Backup script
docker exec gestor-clinica-postgres pg_dump -U postgres gestor_clinica > ./backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Scheduled Backups (Cron)
Add to crontab:
```bash
0 2 * * * cd /path/to/GestorDeClinica && docker exec gestor-clinica-postgres pg_dump -U postgres gestor_clinica > ./backups/backup_$(date +\%Y\%m\%d_\%H\%M\%S).sql
```

### Restore from Backup
```bash
docker exec -i gestor-clinica-postgres psql -U postgres gestor_clinica < ./backups/backup_YYYYMMDD_HHMMSS.sql
```

## Monitoring

### Health Checks
```bash
# Check database health
docker exec gestor-clinica-postgres pg_isready -U postgres

# Check connections
docker exec gestor-clinica-postgres psql -U postgres -c "SELECT count(*) FROM pg_stat_activity;"
```

### Performance Monitoring
```bash
# View active queries
docker exec gestor-clinica-postgres psql -U postgres -c "SELECT pid, usename, application_name, state, query FROM pg_stat_activity WHERE state != 'idle';"

# Database size
docker exec gestor-clinica-postgres psql -U postgres -c "SELECT pg_database.datname, pg_size_pretty(pg_database_size(pg_database.datname)) AS size FROM pg_database;"
```

## Security Best Practices

1. **Never commit `.env.production`** to version control
2. **Use strong passwords** (32+ characters)
3. **Restrict network access** - Only allow backend server IP
4. **Enable SSL/TLS** for database connections in production
5. **Regular backups** - Daily automated backups minimum
6. **Monitor logs** for suspicious activity
7. **Update regularly** - Keep PostgreSQL version current

## Scaling Considerations

### Connection Pooling
For high-traffic applications, consider using PgBouncer:

```yaml
# Add to docker-compose.prod.yml
pgbouncer:
  image: edoburu/pgbouncer
  environment:
    DATABASE_URL: "postgres://postgres:${DB_PASSWORD}@postgres:5432/gestor_clinica"
    MAX_CLIENT_CONN: 1000
    DEFAULT_POOL_SIZE: 25
  ports:
    - "6432:5432"
  depends_on:
    - postgres
```

### Read Replicas
For read-heavy workloads, configure PostgreSQL streaming replication.

## Troubleshooting

### Cannot Connect
```bash
# Check if container is running
docker ps | grep postgres

# Check logs
docker logs gestor-clinica-postgres

# Verify network
docker network ls
docker network inspect gestor-clinica-network
```

### Performance Issues
```bash
# Check slow queries
docker exec gestor-clinica-postgres psql -U postgres -c "SELECT pid, now() - query_start as duration, query FROM pg_stat_activity WHERE state = 'active' and now() - query_start > interval '5 seconds';"
```

### Out of Connections
```bash
# Increase max_connections (restart required)
# Edit docker-compose.prod.yml:
#   POSTGRES_MAX_CONNECTIONS: 200
```

## Production Checklist

Before going live:
- [ ] Strong passwords set
- [ ] JWT secret configured
- [ ] Database backups automated
- [ ] SSL/TLS enabled
- [ ] Firewall rules configured
- [ ] Monitoring set up
- [ ] Migrations run successfully
- [ ] Connection pooling configured (if needed)
- [ ] Disaster recovery plan documented
- [ ] Team has access to backups
