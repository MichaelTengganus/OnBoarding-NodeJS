FROM node:16-alpine AS base
RUN apk -U add curl
WORKDIR /usr/src/app

ENV PORT=3001
ENV DB_DIALECT=mysql
ENV DB=book-db
ENV DB_HOST=book-db.database.windows.net
ENV DB_PORT=1433
ENV DB_USERNAME=adminadmin
ENV DB_PASSWORD=EcomP@ssw0rd

ENV APP_SETTINGS_FILE_PATH=\config\appConfig.json
ENV APM_URL=http://20.43.171.96:8200/
ENV KAFKA_HOST=20.198.136.173:29092

ENV SECRET=P@ssw0rd123!
ENV EXPIRE_TOKEN=3600

ENV REDIS_PORT=6380
ENV REDIS_HOST=astra-star.redis.cache.windows.net
ENV REDIS_PASSWORD=upb5eW9dvoMWM+yAKAAjIhGsrVoDOOS67gPUA0MGDvg=

# EXPOSE 3001

FROM node:16-alpine as build
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

FROM base as final
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
CMD [ "npm", "start" ]