FROM node:16.15

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci --include=dev

RUN npm i -g @nestjs/cli rimraf env-cmd
