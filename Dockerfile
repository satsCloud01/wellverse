# Stage 1: Frontend build
FROM node:20-slim AS frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Python runtime
FROM python:3.12-slim
WORKDIR /app
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY backend/src/ ./src/
COPY --from=frontend /app/frontend/dist ./frontend/dist/
ENV PYTHONPATH=/app/src
EXPOSE 8026
CMD ["uvicorn", "wellverse.main:app", "--host", "0.0.0.0", "--port", "8026"]
