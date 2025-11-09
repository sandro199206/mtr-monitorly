# Backend Dockerfile for MTR Monitoring
FROM node:20-alpine

# Install MTR
RUN apk add --no-cache mtr

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Build TypeScript
RUN npm run build

# Expose port
EXPOSE 3000

# Create data directory for SQLite
RUN mkdir -p /app/data

# Start server
CMD ["npm", "start"]
