# Frontend - Next.js
FROM node:18-alpine

WORKDIR /app

# Copiar package.json primeiro (cache de camadas)
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm ci

# Copiar código da aplicação
COPY . .

# Expor porta
EXPOSE 3000

# Variável de ambiente para API
ENV NEXT_PUBLIC_API_URL=http://localhost:8000

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]
