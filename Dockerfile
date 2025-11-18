# Stage 1: build the Angular app
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build -- --configuration=production

# Stage 2: runtime using lightweight Node static server (no nginx)
FROM node:20-alpine
WORKDIR /app

# Install a small static server (serve). Version pin optional.
RUN npm install -g serve@14

# Copy built files (replace YOUR_ANGULAR_PROJECT_NAME with your actual dist folder name)
COPY --from=build /app/dist/GITHUB-SCAN-UI-FULL ./dist

# Use Render's default PORT if set; otherwise fallback to 10000
ENV PORT=10000
EXPOSE 10000

# Serve the app, binding to 0.0.0.0 and using the PORT env var
CMD ["sh", "-c", "serve -s ./dist -l tcp://0.0.0.0:$PORT"]
