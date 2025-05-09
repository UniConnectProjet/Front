FROM node:18

WORKDIR /app

COPY package*.json ./

# Nettoyage du cache npm
RUN npm cache clean --force

# Installation des dépendances
RUN npm install

# Installation explicite avec --legacy-peer-deps si nécessaire
RUN npm install axios react-router-dom nodemon --legacy-peer-deps

COPY . .