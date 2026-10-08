# Plan du projet : application de rencontres et d'amitié

> Statut : **brouillon à valider**. On ne commence pas à coder tant que ce plan n'est pas validé.
> Nom provisoire de l'application : **[NOM]**. À choisir, voir la section 13.

---

## 1. Vision

Une application mondiale de rencontres, d'amitié et de salons vocaux, réservée aux 18 ans et plus.
Elle reprend ce qui marche chez SUGO (découverte, Moments, salons vocaux, cadeaux, jeux, niveaux)
mais elle est **plus belle, plus honnête et plus sûre**.

**Promesse aux utilisateurs :** « Ici, les profils sont vrais. »

### Ce que les avis Play Store reprochent à SUGO, et notre réponse

| Problème constaté (avis et captures)                                      | Notre réponse                                                                         |
|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------|
| « Faux profils », « photos générées par IA », « 50 000 nanas en contact dès l'installation » | Selfie vidéo obligatoire pour obtenir le badge vérifié. Détection des photos IA ou volées. Aucun message automatique envoyé en masse. |
| Arnaqueuses qui demandent des tickets Transcash                           | Détection automatique des mots « Transcash », « PCS », « carte cadeau », « Western Union »… avec un avertissement et un signalement. Bannissement rapide. |
| « Pseudo chat très cher », « 6000 pièces perdues »                        | Prix affichés clairement avant chaque action. Historique des dépenses. Limite de dépense que l'utilisateur peut régler. |
| Messages bloqués sans explication (le point rouge sur vos messages WhatsApp) | Règle claire et affichée : l'échange de contacts se débloque après un vrai échange entre les deux personnes (voir 6.4). |
| Comptes payés pour faire dépenser (les « hôtesses » d'agence)             | Ces comptes existent, mais ils portent un badge visible **« Hôte »**. L'utilisateur sait à qui il parle. |
| Service client absent, réponses copiées-collées dans la mauvaise langue (turc, espagnol…) | Support dans la langue de l'utilisateur. Suivi des tickets dans l'application. |

---

## 2. Public et règles de base

- **Monde entier**, sans pays privilégié.
- **Interdit aux moins de 18 ans** :
  - date de naissance obligatoire à l'inscription, refus en dessous de 18 ans ;
  - estimation de l'âge pendant le selfie de vérification ;
  - signalement « mineur probable » traité en priorité, avec suspension immédiate.
- **Langues au lancement :** français, anglais, espagnol, portugais, arabe (affiché de droite à gauche).
  Ensuite : allemand, turc, russe, hindi, indonésien.
- **Traduction automatique des messages**, avec un bouton « Traduire » sous chaque message. Les avis montrent que c'est un vrai problème chez SUGO.
- **Filtres de découverte :** distance, pays, langue, âge et intention (amour, amitié, discussion).

---

## 3. Structure de l'application (5 onglets, comme SUGO)

### 3.1 Accueil (découverte)
- Sous-onglets : **Pour toi**, **Nouveaux**, **En ligne**, **Près de moi**.
- Carte de profil : photo, prénom, âge, pays (drapeau), langues parlées, badge vérifié, badge VIP, badge « Hôte » si c'est le cas.
- Bouton **« Hi »**, gratuit, avec une limite par jour pour éviter le spam.
- Mode **« Swipe »** en option : glisser à droite ou à gauche, comme Tinder. Un « Match » se crée quand les deux personnes aiment.
- Barre de recherche par pseudo ou par identifiant.

### 3.2 Moments (fil social)
- Publications avec photos (jusqu'à 9), courte vidéo (jusqu'à 60 s) et texte.
- J'aime, commentaires, partage, et cadeau sur une publication.
- Sous-onglets : **Pour toi**, **Abonnements**, **Près de moi**.
- **Stories de 24 h** : une nouveauté par rapport à SUGO.

### 3.3 Salons (chat vocal en groupe)
- Salons vocaux de 8 à 16 micros, avec un propriétaire et des administrateurs.
- Catégories : Chat, Amitié, Musique, Jeux, Rencontre.
- Cadeaux animés envoyés en direct, classement des donateurs du salon.
- **Jeux intégrés au salon** : Ludo, quiz, « action ou vérité » (voir la section 5).
- Bannière **Événements** en haut de l'onglet.
- Salons vidéo en direct (live) : prévus en phase 3.

### 3.4 Messages
- Filtres : Tout, En ligne, Non lus, Matchs, Suivis.
- Texte, émojis, autocollants, messages vocaux, photos.
- Photos éphémères qui disparaissent après avoir été vues.
- Appel vocal et appel vidéo en tête-à-tête.
- Bouton de cadeau dans la conversation.
- **Niveau d'intimité** : il monte avec les échanges et débloque l'album privé, l'appel vidéo, etc.
- Accusés de lecture (option VIP).
- Notifications d'interaction regroupées (j'aime, visiteurs, abonnés).

### 3.5 Moi (profil)
- Profil : photos (jusqu'à 9), bio, présentation audio, centres d'intérêt, taille, profession, pays, langues.
- Compteurs : abonnements, amis, abonnés, visiteurs.
- **Portefeuille** : pièces, diamants, bouton Recharger.
- **VIP / SVIP** (voir 4.4).
- Outils : Tâches, Visiteurs, Famille, Classements.
- **Jeux** : grille d'accès aux jeux.
- Marché, Sac à dos, Mon niveau, Activités, Agence (pour les hôtes).
- Paramètres : compte et sécurité, notifications, langue, confidentialité (masquer la distance, l'état en ligne, les visites), limite de dépense, comptes bloqués, supprimer le compte.
- Centre d'aide : Compte, Recharge, Récompenses, Messagerie, Jeux, Hôtes et agences, Autre.

---

## 4. Économie de l'application

### 4.1 Les monnaies

| Monnaie              | Comment l'obtenir                                                     | À quoi elle sert                                    |
|----------------------|-----------------------------------------------------------------------|-----------------------------------------------------|
| **Pièces d'or** 🪙   | Achat en argent réel, bonus d'arrivée, tâches quotidiennes, gains de jeux | Cadeaux, appels, jeux, Marché, mises en avant        |
| **Diamants** 💎      | Reçus quand quelqu'un vous offre un cadeau                            | Échange contre des pièces, **retrait d'argent (hôtes uniquement)** |
| **Points de niveau** | Gagnés en dépensant (richesse) ou en recevant (charme)                | Niveaux et privilèges                                |

### 4.2 Bonus d'arrivée : beaucoup de pièces au départ, qui partent vite

C'est ce que vous avez demandé. Le principe :

- **Bonus de bienvenue : 2 000 pièces**, offertes à l'inscription.
- **+500 pièces** quand le profil est complété : 4 photos, bio, taille, profession, pays.
- **+500 pièces** pour la vérification par selfie. Ça pousse les gens à se faire vérifier.
- **Total possible au départ : 3 000 pièces.**

Le coût des actions est réglé pour que ces 3 000 pièces durent **environ 1 à 2 jours** d'utilisation active.
Exemples : quelques cadeaux, 10 minutes d'appel vidéo, quelques parties de jeu.
L'utilisateur découvre toutes les fonctions, puis il recharge, prend un abonnement VIP ou fait ses tâches quotidiennes.

> ⚠️ **Mise en garde importante.** Les avis 1 étoile de SUGO viennent justement de là : « très cher », « 6000 pièces perdues », « il faut payer à un moment ».
> Pour que des pièces qui s'épuisent vite ne deviennent pas de mauvaises notes, on applique trois règles :
> 1. **Le prix est toujours affiché avant de payer**, par exemple « Appel vidéo : 60 🪙/min ».
> 2. **Les fonctions de base restent gratuites** : profil, découverte, Hi, Moments, messages texte entre deux personnes qui ont matché.
> 3. **Des pièces gratuites chaque jour** grâce aux tâches, pour que les gens reviennent même sans payer.

### 4.3 Grille de prix (proposition, à ajuster)

**Packs de pièces** (prix de référence en dollars US, adaptés à chaque pays par les magasins d'applications) :

| Pack            | Pièces  | Bonus  | Prix      |
|-----------------|---------|--------|-----------|
| Découverte      | 600     | –      | 0,99 $    |
| Petit           | 3 300   | +10 %  | 4,99 $    |
| Moyen           | 7 000   | +15 %  | 9,99 $    |
| Grand           | 36 000  | +20 %  | 49,99 $   |
| Énorme          | 75 000  | +25 %  | 99,99 $   |
| **1re recharge** | ×2 pièces sur le premier achat | | |

**Coût des actions :**

| Action                                   | Coût           |
|------------------------------------------|----------------|
| Hi / like / message texte après un match | Gratuit        |
| Message à quelqu'un sans match           | 20 🪙 (gratuit pour les VIP, dans une limite par jour) |
| Appel vocal en tête-à-tête               | 30 🪙 / min    |
| Appel vidéo en tête-à-tête               | 60 🪙 / min    |
| Cadeaux                                  | de 10 à 50 000 🪙 |
| Mise en avant du profil (30 min)         | 300 🪙         |
| Voir qui a visité mon profil             | VIP, ou 100 🪙 |
| Parties de jeux                          | de 0 à 1 000 🪙 selon le mode |

### 4.4 VIP (abonnement mensuel)

| Niveau   | Prix / mois | Avantages principaux |
|----------|-------------|----------------------|
| **VIP**  | 9,99 $      | 3 000 🪙 offertes par mois, messages sans match gratuits (50/jour), voir les visiteurs, accusés de lecture, badge, cadre de profil |
| **SVIP** | 29,99 $     | Tout le VIP, plus 12 000 🪙/mois, messages illimités, mise en avant hebdomadaire, cadeaux exclusifs, effet d'entrée dans les salons, identifiant personnalisé |

### 4.5 Cadeaux et diamants

- Quand quelqu'un reçoit un cadeau, **60 % de sa valeur** lui revient en diamants. Le reste couvre les frais des magasins (15 à 30 %) et la marge.
- Les diamants s'échangent contre des pièces : environ 3 💎 pour 1 🪙, comme chez SUGO.
- **Retrait d'argent réel** : réservé aux comptes **Hôte** vérifiés (identité complète), avec un seuil minimum.
  Paiement par PayPal, virement ou Mobile Money selon le pays.

### 4.6 Hôtes et agences

- Un « Hôte » est une personne payée pour animer, discuter et faire des salons. C'est le modèle qui rapporte le plus chez SUGO.
- **Différence avec SUGO : la transparence.** Le profil d'un hôte porte un badge **Hôte** visible.
- Les agences recrutent des hôtes et touchent une commission sur leurs gains.
- **Interdit aux hôtes** : se faire passer pour un utilisateur ordinaire, promettre des rencontres physiques, demander de l'argent en dehors de l'application. La sanction est un bannissement définitif.

### 4.7 Niveaux

- **Niveau de richesse** (pour ceux qui dépensent) et **niveau de charme** (pour ceux qui reçoivent) : 50 niveaux chacun.
- Les privilèges se débloquent par paliers : étiquette, cadres, cadeaux exclusifs, effets d'entrée, priorité dans les listes.

### 4.8 Tâches quotidiennes (pièces gratuites)

- **Tâches pour débutants**, une seule fois : photos, statut, taille, profession, pays, audio. De 50 à 500 🪙.
- **Tâches quotidiennes**, environ 150 🪙 par jour au total : connexion, dire bonjour à 3 personnes, publier un Moment, rester 5 min dans un salon, jouer 1 partie, envoyer 1 cadeau.
- **Série de connexions** : jour 7 = gros bonus.
- **Parrainage** : 500 🪙 pour le parrain et pour le filleul quand le filleul se fait vérifier.

> Contrairement à SUGO, les tâches ne parlent pas de « filles ». On écrit « dire bonjour à 3 personnes ». L'application est pour tout le monde.

### 4.9 Marché et Sac à dos

- Le Marché vend des cadres d'avatar, des effets d'entrée, des bulles de chat, des fonds de salon, des noms animés, des identifiants spéciaux et des bagues « Ami » ou « Couple ».
- Les objets achetés vont dans le **Sac à dos**. Certains sont permanents, d'autres durent 7 ou 30 jours.

---

## 5. Jeux

### 5.1 Deux modes pour chaque jeu
- **Mode gratuit** : on joue pour le plaisir, sans mise. Ça donne des points de classement et parfois de petites récompenses.
- **Mode avec pièces** : chaque joueur mise des pièces, le gagnant remporte la cagnotte, moins une commission de 10 %.

### 5.2 Jeux proposés

**Jeux à plusieurs** (dans les salons ou en tête-à-tête) :
- Ludo
- Dominos
- Morpion et Puissance 4
- Dames et échecs rapides
- Quiz de culture générale, en plusieurs langues
- Devine le dessin (style Pictionary)
- Action ou vérité, en version « brise-glace » pour les rencontres
- Uno-like : jeu de cartes de couleurs, avec un nom et un design originaux

**Mini-jeux en solo** :
- Roue de la fortune quotidienne, **gratuite**, 1 tour par jour
- Coffres de connexion

### 5.3 ⚠️ Point légal très important : les jeux de hasard

SUGO propose des machines à sous, la roulette, « Crash Rocket », « Lion ou Tigre »… Dans ces jeux, on mise des pièces achetées avec de l'argent réel et le résultat dépend du hasard.
Chez SUGO, les pièces peuvent finir en diamants, puis en argent réel. **Ces jeux deviennent alors des jeux d'argent au sens de la loi.**
- C'est interdit sans licence de casino dans la plupart des pays (France, États-Unis, Royaume-Uni, une grande partie de l'Afrique et du Moyen-Orient…).
- Google Play et l'App Store suppriment les applications qui le font sans licence.
- Le risque : suppression de l'application, amendes, poursuites.

**Ce que je propose :**
1. Des **jeux d'adresse et de réflexion** (Ludo, dominos, dames, quiz…), avec ou sans mise de pièces.
2. **Aucune machine à sous, aucune roulette, aucun « crash » où l'on mise des pièces achetées.**
3. La roue quotidienne reste **gratuite**. Elle ne coûte rien et ne s'achète pas.
4. On rappelle les règles de jeu responsable : limite de mise par jour, historique visible.

Ce choix nous protège et devient un argument : « Pas de casino déguisé ».
Si vous voulez quand même des jeux de hasard payants plus tard, il faudra consulter un avocat et obtenir une licence.

---

## 6. Sécurité et confiance (notre plus grand avantage)

### 6.1 Vérification
- **Selfie vidéo en direct** : on demande de tourner la tête ou de cligner des yeux, puis on compare avec les photos du profil. Ça donne le badge ✔ Vérifié.
- Vérification du numéro de téléphone ou de l'e-mail obligatoire.
- Vérification d'identité complète (pièce d'identité) **obligatoire pour les Hôtes** et pour retirer de l'argent.

### 6.2 Détection des faux profils
- Recherche des photos volées sur Internet (recherche d'image inversée).
- Détection des visages générés par IA.
- Détection des comportements de robot : 100 « Hi » en 5 minutes, messages copiés-collés.
- **Aucun faux compte ni robot créé par l'application elle-même.** C'est une règle absolue.

### 6.3 Anti-arnaque
- Détection automatique de mots dans les messages : Transcash, PCS, Neosurf, carte cadeau, Western Union, crypto, « envoie-moi de l'argent ».
- Quand c'est détecté, un **bandeau d'avertissement** s'affiche pour celui qui reçoit le message : « Attention, ne payez jamais quelqu'un en dehors de l'application ».
- Le compte suspect est signalé automatiquement aux modérateurs.
- Bouton **Signaler** visible dans chaque conversation et sur chaque profil.

### 6.4 Échange de contacts (WhatsApp, téléphone…)
SUGO bloque ces messages sans explication. On l'a vu dans votre conversation avec les points rouges.
**Notre règle, claire et affichée :**
- Pendant les **premiers échanges**, les numéros et liens externes sont masqués. Ça protège contre les arnaqueurs, qui veulent sortir de l'application tout de suite.
- C'est **débloqué** quand les deux personnes sont vérifiées et ont échangé un minimum de messages (par exemple niveau d'intimité 3).
- Un message explique la règle à l'utilisateur au lieu de bloquer en silence.

### 6.5 Modération
- Modération automatique des photos (nudité, violence) et du texte (insultes, haine).
- Équipe de modérateurs humains pour les signalements, avec une réponse en moins de 24 h.
- Sanctions graduées : avertissement, suspension, bannissement. Bannissement immédiat pour les mineurs, les arnaques et les contenus illégaux.

### 6.6 Contrôle pour l'utilisateur
- Bloquer quelqu'un ou le masquer.
- Choisir qui peut m'écrire : tout le monde, les vérifiés, les matchs seulement.
- Masquer ma distance et mon état « en ligne ».
- Limite de dépense par jour ou par mois.
- Supprimer mon compte et mes données en un clic.

---

## 7. Design : plus beau que SUGO

- **Style** : moderne, lumineux, doux. Dégradés violet, rose et corail, coins arrondis, ombres légères, belles animations.
- **Mode clair et mode sombre.**
- **Typographie** lisible (par exemple Inter ou Poppins).
- **Icônes** dessinées sur mesure et cohérentes entre elles.
- **Animations** : cadeaux en plein écran (Lottie), confettis pour un match, effets d'entrée dans les salons.
- **Accessibilité** : bons contrastes, textes agrandissables.
- **Adapté à toutes les tailles** : téléphone, tablette, ordinateur.
- Avant de coder : une **maquette visuelle** des écrans principaux, à valider ensemble.

---

## 8. Architecture technique

| Partie                       | Technologie proposée                                              | Pourquoi |
|------------------------------|-------------------------------------------------------------------|----------|
| Site web et appli mobile web | **Next.js (React) + TypeScript**, en PWA installable sur le téléphone | Un seul code, rapide, bon référencement |
| Applications Android et iOS  | **Capacitor** (réutilise le code web), ou React Native plus tard   | Publication sur Play Store et App Store sans tout réécrire |
| Serveur (API)                | **Node.js (NestJS) + TypeScript**                                  | Même langage que le site, solide |
| Base de données              | **PostgreSQL**                                                    | Fiable pour les comptes, l'argent et les transactions |
| Cache et temps réel          | **Redis** + **Socket.IO**                                         | Messagerie instantanée, état « en ligne » |
| Appels et salons vocaux      | **LiveKit** (ou Agora)                                            | Audio et vidéo de qualité, partout dans le monde |
| Stockage photos et vidéos    | **Cloudflare R2** ou **AWS S3** + CDN                             | Rapide partout, pas cher |
| Paiements                    | **Google Play Billing**, **Apple In-App**, **Stripe** (site web), **Flutterwave / CinetPay** (Mobile Money), **PayPal** (retraits) | Couvrir le monde entier |
| Modération                   | Services de détection d'images et de texte + outil d'administration maison | Sécurité |
| Traduction                   | API de traduction automatique                                     | Messages entre langues différentes |
| Notifications                | **Firebase Cloud Messaging**                                      | Notifications sur le téléphone |
| Hébergement                  | Serveurs en Europe pour commencer (RGPD), puis d'autres régions    | Coût maîtrisé au départ |

**Panneau d'administration** (pour vous) : utilisateurs, signalements, vérifications, transactions, retraits des hôtes, statistiques (inscriptions, revenus, utilisateurs actifs), gestion des cadeaux, des événements et des prix.

---

## 9. Aspects légaux (à faire valider par un juriste)

- **Société** : il faudra une structure légale pour encaisser l'argent et publier sur les stores.
- **Conditions d'utilisation** et **politique de confidentialité**, dans toutes les langues.
- **RGPD** (Europe) et lois équivalentes ailleurs : consentement, droit à l'effacement, protection des données.
- **18 ans et plus** : vérification de l'âge et retrait immédiat des mineurs.
- **Jeux** : pas de jeux de hasard payants (voir 5.3).
- **Hôtes** : leurs gains sont des revenus. Contrats et obligations fiscales selon les pays.
- **Règles des stores** : Google et Apple ont des règles strictes pour les applications de rencontre (modération, signalement, suppression de compte).

---

## 10. Étapes du projet

| Phase | Contenu | Résultat |
|-------|---------|----------|
| **0. Plan et maquettes** | Valider ce plan, choisir le nom et les couleurs, dessiner les écrans | Plan validé et maquettes |
| **1. Base (MVP)** | Inscription (18+), profils, vérification par selfie, découverte, Hi et matchs, messagerie en temps réel, Moments, Paramètres, panneau d'administration de base | Site utilisable par de vrais testeurs |
| **2. Économie** | Pièces, bonus d'arrivée, tâches, cadeaux, diamants, VIP, Marché, Sac à dos, niveaux, paiements | Premiers revenus |
| **3. Salons et appels** | Salons vocaux, appels vocaux et vidéo en tête-à-tête, cadeaux animés, événements | Fonctions comme SUGO |
| **4. Jeux** | Ludo, dominos, quiz, morpion… en modes gratuit et avec pièces | Plus d'engagement |
| **5. Hôtes et agences** | Comptes Hôte, agences, retraits d'argent | Modèle qui rapporte le plus |
| **6. Applications mobiles** | Publication Android (Play Store) puis iOS (App Store) | Présence sur les stores |
| **7. Croissance** | Familles, classements, lives vidéo, nouvelles langues, marketing | Montée en puissance |

---

## 11. Coûts à prévoir (estimation de départ)

| Poste                                       | Coût approximatif |
|---------------------------------------------|-------------------|
| Nom de domaine                              | 10 à 20 $ / an    |
| Serveurs (début, peu d'utilisateurs)        | 20 à 100 $ / mois |
| Appels audio et vidéo (LiveKit / Agora)     | Selon l'usage, souvent gratuit au tout début, puis quelques centimes par minute |
| Compte développeur Google Play              | 25 $ (une seule fois) |
| Compte développeur Apple                    | 99 $ / an         |
| Vérification de selfie et modération        | Quelques centimes par vérification |
| Juriste (CGU, confidentialité)              | Variable, à prévoir |
| Marketing pour attirer les premiers utilisateurs | Le poste le plus important |

Ça monte avec le nombre d'utilisateurs, mais les revenus aussi.

---

## 12. Comment on mesurera le succès

- Nombre d'inscriptions et part des comptes vérifiés.
- Utilisateurs actifs par jour et par mois.
- Part des nouveaux utilisateurs encore là après 1 jour, 7 jours et 30 jours.
- Part des utilisateurs qui paient, et revenu moyen par utilisateur.
- **Note sur les stores : objectif 4,5 ★ ou plus** (SUGO : 4,0 ★ avec beaucoup d'avis 1 ★).
- Nombre de signalements d'arnaque, et délai de traitement.

---

## 13. Questions à trancher avant de coder

1. **Nom de l'application.** Il faut vérifier qu'il est libre (marque, nom de domaine, stores).
2. **Couleurs principales.** Violet et rose comme proposé, ou une autre identité ?
3. **Bonus d'arrivée.** 3 000 pièces au total, ça vous convient ?
4. **Prix des packs et du VIP.** OK pour la grille de la section 4.3, ou à modifier ?
5. **Jeux de hasard.** D'accord pour garder seulement des jeux d'adresse et de réflexion, plus la roue gratuite (voir 5.3) ?
6. **Hôtes payés.** On les affiche avec un badge « Hôte » (recommandé), ou pas ?
7. **Échange de contacts.** D'accord pour un déblocage après la vérification et quelques échanges (voir 6.4) ?
8. **Langues de départ.** Français, anglais, espagnol, portugais et arabe, ça vous va ?
9. **Votre rôle.** Vous savez programmer, ou je m'occupe de tout le code et je vous explique au fur et à mesure ?
