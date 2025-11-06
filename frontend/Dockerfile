# Step 1: build React app
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Step 2: serve pakai Nginx
FROM nginx:stable-alpine
COPY --from=build /app/build /usr/share/nginx/html

# Tambahkan config agar routing react-router-dom jalan
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
