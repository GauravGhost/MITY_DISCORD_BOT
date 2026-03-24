# Use an official Node runtime as a build environment
FROM node:20-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install all dependencies (including devDependencies for TypeScript)
RUN npm ci

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Production Stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package configurations
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# Set Node environment to production
ENV NODE_ENV=production

# Start the bot directly
CMD ["node", "dist/server.js"]
