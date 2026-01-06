# Multi-stage Dockerfile for Catalyst Web Modeler
# Stage 1: Build React client
FROM node:20-alpine AS client-builder

WORKDIR /app/client

# Copy client package files
COPY client/package*.json ./

# Install dependencies
RUN npm ci

# Copy client source
COPY client/ ./

# Build for production
RUN npm run build

# Stage 2: Build Express server
FROM node:20-alpine AS server-builder

WORKDIR /app/server

# Copy server package files
COPY server/package*.json ./

# Install dependencies
RUN npm ci

# Copy server source
COPY server/ ./

# Build TypeScript
RUN npm run build

# Stage 3: Production image
FROM node:20-alpine

WORKDIR /app

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Copy built server
COPY --from=server-builder /app/server/dist ./dist
COPY --from=server-builder /app/server/node_modules ./node_modules
COPY --from=server-builder /app/server/package.json ./package.json

# Copy built client (static files)
COPY --from=client-builder /app/client/dist ./public

# Create directories with proper permissions
RUN mkdir -p /app/bpmn-files /app/connectors && \
    chown -R node:node /app

# Switch to non-root user
USER node

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV BPMN_DIR=/app/bpmn-files
ENV CONNECTORS_DIR=/app/connectors

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => process.exit(r.statusCode === 200 ? 0 : 1))"

# Expose port
EXPOSE 3000

# Start server with dumb-init
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/server.js"]
