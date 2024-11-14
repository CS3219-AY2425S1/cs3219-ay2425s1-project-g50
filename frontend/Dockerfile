# Base stage
FROM node:20-alpine AS base
ARG BASE_URI \
    API_GATEWAY_SERVICE_PORT \
    FRONTEND_SERVICE_PORT
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
ENV NEXT_PUBLIC_BASE_URI=$BASE_URI \
    NEXT_PUBLIC_API_GATEWAY_PORT=$API_GATEWAY_SERVICE_PORT \
    PORT=$FRONTEND_SERVICE_PORT

# Production build stage
FROM base AS build
COPY . .
RUN yarn build

# Development stage
FROM base AS dev
COPY . .
CMD ["yarn", "dev"]

# Production runtime stage
FROM build AS prod
CMD ["yarn", "start"]
