# Frontend build stage
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/yarn.lock ./
RUN yarn install
COPY frontend/ ./
RUN yarn build

# Backend build stage
FROM node:20 AS backend
WORKDIR /app/backend
COPY backend/package.json backend/yarn.lock ./
RUN yarn install
COPY backend/ ./

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=frontend /app/frontend/dist ./frontend/dist
COPY --from=backend /app/backend ./backend
COPY package.json yarn.lock ./
RUN yarn install --production

EXPOSE 3001
CMD ["yarn", "start"]
