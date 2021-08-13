ARG RUN

FROM node:lts as builder

WORKDIR /app

# some packages require a build step
RUN apt-get update
RUN apt-get -y -qq install python-setuptools python-dev build-essential

# install dependencies
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
RUN npm ci

# build the app
COPY . /app
RUN npm run build

# build the release app
FROM node:lts

EXPOSE 4000

WORKDIR /app
COPY --from=builder /app /app

CMD [ "npm", "run", "start:production" ]
