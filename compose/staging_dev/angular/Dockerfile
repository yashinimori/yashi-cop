FROM node:14-alpine as builder

COPY frontend/package.json frontend/package-lock.json /

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN apk add --no-cache --virtual .gyp \
        python \
        make \
        g++ \
        && npm ci --no-optional \
        && npm i \
        && npm cache clean --force \
        && mkdir -p /app/ && mv ./node_modules ./app/ \
        && apk del .gyp

WORKDIR /app

COPY /frontend/ /app/
RUN ng build --prod

FROM nginx:alpine

COPY --from=builder /app/dist/ /
COPY /compose/staging/angular/nginx/nginx.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT ["nginx", "-g", "daemon off;"]
