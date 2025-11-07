# Step 1: build React app
FROM node:20 AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL
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
