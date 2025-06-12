# 1. Build aşaması
FROM node:18 AS builder

WORKDIR /app

# package.json ve package-lock.json ekle
COPY package*.json ./

# Bağımlılıkları yükle
RUN npm install

# Projeyi kopyala ve build et
COPY . .
RUN npm run build

# 2. Servis aşaması: statik dosyaları servis et
FROM nginx:alpine

# React build çıktısını nginx'in root dizinine kopyala
COPY --from=builder /app/build /usr/share/nginx/html

# Custom nginx config istersen:
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Railway varsayılan olarak 80 portunu dinler
EXPOSE 81

# nginx başlat
CMD ["nginx", "-g", "daemon off;"]
