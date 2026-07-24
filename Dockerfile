FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache libc6-compat

ENV NODE_ENV=development
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .

RUN npx prisma generate

RUN mkdir -p .next prds && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

CMD ["npm", "run", "dev"]
