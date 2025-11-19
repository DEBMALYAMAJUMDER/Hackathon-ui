# ---------- Stage 1: Build Angular App ----------
FROM node:20-alpine AS build
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build Angular in production mode
RUN npm run build -- --configuration=production

# ---------- Stage 2: Serve Angular App ----------
FROM node:20-alpine
WORKDIR /app

# Install "serve" to host static files
RUN npm install -g serve

# Copy built files from the build stage
COPY --from=build /app/dist/ /app/dist/

# Render uses the PORT variable
ENV PORT=10000
EXPOSE 10000

# Host Angular dist folder
CMD ["serve", "-s", "dist", "-l", "0.0.0.0:$PORT"]
