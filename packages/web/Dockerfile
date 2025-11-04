FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.15.0

# =============================================================================
# Dependencies stage
# =============================================================================
FROM base AS deps

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./

# Copy package.json files for all workspace packages
COPY packages/shared/package.json ./packages/shared/
COPY packages/ui/package.json ./packages/ui/
COPY packages/web/package.json ./packages/web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# =============================================================================
# Builder stage
# =============================================================================
FROM base AS builder

WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages/shared/node_modules ./packages/shared/node_modules
COPY --from=deps /app/packages/ui/node_modules ./packages/ui/node_modules
COPY --from=deps /app/packages/web/node_modules ./packages/web/node_modules

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml* ./
COPY turbo.json ./

# Copy source code
COPY packages/shared ./packages/shared
COPY packages/ui ./packages/ui
COPY packages/web ./packages/web

# Build shared and ui packages
RUN pnpm --filter @fidus/shared build
RUN pnpm --filter @fidus/ui build

# Build web application
WORKDIR /app/packages/web
RUN pnpm build

# =============================================================================
# Runner stage
# =============================================================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files from standalone build
COPY --from=builder /app/packages/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/packages/web/.next/static ./packages/web/.next/static
COPY --from=builder /app/packages/web/public ./packages/web/public

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "packages/web/server.js"]
