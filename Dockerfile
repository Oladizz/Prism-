# Frontend build stage
FROM node:20 AS frontend
WORKDIR /app/frontend
COPY ./frontend .
RUN npm install
RUN npm run build

# Backend build stage
FROM node:20 AS backend
WORKDIR /app/backend
COPY ./backend .
RUN npm install

# Production stage
FROM node:20-alpine
WORKDIR /app
COPY --from=frontend /app/frontend/dist ./frontend/dist
COPY --from=backend /app/backend ./backend
COPY package.json package-lock.json ./
RUN npm install --production --force

EXPOSE 3001
CMD ["npm", "start"]
