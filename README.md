# Arena Sport

Boutique en ligne de produits de sport (ballons, vêtements, chaussures, accessoires), conteneurisée avec Docker et déployée sur une instance AWS EC2.

Projet réalisé dans le cadre du TP Cloud, ESATIC.

## Équipe

| Nom |
|-----|
| Ange Boli |
| Zécré | 

## Fonctionnalités

- Catalogue de 12 produits avec photos
- Filtres par catégorie, recherche et tri par prix
- Panier enregistré dans le navigateur
- Formulaire de commande
- Affichage adapté au téléphone

## Technologies

| Outil | Usage |
|-------|-------|
| HTML, CSS, JavaScript | Application web (sans framework) |
| Docker + nginx | Conteneurisation et service du site |
| Docker Hub | Stockage de l'image |
| AWS EC2 (Ubuntu 24.04) | Hébergement |
| Git et GitHub | Versionnement et travail en équipe |

## Structure du projet

```
arena-sport/
├── index.html     Structure de la page
├── style.css      Design
├── app.js         Produits, filtres, panier, commande
├── Dockerfile     Image Docker (nginx)
└── .dockerignore
```

## Lancer le projet en local

Sans Docker :

```bash
python -m http.server 8000
```
Puis ouvrir http://localhost:8000

Avec Docker :

```bash
docker build -t arena-sport .
docker run -d -p 8080:80 --name arena arena-sport
```
Puis ouvrir http://localhost:8080

## Étapes de réalisation

### 1. Créer l'application

Écriture de `index.html`, `style.css` et `app.js`. Les produits sont définis dans la liste `PRODUCTS` de `app.js`.

### 2. Conteneuriser avec Docker

Le `Dockerfile` copie le site dans une image nginx :

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

Construction et test en local :

```bash
docker build -t arena-sport .
docker run -d -p 8080:80 --name arena arena-sport
docker ps
```

### 3. Publier l'image sur Docker Hub

```bash
docker login
docker tag arena-sport angeboli/arena-sport:v1
docker push angeboli/arena-sport:v1
```

Image : https://hub.docker.com/r/angeboli/arena-sport

### 4. Créer l'instance AWS EC2

| Paramètre | Valeur |
|-----------|--------|
| AMI | Ubuntu Server 24.04 LTS |
| Type | t3.micro (Free tier) |
| Security group | SSH (22) et HTTP (80, depuis 0.0.0.0/0) |

### 5. Installer Docker sur le serveur

Connexion en SSH ou avec EC2 Instance Connect, puis :

```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
```

### 6. Déployer le conteneur

```bash
sudo docker pull angeboli/arena-sport:v1
sudo docker run -d --restart always -p 80:80 --name arena angeboli/arena-sport:v1
sudo docker ps
```

### 7. Accéder au site

Le site est accessible à l'adresse `http://52.47.197.111` (en http, sans https).


