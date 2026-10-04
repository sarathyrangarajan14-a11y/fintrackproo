# =========================================================
# Stage 1: Build & Compile Assets
# =========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package dependency manifests
COPY package*.json ./

# Install all dependencies (including devDependencies for client-side compilation)
RUN npm ci

# Copy full application source code
COPY . .

# Run the production build command
# Compiles React to /dist and packages server.ts into dist/server.cjs
RUN npm run build

# =========================================================
# Stage 2: Production Runner
# =========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Set environment production flag
ENV NODE_ENV=production
# Expose default Cloud Run routing port
ENV PORT=3000

# Copy package dependency manifests to install production-only dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy compiled assets from the builder stage
COPY --from=builder /app/dist ./dist

# Expose the designated port (Cloud Run overrides this via environment variables)
EXPOSE 3000

# Execute the compiled CommonJS server bundle
CMD ["node", "dist/server.cjs"]
