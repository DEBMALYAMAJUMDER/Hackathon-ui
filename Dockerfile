# Dockerfile
FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ENV PORT=10000
EXPOSE 10000

# FIX: use npx instead of ng
RUN npx ng build --configuration=production

CMD ["sh", "-c", "npm run start -- --host 0.0.0.0 --port $PORT"]
