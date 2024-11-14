# Base image
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Install dependencies in base stage
RUN npm install

# Development stage
FROM base AS dev
COPY . .
# Run the JavaScript code directly in dev mode (useful for hot-reloading)
CMD ["npm", "run", "dev"]

# Production stage
FROM node:20-alpine AS prod
WORKDIR /app
COPY --from=base /app/node_modules ./node_modules
COPY . .
# Start the server in production mode
CMD ["npm", "start"]
