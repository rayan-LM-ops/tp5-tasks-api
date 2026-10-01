## API Tasks - Node.js & PostreSQL

API REST permettant de gérer des tâches avec Node.js, Express et PostreSQL.

# Technologies

Des technologies que j'ai utilisé pour le projet.

- Node.js
- Express
- Docker Desktop
- DBeaver ( aussi PostreSQL )
- Bruno

# Structure de projet 

API/
├── db-init/
│   └── init.sql
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── server.js
├── .gitignore
└── README.md

# Installation de Node
Pour installer le node, il faut taper la commande sur le terminal 

npm install

# Démarrage de Docker 

Avant de démarrer le docker, il faut créer des deux fichiers : 

- docker-compose.yml pour permettre de fonctionner des pages avec l'API avec la base de données
- Dockerfile pour permettre à "build" une image pour la base de données /!\ avec le port /!\ sans le port, la base n'arrive pas à se connecter sur DBeaver.

il faut taper la commande 

docker compose up -d pour démarrer des images
docker compose down pour arrêter des images

Ensuite, si jamais, vous pouvez taper la commande pour vérifier des images qui fonctionnent bien.

- docker compose ps


# Tests du fichier "server.js" avec Bruno

avec l'extension Bruno, vous pouvez tester GET, POST, DELETE, etc avec l'api

Mais, il faut utiliser le bon port (api) pour permettre de tester facilement 

par exemple "http://localhost:3000/tasks"

- 3000 c'est le port d'API 
- /tasks ça vient dans le fichier server.js

# La connexion de BDD sur DBeaver

Sur DBeaver, il faut créer la nouvelle base de données pour permettre de connecter votre docker (docker-compose.yml) MAIS, il faut bien vérifier si le docker compose soit toujours "up" pour permettre de connecter via le DBeaver.

il faut remplir respectivement des mêmes noms sur les champs 

- nom d'utilisateur
- nom de BDD
- mot de passe

Pour se connecter la BDD sans problème.

Pour une fois, la base est bien connecté sur DBeaver, vous pouvez aussi taper une phrase de SQL pour tester si la base est bien fonctionné et vérifier si les tables sont là ou pas.

ex : SELECT * FROM tasks

# Les corrections des vulnérabilités hautes et critiques 

il faut utiliser la commande "npm audit fix" pour permettre de corriger des vulnérabilités hautes et critiques dans le dossier où vous avez utilisé le "npm run dev". 



Rayan EL ALAOUI