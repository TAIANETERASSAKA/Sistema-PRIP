# ── Stage 1: build ──────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

# Endereço da API embutido no build do front
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

# ── Stage 2: serve ──────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Remove config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizado para SPA
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copia os arquivos gerados pelo build
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
