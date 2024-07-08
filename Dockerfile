# Stage 1: Build the Angular application
FROM node:16.3.0-alpine AS build

WORKDIR /app

# Copiar archivos de configuración de Angular
COPY package.json package-lock.json ./
COPY . .

# Instalar dependencias y construir la aplicación Angular en modo producción
RUN npm install
RUN RUN ng build --prod

# Stage 2: Servir la aplicación Angular con nginx
FROM nginx:1.21.4-alpine

# Eliminar el sitio web por defecto de NGINX
RUN rm -rf /usr/share/nginx/html/*

# Copiar la aplicación Angular construida desde la etapa de construcción
COPY --from=build /app/dist/app-control-compras /usr/share/nginx/html

# Copiar el archivo de configuración de NGINX
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto 80
EXPOSE 80

# Iniciar NGINX
CMD ["nginx", "-g", "daemon off;"]
