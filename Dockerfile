# Build aşaması
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Nginx aşaması
FROM nginx:alpine

# SPA (React Router) desteği için özel nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# React build klasörünü nginx’e kopyala
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
