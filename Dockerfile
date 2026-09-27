# Production image: builds the Vite app, then serves the static files with nginx on port 80.
#
# Base images come from Docker Hub by default. On Hamravesh Darkube (or anywhere Docker Hub is
# slow/blocked), build with the mirror instead:
#   --build-arg REGISTRY=hub.hamdocker.ir/library
# To use an npm mirror, also pass: --build-arg NPM_REGISTRY=https://<your-npm-mirror>/
ARG REGISTRY=docker.io/library

FROM ${REGISTRY}/node:22-alpine AS build
ARG NPM_REGISTRY=
WORKDIR /app
COPY package.json package-lock.json ./
RUN if [ -n "$NPM_REGISTRY" ]; then npm config set registry "$NPM_REGISTRY"; fi \
 && npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM ${REGISTRY}/nginx:1.27-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://127.0.0.1/healthz || exit 1
