FROM node:10-stretch as builder
WORKDIR /app
ARG ENVIRONMENT
RUN mkdir -p ./src/environments
RUN mkdir /public
COPY . .
RUN npm i --no-audit
RUN echo "$ENVIRONMENT" | base64 -d > ./src/environments/environment.ts
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
WORKDIR /usr/share/nginx/html
EXPOSE 80
COPY --from=builder /app/dist/fuss-rating/ .
