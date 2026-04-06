# --- Stage 1: Build the React App ---
FROM node:20-alpine AS build

WORKDIR /app

# REMOVED localhost defaults. 
# We will inject the real backend URL during the Google Cloud Build step.
ARG VITE_API_BASE_URL
ARG VITE_WS_URL
ARG VITE_FIREBASE_PROJECT_ID
ARG VITE_FIREBASE_API_KEY
ARG VITE_ENV=production
ARG VITE_VIEW_SYNC_PROVIDER=local-storage
# Set mock auth to false by default for production safety
ARG VITE_ENABLE_MOCK_AUTH=false 

ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV VITE_FIREBASE_PROJECT_ID=$VITE_FIREBASE_PROJECT_ID
ENV VITE_FIREBASE_API_KEY=$VITE_FIREBASE_API_KEY
ENV VITE_ENV=$VITE_ENV
ENV VITE_VIEW_SYNC_PROVIDER=$VITE_VIEW_SYNC_PROVIDER
ENV VITE_ENABLE_MOCK_AUTH=$VITE_ENABLE_MOCK_AUTH

# Copy package files first to leverage Docker layer caching
COPY package*.json ./
RUN npm ci

# Copy the rest of the source code
COPY . .

# Build the app with explicit Vite env values
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:stable-alpine

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the build output from Stage 1 to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom nginx.conf to handle routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# CHANGED TO 8080: Matches Cloud Run and the new nginx.conf
EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]