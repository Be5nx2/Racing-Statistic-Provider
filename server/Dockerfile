# Build stage (context: project root)
FROM node:20-alpine AS builder

WORKDIR /app

COPY server/package*.json ./
RUN npm install

COPY server/tsconfig.json ./
COPY server/src ./src
RUN npm run build

# Run stage
FROM node:20-alpine

WORKDIR /app

COPY server/package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY input ./input

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["node", "dist/index.js"]
