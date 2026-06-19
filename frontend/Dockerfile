# Étape 1 : build React
FROM node:20-slim AS build
WORKDIR /app

ARG VITE_API_BASE_URL=/api
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package*.json ./

# npm install au lieu de npm ci pour éviter le conflit de bindings natifs (rolldown/vite)
ENV npm_config_audit=false \
	npm_config_fund=false \
	npm_config_update_notifier=false

RUN npm install --legacy-peer-deps --no-audit --no-fund

COPY . .
RUN npm run build

# Étape 2 : Serveur Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80