# Development stage
FROM node:lts-alpine as base

# Install necessary dependencies
RUN apk update && \
    apk add --no-cache xvfb libnotify libgconf libnss libxss libasound && \
    rm -rf /var/cache/apk/*

# Set environment variables
ENV DISPLAY=:99

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Expose the port that your app is running on
EXPOSE 3000

# Production stage
FROM base as production

ENV NODE_ENV=production

# Install production dependencies
RUN npm install --only=production

# Copy the rest of the app files
COPY . .

# Start your application in production mode
CMD ["node", "index.js"]

# Development stage
FROM base as dev

ENV NODE_ENV=development

# Install development dependencies
RUN npm install -g nodemon && npm install

# Copy the rest of the app files
COPY . .

# Start your application in development mode
CMD ["npm", "run", "clean:start:dev"]
