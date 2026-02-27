Explication et l'ordre de création de ce projet :
J'ai créé ce projet en utilisant vite puis en installant la dépendance Tailwind.

En 1er j'ai d'abord créer la page d'inscription (register) puis se connecter (login).

Je me suis ensuite créer une database sur firebase afin de récuperer les clef API
J'ai aussi direct installé la dependance de react hook form pour me facilité dans la création des formulaires.
J'ai créé les ensuite les deux hook avec useLogin et useRegister afin de lié mes données et pour lié le tout, j'ai créé
dans firebase, config.js pour récupérer mes clef API

J'ai ensuite commencé à créer ma page Home en suivant le shéma que j'avais fait.
Cette page se distingue en 3 parties. A gauche, le nom, le logo ainsi que quelques champs non implémenté. C'est juuste pour faire beau et pas trop vide.
Au centre, c'est la partie post, création de post et les post visible créé par l'utilisateur.
A droite, le bouton se déco (normalement il devrait être caché afin de garder les user connectés...) puis un bandeau pour de la Pub et des personnes/grp à suivre
Ne connaissant absolument pas twitter, j'ai fait au plus simple.

=> Un de mes objectifs, ne pas utilisé une seule classe css, mais uniquement tailwind

=> Bien séparé les feuilles pour respecte un semblant de MVC

=> Faire des commits régulièrement pour que le projet reste tjs en sécurité sur GitHub

Elément à faire :
=> Mettre un logo et favicon
=> Améliorer le design
