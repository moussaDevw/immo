# MusaTech Real Estate 🏢🇸🇳
> **Démonstration commerciale conçue par MusaTech** pour présenter aux agences immobilières du Sénégal une plateforme moderne de publication de biens et de gestion des demandes de visite.

---

## 🌟 Présentation du Produit

**MusaTech Real Estate** est une solution web haut de gamme, réactive et interactive conçue pour répondre aux attentes des agences immobilières, promoteurs et investisseurs opérant à Dakar et au Sénégal.

Elle démontre l'intégralité du parcours client et gestionnaire :
1. **Découverte :** Présentation immersive des biens d’exception (villas d’architecte, penthouses vue mer, duplex contemporains, plateaux de bureaux d'affaires).
2. **Recherche & Filtres multi-critères :** Filtres en temps réel par quartier de Dakar (Almadies, Ngor, Mamelles, Point E, Mermoz, Plateau, Sacré-Cœur), type de transaction (Vente / Location), type de bien, fourchette budgétaire en FCFA (XOF), nombre de chambres, surface minimale et équipements premium.
3. **Fiche détaillée :** Galerie photo interactive haute définition, caractéristiques certifiées, points forts, situation cadastrale (titre foncier), charges et contact direct avec l'agent assigné (Appel direct & WhatsApp).
4. **Demande de visite interactive :** Prise de rendez-vous en présentiel ou en vidéo WhatsApp (pensée pour la diaspora), choix de date et créneau horaire, validation en temps réel avec numéro de dossier.
5. **Espace Gestionnaire Agence (Back-office) :** Cockpit d'administration avec KPIs d'activité, pipeline de traitement des demandes de visite (En attente, Confirmée, Terminée, Annulée), ajout de notes internes de suivi et gestion complète du portefeuille d'annonces (création, modification, suppression, bascule de statut).

---

## 🎨 Charte Graphique & Design System

L'application applique une identité visuelle sobre, contemporaine et statutaire :
- **Navy Profond :** `#0B1730` (surfaces principales, en-têtes, sidebar)
- **Bleu Secondaire :** `#172A46` (surfaces intermédiaires et cartes)
- **Cyan MusaTech :** `#19B8CD` (accents d'action, surbrillances et badges)
- **Blanc & Gris Froids :** `#FFFFFF`, `#F8FAFC`, `#F1F5F9`, `#E2E8F0` (surfaces claires et contrastées)
- **Typographie :**
  - Titres : **Manrope** (Google Fonts)
  - Textes & Chiffres : **Inter** (Google Fonts)
- **Devise :** Franc CFA (XOF) formaté selon les normes locales (ex: `780 000 000 FCFA`, `1 800 000 FCFA / mois`).
- **Accessibilité :** Labels de formulaires explicites, navigation clavier, focus rings, contrastes WCAG AA et adaptation responsive fluide (mobile, tablette, desktop).

---

## 📍 Portefeuille & Quartiers de Dakar

La démonstration embarque **19 biens immobiliers réalistes** (17 publiés, 1 brouillon, 1 archivé) et **7 demandes de visite** réparties sur les micromarchés les plus demandés de Dakar :
- **Almadies :** Villas contemporaines avec piscine miroir, penthouses panoramiques face à l'Océan, terrains viabilisés en zone diplomatique.
- **Ngor :** Propriétés pieds dans l'eau avec ponton d'amarrage, appartements standing vue baie.
- **Mamelles :** Villas d'architecte avec roof-terrace vue Phare des Mamelles, duplex meublés italiens, parcelles d'angle vue mer.
- **Point E :** Résidences de prestige avec rooftop suspendu, plateaux de bureaux modulables pour sièges d'entreprise.
- **Mermoz :** Appartements familiaux calmes proches écoles d'élite, villas avec jardin arboré, bureaux axe VDN.
- **Plateau :** Penthouses vue baie de Gorée, bureaux rénovés au cœur du quartier des affaires.
- **Sacré-Cœur :** Villas d'angle familiales, appartements F3 contemporains sécurisés.

---

## ⚙️ Stack Technique & Architecture

- **Framework :** React 19 (Hooks, Context, composants fonctionnels stricts)
- **Langage :** TypeScript (mode strict, `verbatimModuleSyntax: true`)
- **Build Tool :** Vite 8 avec HMR instantané
- **Styling :** Tailwind CSS v4 avec thème personnalisé et tokens de couleur
- **Icônes :** Lucide React
- **Linter :** Oxlint (0 warning, 0 error)
- **Persistance :** Moteur réactif local `localStorage` avec auto-seeding et réinitialisation en un clic.

### Structure des dossiers
```
src/
├── types/              # Interfaces TypeScript strictes (Property, VisitRequest, FilterState...)
├── data/               # Données de démonstration initiales (14 biens Dakar, 5 demandes)
├── services/           # Service de stockage local StorageService, formatage CFA et dates
├── context/            # État global réactif (AppContextDef, useApp, AppProvider)
├── components/
│   ├── common/         # Navbar, Footer, DemoBanner, Toast, AdminAuthModal
│   ├── public/         # Hero, CatalogView, PropertyCard, PropertyDetailView, VisitBookingModal, NeighborhoodsSection, FeaturedProperties
│   └── admin/          # AdminLayout, AdminDashboard, AdminProperties, PropertyFormModal, AdminRequests, RequestDetailModal, AdminDemoSettings
├── App.tsx             # Routeur applicatif & orchestration des vues et modales
├── index.css           # Thème Tailwind v4 et polices Manrope / Inter
└── main.tsx            # Point d'entrée React 19
```

---

## 🔒 Sécurité & Mode Démonstration

- **Zéro Secret :** Aucun token sensible, mot de passe de production ou clé API n'est exposé.
- **Authentification Démo :** L'accès gestionnaire est fourni avec un compte pré-rempli (`admin@musatech.sn`) explicitement étiqueté comme session locale de démonstration commerciale.
- **Recommandation Production :** Pour un déploiement commercial auprès d'une agence cliente, la plateforme sera raccordée à une API sécurisée (tokens JWT HttpOnly, hash de mot de passe Argon2/bcrypt, base de données PostgreSQL / Prisma et validation de schémas Zod).

---

## 🚀 Démarrage Rapide (Commande Unique)

### Lancer la démonstration commerciale
Le projet démarre en **une seule commande** :
```bash
npm start
# ou
npm run dev
```
L'application est immédiatement accessible dans votre navigateur à l'adresse : **`http://localhost:5173/`**

### Réinitialisation du jeu de données démo
Pour repartir d'un jeu de données neuf lors d'un rendez-vous client, cliquez sur **« Réinitialiser démo »** dans la bannière supérieure, ou exécutez dans la console du navigateur :
```javascript
localStorage.clear(); window.location.reload();
```

### Autres commandes de validation
```bash
# Lancer l'intégralité des 114 tests automatisés (14 suites)
npm test

# Contrôle qualité et conformité Oxlint (0 erreur, 0 warning)
npm run lint

# Compiler pour la production
npm run build
```

---

*MusaTech Real Estate — Démonstration conçue par MusaTech pour les agences immobilières du Sénégal.*
# immo
