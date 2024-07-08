# Stage 1: Build the Angular application
FROM node:16.3.0-alpine AS build

WORKDIR /app

# Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install --quiet

# Copy the rest of the application
COPY . .

# Build the Angular app in production mode
RUN npm run build

# Stage 2: Serve the Angular app with nginx
FROM nginx:1.21.4-alpine

# Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the build stage
COPY --from=build /app/dist/app-control-compras /usr/share/nginx/html

# Copy nginx configuration file
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

