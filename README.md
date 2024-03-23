This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Next Azure Cloud 💫 - Projet de machines virtuelles éphémères

Repository du projet : [github.com/adammehdaoui/next-azure-cloud](https://github.com/adammehdaoui/next-azure-cloud)

## Sommaire

- [Description du projet](#description-du-projet)
- [Notes importantes](#notes-importantes)
- [Installation du projet](#installation-du-projet)
  - [Remplir le fichier .env](#remplir-le-fichier-env)
  - [Sans docker](#sans-docker)
  - [Avec docker](#avec-docker)
- [Authentification](#authentification)
- [Connexion aux machines virtuelles](#connexion-aux-machines-virtuelles)
  - [Machines Unix](#machines-unix)
  - [Machines Windows (testé sous MacOS)](#machines-windows-testé-sous-macos)
- [Documentation du code source](#documentation-du-code-source)
  - [Structure du projet](#structure-du-projet)
  - [Création/Suppression des VM](#créationsuppression-des-vm)
- [Améliorations possibles](#améliorations-possibles)
- [Bugs connus](#bugs-connus)

## Description du projet

Ce projet permet de lancer une machine virtuelle avec un nouveau groupe de ressource propre sur le cloud d'Azure. En fonction des droits de l'utilisateur connecté, il est possible de lancer ou non une machine virtuelle d'un système d'exploitation donné.
L'application renvoie ensuite les étapes pour se connecter à ces machines virtuelles (SSH pour une machine Unix ou RDP avec Microsoft Remote Desktop sur MacOS pour une machine Windows).

## Notes importantes

- Le projet a été testé dans un environnement MacOS Sonoma et Node 21.
- Le lancement d'une machine virtuelle peut prendre un certain temps en fonction de la configuration choisie.
- **SUPER IMPORTANT** : il ne faut pas couper le serveur avant que la suppression de la machine virtuelle et de son groupe de ressource au bout de 10 minutes ne soit terminée (Le nombre d'adresses IP dans une région étant limité à 3).

## Installation du projet

### Remplir le fichier .env

Voici comment le fichier .env doit être rempli **(comment récupérer ces valeurs plus bas dans la documentation) :**

```bash
AZURE_CLIENT_ID='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
AZURE_CLIENT_SECRET='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
AZURE_TENANT_ID='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
AZURE_SUBSCRIPTION_ID='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
JWT_SECRET='xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
```

**La suite de la documentation explique comment récupérer les valeurs nécessaires pour remplir ce fichier avec vos informations Azure.**

Pour l'instant seul AZURE_SUBSCRIPTION_ID est nécessaire pour lancer l'application. Les autres variables sont nécessaires pour les appels à l'API Azure à venir.

Étapes pour récupérer **AZURE_SUBSCRIPTION_ID** :

- Se connecter à Azure Portal
- Rechercher les abonnements, puis cliquer sur l'abonnement souhaité.
- Récupérer l'ID (valeur) de l'abonnement et l'intégrer dans le fichier .env.

Étapes pour récupérer **AZURE_CLIENT_ID, AZURE_CLIENT_SECRET, AZURE_TENANT_ID** :

- Se connecter à Azure Portal
- Rechercher les inscriptions d'applications, puis cliquez sur "Nouvelle inscription".
- Cliquer ensuite sur inscrire après avoir configuré votre application.
- Générer un secret client pour l'application dans les informations d'identification.
- Une fois l'application créée, assurez-vous de récupérer le **AZURE Tenant ID**, le **AZURE Client ID** et le **AZURE Client Secret** afin de les intégrer dans le fichier .env.

**_Exemple pour générer une clef pour le JWT_SECRET sous MacOS :_**

```bash
openssl rand -base64 32
```

### Sans docker

Prérequis : avoir Node installé sur votre machine.

Commandes à effectuer à la racine du projet :

```bash
npm i && npm run build && npm run start
```

L'application est maintenant accessible depuis le port 3000.

### Avec docker

Prérequis : avoir Docker installé sur votre machine.

Commandes à effectuer à la racine du projet :

```bash
docker build -t next-azure-cloud .
```

et

```bash
docker run -it -p 3000:3000 next-azure-cloud
```

L'application est maintenant accessible depuis le port 3000.

## Authentification

L'accès à la plateforme nécessite une authentification. Trois utilisateurs ont été préconfigurés pour faciliter le processus. Veuillez utiliser les informations d'identification suivantes :

Utilisateur pouvant lancer **trois machines virtuelles avec un OS différent** (CentOS, Windows, Ubuntu)

Login : **user-admin**; Mot de passe : **user-admin**

Utilisateur pouvant lancer **une machine virtuelle** Ubuntu :

Login : **user-contributor**; Mot de passe : **user-contributor**

Utilisateur **sans crédit** :

Login : **user-restricted**; Mot de passe : **user-restricted**

## Connexion aux machines virtuelles

### Machines Unix

Appliquer les commandes qui seront affichées dans l'application lorsque vous serez redirigé vers la page de la machine virtuelle.
Le port 22 (SSH) est ouvert par défaut.

### Machines Windows (testé sous MacOS)

Pour se connecter à une machine virtuelle Windows, il vous faudra pouvoir utiliser le protocole RDP.
Pour cela, vous pouvez utiliser l'application **Microsoft Remote Desktop** disponible sur l'App Store.
**Pour se connecter avec le nom d'utilisateur et le mot de passe, veuillez sélectionner "Ask when required" lors de la configuration**.
Il y a également la possibilité d'utiliser le client open-source **FreeRDP**.
Plus d'informations seront affichées sur la page sur laquelle vous serez redirigé.

## Documentation du code source

L'application est développée avec le framework Next.js (basé sur la librairie React).
Le framework permet une fonction Back avec les server actions et routes handlers (qui gérerons ici les appels Azure et la connexion des utilisateurs)

Dépendances notables du projet :

- TypeScript
- TailwindCSS
- Azure SDK : https://learn.microsoft.com/en-us/azure/developer/javascript/how-to/with-azure-sdk/create-manage-virtual-machine
- react-icons : https://react-icons.github.io/react-icons/
- jsonwebtoken
- sonner : https://sonner.emilkowal.ski/

### Structure du projet

Le projet suit la structure _app router_ introduit dans Next 13.

- src/app : contient la logique des routes accessibles côté client
- src/components : contient les composants React appelés dans les pages principales (dans src/app)
- src/config : contient la configuration de base de l'application (la configuration de l'image des VM entre autre)
- src/utils : contient la logique de création des vms et de leur nettoyage ainsi que la gestion de la connexion des utilisateurs à l'application (token JWT + cookies)
- src/utils/validators : types principaux utilisés dans le code source TypeScript.

### Création/Suppression des VM

Il est important de noter que pour gérer la création et la suppression des VM, nous sommes partis d'un sample de code fourni par Microsoft Azure : [Lien du repository](https://github.com/Azure-Samples/js-e2e/blob/main/resources/virtual-machines/create-vm.js). On a alors utilisé ce code dans un server action.
La création des VM se fait sur la route /dashboard.
Une fois le bouton cliqué on a ces étapes gérés par la SDK d'Azure et appelées dans le fichier _src/utils/create-vm.ts_ avec la fonction _launch_ :

1. Création du groupe de ressource
2. Création du compte de stockage
3. Création du réseau virtuel et de ses sous-réseaux
4. Création d'une adresse IP publique
5. Création de l'interface réseau
6. Création de la machine virtuelle à partir d'une image avec récupération des informations récupérées auparavant dans les étapes précédentes.

**IMPORTANT** : Si l'une des étapes fail (exemple : trop de machines virtuelles sont déjà enregistrées sur le même comptes), alors le nettoyage géré dans le fichier src/utils/cleanup-vm.ts par launchCleanup est appelé immédiatement.

Si toutes les étapes se déroulent correctement, alors le nettoyage sera appelé 10 minutes plus tard avec un setTimeout de JavaScript (c'est alors la fonction wrapper de launchCleanup **delayedCleanup** qui sera appelée).

## Améliorations possibles

- Choix de la région de création d'une VM (nécessite une identification des images qui sont disponibles dans les régions principales pour éviter les erreurs).
- Création d'une base de données si le nombre de d'utilisateurs vient à augmenter, pour l'instant incohérent pour trois utilisateurs.

## Bugs connus

- **N'IMPACTE PAS L'UTILISATEUR** : En mode conteneurisé, la fonction redirect de next/navigation lance une erreur interne côté serveur. Cela n'impacte pas l'utilisateur final, car la redirection se fait correctement.
  Il s'agit d'un bug connu de Next.js qui demande le passage de Next en version canary : [Lien vers l'issue](https://github.com/vercel/next.js/issues/53392)
