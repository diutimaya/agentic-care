# Stage 1 — dependencies
FROM node:18-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --production

# Stage 2 — production image
FROM node:18-alpine AS runner
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY server.js ./
COPY src/ ./src/

RUN chown -R appuser:appgroup /app
USER appuser

EXPOSE 5000
CMD ["node", "server.js"]