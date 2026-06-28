FROM node:20-slim

RUN corepack enable && corepack prepare pnpm@10.4.1 --activate

WORKDIR /app

COPY package.json pnpm-lock.yaml ./
COPY patches ./patches/

RUN pnpm install --frozen-lockfile

COPY client ./client/
COPY server ./server/
COPY shared ./shared/
COPY drizzle ./drizzle/
COPY vite.config.ts tsconfig.json tailwind.config.js ./

RUN pnpm vite build

RUN pnpm esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

RUN pnpm prune --prod

EXPOSE 3000

CMD ["node", "dist/index.js"]
