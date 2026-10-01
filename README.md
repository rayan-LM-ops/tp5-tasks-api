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

## RGPD

Finalité

Le prénom du bénévole est collecté uniquement afin d'indiquer quel bénévole s'occupe d'une tâche.

Données collectées

L'application collecte uniquement le prénom du bénévole. Le champ est limité à 50 caractères. Aucun nom de famille, e-mail ou numéro de téléphone n'est collecté pour cette fonctionnalité.

Durée de conservation

Le prénom est conservé pendant la durée de vie de la tâche. Il est supprimé lorsque la tâche est supprimée. Le bénévole peut également demander le retrait de son prénom sans supprimer la tâche.

Accès aux données

Le prénom est accessible aux utilisateurs autorisés de l'application qui ont besoin de consulter ou de gérer les tâches.

Droits des bénévoles

Un bénévole peut demander la suppression de son prénom. L'application permet de retirer directement le prénom d'une tâche avec le bouton « Retirer le bénévole ».

Pour demander une suppression ou exercer ses droits, il est possible de contacter :

contact@association.example

Journaux et traceurs

L'API ne journalise pas le contenu des requêtes et notamment pas les prénoms transmis dans les requêtes.

L'application n'utilise pas d'outil de statistiques, de pixel publicitaire ou de script tiers de suivi.

## Vérification RGPD et sécurité

# Les vérifications réalisées sont les suivantes :

Le prénom est facultatif.

Seul le prénom est demandé pour identifier le bénévole.

Le prénom est limité à 50 caractères.

La validation est effectuée côté serveur avec Joi.

Le bouton « Retirer le bénévole » supprime le prénom sans supprimer la tâche.

La suppression d'une tâche supprime également le prénom associé.

Le contenu de req.body n'est pas écrit dans les logs.

Aucun outil de statistiques ou de publicité n'est utilisé.

Aucune variable VITE_ ne contient de secret.

Les mots de passe et identifiants de base de données ne sont pas présents dans le dépôt.

# Questions de sécurité et de confidentialité

# Pourquoi aucune variable VITE_ ne contient de secret ?

Les variables commençant par VITE_ sont utilisées par le frontend et leurs valeurs peuvent être intégrées dans le code envoyé au navigateur.

Elles ne doivent donc jamais contenir de mot de passe, de clé privée ou d'autre secret.

Dans cette application, VITE_API_URL contient uniquement l'adresse publique de l'API.

Les informations sensibles de connexion à PostgreSQL sont conservées côté serveur avec des variables d'environnement et des secrets du fournisseur d'hébergement.

Pourquoi la validation du frontend ne suffit-elle pas ?
Le frontend peut être modifié ou contourné par l'utilisateur.

Un utilisateur peut envoyer directement une requête HTTP à l'API sans passer par les formulaires React.

La validation doit donc également être effectuée côté serveur.

L'API utilise Joi pour vérifier les données reçues avant de les enregistrer dans PostgreSQL.

Pourquoi l'application n'a-t-elle pas besoin de bandeau cookies ?
L'application n'utilise pas de cookies de suivi, de publicité, de pixels publicitaires ou d'outil de statistiques nécessitant un consentement.

Elle ne contient pas non plus de script tiers de traçage.

Il n'y a donc pas de cookies de suivi nécessitant l'affichage d'un bandeau de consentement.

# Tests de qualité

### Lighthouse

Un audit Lighthouse a été réalisé sur l'application.

Rayan EL ALAOUI