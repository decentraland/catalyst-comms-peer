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

# remove devDependencies, keep only used dependencies
RUN npm ci --only=production

# build the release app
FROM node:lts


EXPOSE 5000

WORKDIR /app
COPY --from=builder /app /app
CMD [ "node", "run", "start", "-- TEST_ID=1 NUMBER_OF_PEERS=4" ]
