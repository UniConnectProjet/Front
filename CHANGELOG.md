# Changelog – Uni’connect Frontend

Toutes les dates sont au format AAAA-MM-JJ. Suivi selon SemVer.

## [v0.5.1] – 2025-08-22
### Modifié
- Mise à jour de la configuration **.env.production**.
- Nettoyage des fichiers sensibles (`.env.production.local` supprimé du repo).
- Ajustements de la configuration **ci.yml** pour la mise en production.

### Corrigé
- Fix sur les redirections d’URL et paramétrages liés à la production.

---

## [v0.5.0] – 2025-08-22
### Ajouté
- Intégration des nouvelles fonctionnalités côté front suite aux PR #29, #30, #31.
- Amélioration du routage et de la gestion des pages côté front.

### Modifié
- Mise à jour du `ci.yml` (ajustements pour MEP).
- Ajustement des URLs (`baseUrl`).

### Corrigé
- Corrections de bugs liés aux composants (professeur, location, eventCard, chatPage).

---

## [v0.4.2] – 2025-08-22
### Ajouté
- Ajout d’un nouveau composant **GetLocation** (intégré dans `eventCard`).
- Améliorations côté front pour la gestion des professeurs et locations.

### Modifié
- Mise à jour de la configuration CI/CD (`ci.yml`).
- Ajustement du `baseUrl` pour l’API.

### Corrigé
- Fix d’accès à la page **ChatPage** pour certains utilisateurs.

---

## [v0.4.0] – 2025-08-20
### Ajouté
- API Student intégrée côté front.
- Gestion des redirections d’URL entre front et back.
- Pages **Absences** et affichage des données (injustifiées, planning, etc.).

### Modifié
- Amélioration navigation et pages **Home**.
- Ajustements CI/CD (`ci.yml`) pour intégration front-back.
- Corrections ESLint et ajustement configuration.

### Corrigé
- Fix divers bugs (bad request, localhost, merge requests).

---

## [v0.3.0] – 2025-08-06 à 2025-08-18
### Ajouté
- Responsive design mobile : **Planning**, **Missing page**, **Connexion**, **Home**.
- Pages dynamiques : **Absences**, **Notes** selon utilisateur connecté.

### Modifié
- Intégration front ↔ back pour le planning et données absences.
- Amélioration des performances globales de l’application.

---

## [v0.2.0] – 2025-05-09 à 2025-06-25
### Ajouté
- Composants : **Grades**, **SideBar**, vues d’absences non justifiées.
- Vue absences intégrée avec PR #15 et #16.
- CI/CD amélioré et consolidé.

### Modifié
- Amélioration de l’affichage des cours et résultats (moyenne générale, différents cours).
- Début de la structure des pages principales.

---

## [v0.1.0] – 2024-12-25 à 2025-03-29
### Ajouté
- Initialisation de l’architecture frontend.
- Création de composants de base (**Button**, **Auth**, **Input**, **SVG assets**).
- Mise en place de **Dockerfile** pour le front.
- CI/CD initial + linting ESLint.

### Modifié
- Liaison front ↔ back pour login.
- Ajout et organisation des dossiers composants.
