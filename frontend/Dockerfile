# --- Stage 1: Build the React App ---
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the source code
COPY . .

# Build the app (Vite will use .env.production if it exists)
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from Stage 1 to Nginx's html folder
# Note: Vite defaults to 'dist', while Create React App uses 'build'
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom nginx.conf to handle routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Cloud Run listens on port 8080 by default, but Nginx usually uses 80.
# We'll stick to 80 here and let Cloud Run map it, or use the command below.
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
