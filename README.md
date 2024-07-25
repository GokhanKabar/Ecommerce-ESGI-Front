# Challenge semestre 2 ESGI Groupe 15
## Projet : Site E-commerce de Parfums de Luxe   

## Auteurs
### Ali KHELIFA (alikhelifa15) : 
akhelifa7@myges.fr
### Gokhan Kabar  :
gokhankabar@hotmail.fr
### Mohammad GONS SAIB :
mohagonssaib@gmail.com



### Fonctionnalités ALI khelifa
##### Remarque : j'ai deux  commits qui ne sont pas signés au début, sans faire attention. 
- Mise en place du projet d'intégration Tailwind CSS, création du defaultLayout front et back-end.
- Registration with confirmation by email,Login and prevention of connection if the account is not confirmed,Password reset Account access timeout after three unsuccessful attempts and notification.

1. Mise en place du projet d'intégration Tailwind CSS.
2. Création de header un footer pour .
3. Authentification.
   - Inscription avec confirmation par mail.
   - Connexion et prévention de la connexion si le compte n’est pas confirmé.
   - Réinitialisation du mot de passe.
   - Intégration des recommandations de la CNIL concernant la sécurité des mots de passe pour un site e-commerce Mot de passe de 12   caractères minimum avec symboles, chiffres, lettres minuscules et majuscules.
   - Temporisation d’accès au compte après trois tentatives infructueuses et notification par mail.
   - Demande de renouvellement du mot de passe 60 jours après la création du compte ou date du dernier changement du mot de passe
     Conservation des mots de passes hachés.
   - Formulaire de connexion et de déconnexion, modification de mot de passe (front) .  
4. Suppression de compte
   - Trouver une solution pour conserver les données d’un utilisateur en les rendant anonymes
   - Il doit être possible de se créer de nouveau un compte avec les mêmes informations
   - données à l’inscription (après une suppression), dans ce cas les anciennes informations ne doivent pas être accessible par  l’utilisateur (puisqu’elles sont anonymisées).
   - Intégration des directives liées à la RGPD suivant la suppression d’un compte.
5. Gestion des Rôles :
   - ROLE_USER : client classique.
   - ROLE_STORE_KEEPER : gestion des stocks.
   - ROLE_ADMIN : accès au panel admin.   
6. Sécurisation des routes front.    
7. Ajout de la page d'erreur 404.
8. Mise en place du projet d'intégration Tailwind CSS.
9. Création du header et du footer pour le site.
10. Création de la sidebar et du header pour le dashboard.
11. Création des composant (Alerts,Breadcrumbs,Buttons,Charts,DataStats,Forms,Loaders,Popup,icons).
12. Mise en place d'un process de denormalisation SQL → Mongo (product,brand,family). 
13. Création de la base de données (Sequelize),Mise en place d'un système de migration SQL.
14. CRUD USER.
15. Middlewares pour check authentification et role .
16. cookies pop up .
17. Page marque front back .
19. Statistique front back.
20. Page contact front.
21. Page profil.


### Fonctionnalités Gokhan Kabar:
1. Gestion d’alerte par mail (Front + Back)
- Sur des nouveau produit d’une catégorie
- Sur le restock d’un produit
- Sur les changements de prix
- Pouvoir désactiver chacune des alertes mail selon les préférences d’un utilisateur et
les respecter

2. Front admin
- Page Familles
- Page Marques
- Page Produits
3. Back
- CRUD Produits
- CRUD Familles
- CRUD Marques
- Sécurisation API produits,familles,marques
- Upload image (back + front)
4. Deploiement prod (branch prd)
- mise en place de nginx sur docker
- mise en place du certificat ssl
- déploiement du projet sur la vm

### Fonctionnalités Mohammad GONS SAIB:
1. Page d'accueil
2. Page produits parfum homme et femme
3. Page produit détails parfum
4. Ajout de mongo dans le docker et affichage des data en front avec mongoose avec la collection Product
5. Ajout de la recherche global sur les produits
6. Ajout du paiement avec stripe + ajout du webhook stripe pour mettre à jour le stock et création de la commande + implémentation de  la sécurité sur le panier et la quantité d’un produit
7. Ajout des pages mention legale, cgu-cgv, protection data and security paiement page for gdpr
8. Ajout du remboursement avec stripe sur la commande

