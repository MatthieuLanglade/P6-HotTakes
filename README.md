# P6 - HotTakes

## Installations 
1. Installer le projet avec npm run install. 
2. Rajouter un fichier environnement .env qui innclus 4 constantes:
    - [PORT] : port d'utilisation pour le backend.
    - [TOKEN] : clé pour génération du token d'identification.
    - [IDENTIFIANTMONGO] : identifiant mongoDB. 
    - [MDPMONGO] : mot de passe mongoDB.
3. Démarrer le projet avec node app. 

## Infos  
Projet réalisé dans le cadre de la formation Développement Web par OpenClassroom [P6].  
Contenu images, dossier node_modules & .env ignorés.

## Versions 

### v1.0.1 - Sécurité

* Mise en place environnement avec dotenv:
    - Identifiant Mongo
    - Mot de passe Mongo
    - Port
    - Token pour génération du token du webtoken
* Sécurité :
    - Mise en place Helmet pour protection des en-têtes
    - Regex sur login + signup (email)
    - Ajout Password Validator (+liste password blacklistés, à épurer)
    - Express Rate Limit sur login

### v1.0.0 - Fonctionnalités de base.

* Mise en place Back-end.
    - Affichage des éléments, 
    - Affichage d'un élément, 
    - Création identifiant + mot de passe,
    - Connexion, 
    - Création 1 élément, 
    - Modification, 
    - Suppression, 
    - Gestion Likes/Dislikes.