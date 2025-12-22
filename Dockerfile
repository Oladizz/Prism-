# Stage 1: Build
FROM node:20 AS build

WORKDIR /app

# Copy all package.json and package-lock.json files
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/package-lock.json ./frontend/
COPY backend/package.json backend/package-lock.json ./backend/

# Install all dependencies
RUN npm install
RUN npm install --prefix frontend
RUN npm install --prefix backend

# Copy the rest of the source code
COPY . .

# Build the frontend and backend
RUN npm run build --prefix frontend
RUN npm run build --prefix backend

# Stage 2: Production
FROM node:20-alpine

WORKDIR /app

# Copy production dependencies
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/backend/node_modules ./backend/node_modules

# Copy built frontend and backend
COPY --from=build /app/frontend/dist ./frontend/dist
COPY --from=build /app/backend/dist ./backend/dist
COPY --from=build /app/backend/package.json ./backend/

# Expose the port
EXPOSE 3001

# Start the backend server
CMD ["node", "backend/dist/index.js"]
