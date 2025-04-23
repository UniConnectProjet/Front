FROM node:18

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install axios react-router-dom nodemon

COPY . .
