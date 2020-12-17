FROM node:lts-alpine as builder
# App directory
WORKDIR /app

COPY . .
RUN yarn install --silent
RUN yarn build

FROM builder as staging
COPY .env.staging .env

FROM builder as production
COPY .env.production .env