# Stage 1: build the Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Fix permissions for binaries (important for Alpine)
RUN chmod +x node_modules/.bin/* || true

# Copy source and build
COPY . .
RUN npm run build --configuration=production

# Stage 2: runtime using lightweight Node static server
FROM node:20-alpine
WORKDIR /app

# Install static server
RUN npm install -g serve@14

# Copy built angular app
COPY --from=build /app/dist/github-scan-ui ./dist

# Use Render's default PORT
ENV PORT=10000
EXPOSE 10000

CMD ["sh", "-c", "serve -s ./dist -l tcp://0.0.0.0:$PORT"]
