# syntax=docker/dockerfile:1
# Node.js version: v24.14.1 | React: ^19.2.8
ARG NODE_VERSION=24.14.1
FROM node:${NODE_VERSION}-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

