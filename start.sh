#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🌿 Starting WellVerse..."

# Backend
echo "→ Starting backend on port 8007..."
cd "$DIR/backend"
PYTHONPATH=src .venv/bin/uvicorn wellverse.main:app --reload --port 8009 &
BACKEND_PID=$!

# Frontend
echo "→ Starting frontend on port 5179..."
cd "$DIR/frontend"
npm run dev &
FRONTEND_PID=$!

echo ""
echo "  Backend:  http://localhost:8009"
echo "  Frontend: http://localhost:5179"
echo ""

trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null" EXIT
wait
