# ===============================
# Stage 1: Build Angular Project
# ===============================
FROM node:20-alpine AS build
WORKDIR /app

# Copy dependency files
COPY package.json package-lock.json ./

# Install node modules cleanly
RUN npm ci

# Copy the full source code
COPY . .

# FIX: Angular CLI binary is not executable on Alpine
RUN chmod +x node_modules/.bin/*

# Build Angular in production mode
RUN npm run build -- --configuration production


# ===============================
# Stage 2: Serve Angular Dist
# ===============================
FROM node:20-alpine
WORKDIR /app

# Install a lightweight static server
RUN npm install -g serve@14

# Copy built Angular files from build stage
COPY --from=build /app/dist/github-scan-ui ./dist

# Render automatically sets PORT env variable
ENV PORT=10000
EXPOSE 10000

# Start server
CMD ["sh", "-c", "serve -s ./dist -l tcp://0.0.0.0:$PORT"]
