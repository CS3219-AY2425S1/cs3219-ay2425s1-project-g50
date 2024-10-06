# Base stage
FROM node:20-alpine AS base
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile

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
