FROM node:18-alpine

# Création du répertoire de travail
WORKDIR /app

# Installation des dépendances
COPY package*.json ./

RUN npm install

# Copie du code source
COPY . .

CMD ls -la

EXPOSE 3000

# Lancement du serveur de production Next
CMD npm run start