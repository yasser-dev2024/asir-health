# syntax=docker/dockerfile:1

FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM deps AS build
COPY . .
RUN npm run build

FROM node:20-alpine AS api
WORKDIR /app
ENV NODE_ENV=development
ENV PORT=3001
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY server ./server
EXPOSE 3001
CMD ["node", "server/index.js"]

FROM nginx:1.27-alpine AS web
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1
