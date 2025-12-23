# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Copy backend package.json and package-lock.json
COPY backend/package.json backend/package-lock.json ./backend/

# Install backend dependencies
RUN npm install --prefix backend

# Copy the backend source code
COPY backend ./backend

# Build the backend
RUN npm run build --prefix backend

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy production dependencies
COPY --from=build /app/backend/node_modules ./backend/node_modules
COPY --from=build /app/backend/package.json ./backend/

# Copy built backend
COPY --from=build /app/backend/dist ./backend/dist

# Expose the port
EXPOSE 3001

# Start the backend server
CMD ["node", "dist/index.js"]

