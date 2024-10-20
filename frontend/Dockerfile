# Base stage
FROM node:20-alpine AS base
ARG BASE_URI \
    USER_SVC_PORT \
    QUESTION_SVC_PORT \
    MATCHING_SVC_PORT
WORKDIR /app
COPY package.json .
COPY yarn.lock .
RUN yarn install --frozen-lockfile
ENV NEXT_PUBLIC_BASE_URI=$BASE_URI \
    NEXT_PUBLIC_USER_SVC_PORT=$USER_SVC_PORT \
    NEXT_PUBLIC_QUESTION_SVC_PORT=$QUESTION_SVC_PORT \
    NEXT_PUBLIC_MATCHING_SVC_PORT=$MATCHING_SVC_PORT

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
