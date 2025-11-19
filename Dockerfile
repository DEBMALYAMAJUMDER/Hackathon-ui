FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy sources
COPY . .

# FIX: Ensure ng binary is executable
RUN chmod +x node_modules/.bin/ng

# Build using local Angular CLI
RUN node_modules/.bin/ng build --configuration=production

ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "npm run start -- --host 0.0.0.0 --port $PORT"]
