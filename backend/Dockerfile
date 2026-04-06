# Use a lightweight Node.js image
FROM node:20-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image
COPY package*.json ./

# Install production dependencies
RUN npm install --only=production

# Copy local code to the container image
COPY . .

# Cloud Run expects the app to listen on the port defined by the PORT env var
EXPOSE 8080

# Run the web service on container startup
CMD [ "npm", "start" ]
