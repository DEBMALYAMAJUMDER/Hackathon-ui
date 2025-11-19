FROM node:20-alpine AS build
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN chmod +x node_modules/.bin/ng
RUN node_modules/.bin/ng build --configuration=production

FROM node:20-alpine
WORKDIR /app

RUN npm install -g serve@14

COPY --from=build /app/dist/github-scan-ui ./dist

ENV PORT=10000
EXPOSE 10000

CMD ["serve", "-s", "dist", "-l", "tcp://0.0.0.0:$PORT"]
