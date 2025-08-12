# --- Base image ---
FROM node:20-alpine

WORKDIR /app

# Copy and install backend dependencies
COPY backend/package*.json ./
RUN npm ci

# Copy backend source code
COPY backend/prisma ./prisma
COPY backend/src ./src

# Build frontend in a separate stage
WORKDIR /app/frontend-build
COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./
RUN npm run build

# Copy built frontend to the main app directory
WORKDIR /app
RUN cp -r /app/frontend-build/dist ./static

# Generate Prisma client
RUN npx prisma generate

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

CMD ["node", "src/index.js"]
