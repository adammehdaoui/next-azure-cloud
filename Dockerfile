FROM node:lts

# Création du répertoire de travail
WORKDIR /app

# Installation des dépendances
COPY package*.json ./

RUN npm install

# Copie du code source
COPY . .

EXPOSE 3000

# Lancement du dev Next
CMD npm run dev