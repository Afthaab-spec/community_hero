# Stage 1: Build frontend
FROM node:20-slim AS frontend
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches/
RUN pnpm install --frozen-lockfile
COPY client ./client/
COPY shared ./shared/
COPY vite.config.ts tsconfig.json ./
RUN pnpm vite build

# Stage 2: Build server
FROM node:20-slim AS server
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches/
RUN pnpm install --frozen-lockfile
COPY server ./server/
COPY shared ./shared/
COPY tsconfig.json ./
COPY drizzle ./drizzle/
RUN pnpm esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

# Stage 3: Production
FROM node:20-slim AS production
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY patches ./patches/
RUN pnpm install --frozen-lockfile --prod
COPY --from=server /app/dist ./dist/
COPY --from=frontend /app/dist/public ./dist/public/
EXPOSE 3000
CMD ["node", "dist/index.js"]
