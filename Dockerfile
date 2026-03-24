# Use an official Node runtime as a build environment
FROM node:20-alpine AS builder

# Install git for cloning
RUN apk add --no-cache git

# Set the working directory
WORKDIR /app

# Clone the repository (you can pass --build-arg CACHEBUST=$(date +%s) to force a fresh clone)
ARG CACHEBUST=1
RUN git clone https://github.com/GauravGhost/MITY_DISCORD_BOT.git .

# Install all dependencies (including devDependencies for TypeScript)
RUN npm ci

# Build the TypeScript code
RUN npm run build

# Production Stage
FROM node:20-alpine

# Set the working directory
WORKDIR /app

# Copy package configurations from the builder stage
COPY --from=builder /app/package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled code from the builder stage
COPY --from=builder /app/dist ./dist

# Set Node environment to production
ENV NODE_ENV=production

# Start the bot directly
CMD ["npm", "start"]
