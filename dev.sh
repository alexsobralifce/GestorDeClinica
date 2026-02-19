#!/bin/bash
# dev.sh — Para processos existentes e reinicia frontend + backend

KILL_PORT=false

kill_port() {
  local port=$1
  local name=$2
  local pids
  pids=$(lsof -ti:$port 2>/dev/null)
  if [ -n "$pids" ]; then
    echo "$pids" | xargs kill -9 2>/dev/null
    echo "  ✓ $name (porta $port) parado"
  else
    echo "  → $name (porta $port) não estava rodando"
  fi
}

echo "🛑 Parando serviços existentes..."
kill_port 3001 "Backend"
kill_port 5173 "Frontend"

sleep 1

echo ""
echo "🚀 Iniciando backend e frontend..."
npm run dev:backend-only &
npm run dev:frontend-only
