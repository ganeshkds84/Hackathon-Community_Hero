# Stage 1: Build the Next.js application
FROM node:22-slim AS builder
WORKDIR /app

# Copy dependency definition files
COPY package.json package-lock.json ./

# Install all dependencies (including devDependencies) for the build
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Inject build-time environment variables so they are baked into client-side code
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build the production application bundle
RUN npm run build

# Stage 2: Runtime runner stage
FROM node:22-slim AS runner
WORKDIR /app

# Configure production environment variables
ENV NODE_ENV=production
ENV PORT=8080

# Expose port 8080 for Cloud Run
EXPOSE 8080

# Copy dependency definitions and install ONLY production dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy built resources and static files from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./

# Start Next.js server (it will automatically listen on the PORT env variable)
CMD ["npm", "start"]
