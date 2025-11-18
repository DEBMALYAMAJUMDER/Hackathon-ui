# Dockerfile.dev
FROM node:20-alpine

WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Copy app
COPY . .

# Ensure host binding works and use the PORT env var from Render
ENV PORT=10000
EXPOSE 10000

# Run the dev server binding to 0.0.0.0 so Render can route to it.
# Use --host 0.0.0.0 and pass PORT
CMD ["sh", "-c", "npm run start -- --host 0.0.0.0 --port $PORT"]
