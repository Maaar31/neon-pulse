# 🎮 NEON PULSE

<div align="center">

![Neon Pulse](https://img.shields.io/badge/Game-Neon%20Pulse-00ffff?style=for-the-badge)
![Version](https://img.shields.io/badge/Version-2.0-ff00ff?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Complete-00ff00?style=for-the-badge)

**Un shooter arcade roguelite cyberpunk intense jouable dans votre navigateur**

[🎯 Jouer Maintenant](#-comment-jouer) • [✨ Fonctionnalités](#-fonctionnalités) • [🎮 Contrôles](#-contrôles) • [🏆 Stratégie](#-guide-stratégique)

</div>

---

## 📖 Description

**Neon Pulse** est un shooter arcade roguelite avec une esthétique cyberpunk néon. Affrontez des vagues infinies d'ennemis, collectez des crédits, améliorez votre vaisseau et survivez le plus longtemps possible dans un univers de particules lumineuses et d'explosions spectaculaires.

### 🎯 Objectif

Survivre aux vagues d'ennemis progressivement plus difficiles, accumuler le meilleur score possible, et débloquer des améliorations puissantes pour devenir imbattable.

---

## ✨ Fonctionnalités

### 🎮 Gameplay Roguelite Complet

- **Système de Progression** : Ennemis qui évoluent (+15% stats par vague)
- **Monnaie Séparée** : Crédits pour achats, Score pour classement
- **Boutique d'Améliorations** : 7 upgrades avec niveaux max
- **Boss Waves** : Boss géant tous les 5 niveaux
- **Power-ups Temporaires** : Invincibilité, Rapid Fire, Nuke

### 🎨 Effets Visuels Impressionnants

- **Screen Shake** : Feedback visuel sur tous les impacts
- **Trails Lumineux** : Traînées pour joueur et projectiles
- **Background Animé** : Grille cyberpunk pulsante
- **Particules Avancées** : 15+ particules par explosion
- **Damage Numbers** : Nombres flottants sur dégâts
- **Glow Effects** : Effets néon sur tous les éléments

### 🎯 Mécaniques de Combat

- **4 Types d'Ennemis** :
  - 🟥 **Chaser** : Rapide et agressif
  - 🟨 **Shooter** : Tire des projectiles
  - 🟪 **Tank** : Lent mais résistant
  - ⭐ **Boss** : Énorme et dangereux

- **Système de Combo** : Multiplicateur de score (timeout 3s)
- **Dash/Esquive** : Mouvement rapide avec cooldown
- **Tir Multiple** : Jusqu'à 4 balles simultanées

### 🎵 Audio Procédural

- Sons générés via Web Audio API
- Pas de fichiers externes requis
- Feedback audio sur chaque action

---

## 🎮 Contrôles

| Touche | Action |
|--------|--------|
| **WASD** ou **Flèches** | Déplacement |
| **Souris** | Viser |
| **Clic Gauche** | Tirer (maintenir) |
| **ESPACE** | Dash (cooldown 2s) |
| **ÉCHAP** | Pause |

---

## 🚀 Comment Jouer

### Installation

1. **Clonez ou téléchargez** ce repository
2. **Ouvrez** `index.html` dans votre navigateur
3. **C'est tout !** Aucune installation requise

### Lancement Rapide

```bash
# Ouvrir directement dans le navigateur
start index.html  # Windows
open index.html   # macOS
xdg-open index.html  # Linux
```

Ou simplement **double-cliquez** sur `index.html`

---

## 🏆 Guide Stratégique

### 🌟 Early Game (Vagues 1-5)

**Priorités** :
1. ✅ Acheter **Cadence de Tir** (tir rapide)
2. ✅ Investir dans **Dégâts des Balles**
3. ✅ Maintenir le **Combo** actif
4. ✅ Collecter **tous les crédits**

**Conseils** :
- Utilisez le Dash pour **esquiver**, pas pour attaquer
- Gardez vos distances avec les Shooters
- Les Tanks donnent beaucoup de crédits

### ⚡ Mid Game (Vagues 6-10)

**Priorités** :
1. ✅ **Santé Maximale** pour survivabilité
2. ✅ **Vitesse de Déplacement** pour mobilité
3. ✅ Commencer **Tir Multiple**

**Conseils** :
- Les Power-ups deviennent **cruciaux**
- Boss Vague 10 : Gardez un **Nuke** si possible
- Combo x10+ = **scores énormes**

### 🔥 Late Game (Vague 11+)

**Priorités** :
1. ✅ **Régénération** pour sustain
2. ✅ Maxer **Tir Multiple** (4 balles)
3. ✅ **Bouclier** pour urgences

**Conseils** :
- Dash = **survie**, pas mobilité
- Power-ups = différence entre **vie et mort**
- Combo x20+ = **domination totale**

### 👾 Stratégie Boss

- 🎯 Gardez vos **distances** (ils tirent beaucoup)
- ⚡ Utilisez **Dash** pour esquiver les rafales
- 🛡️ **Invincibilité** = victoire facile
- 💣 **Nuke** = instant win (mais gaspillage de crédits)

---

## 🎁 Power-Ups

| Power-up | Effet | Durée | Drop Rate |
|----------|-------|-------|-----------|
| ⚡ **Invincibilité** | Immunité totale | 5s | 15% |
| ⚡⚡ **Rapid Fire** | Tir ultra-rapide | 5s | 15% |
| 💣 **Nuke** | Tue tous les ennemis | Instant | 15% |

---

## 🛠️ Améliorations Disponibles

| Amélioration | Coût Base | Effet | Niv. Max |
|--------------|-----------|-------|----------|
| 🔫 **Cadence de Tir** | 50 | -2 frames/niveau | 5 |
| 💥 **Dégâts des Balles** | 75 | +1 dégât | 10 |
| 🏃 **Vitesse** | 60 | +15% vitesse | 5 |
| ❤️ **Santé Max** | 100 | +25 HP + soin | 8 |
| 💚 **Régénération** | 150 | +1 HP/seconde | 3 |
| 🎯 **Tir Multiple** | 200 | +1 balle | 3 |
| 🛡️ **Bouclier** | 250 | Absorbe 1 coup | 1 |

**Coût Évolutif** : `Coût = Base × (1 + Niveau × 0.5)`

---

## 📊 Statistiques

### Difficulté Progressive

```
Vague 1  : 8 ennemis  | Facile
Vague 5  : 20 ennemis + BOSS | Moyen
Vague 10 : 35 ennemis + BOSS | Difficile
Vague 15+: 50+ ennemis + BOSS | Extrême
```

### Scaling des Ennemis

```javascript
Formule: baseStat × (1 + (wave - 1) × 0.15)

Exemples:
- Vague 1  : Chaser = 1 HP, 10 dmg
- Vague 5  : Chaser = 1.6 HP, 16 dmg
- Vague 10 : Chaser = 2.35 HP, 23.5 dmg
- Boss V5  : 80 HP, 48 dmg
```

### Récompenses

- **Chaser** : 5 crédits, 10 score
- **Shooter** : 10 crédits, 20 score
- **Tank** : 25 crédits, 50 score
- **Boss** : 200 crédits, 500 score
- **Combo x10** : Score × 2

---

## 🗂️ Structure du Projet

```
neon-pulse/
├── index.html      # Point d'entrée
├── style.css       # Styles néon et UI
├── game.js         # Logique principale
├── entities.js     # Classes (Player, Enemy, etc.)
├── audio.js        # Gestionnaire audio
└── README.md       # Ce fichier
```

### Technologies Utilisées

- **HTML5 Canvas** : Rendu graphique
- **Vanilla JavaScript** : Logique de jeu
- **CSS3** : Interface et effets
- **Web Audio API** : Sons procéduraux

**Aucune dépendance externe !** 🎉

---

## 🎨 Palette de Couleurs

```css
Cyan Néon    : #0ff (Joueur, UI)
Magenta Néon : #f0f (Boss, Vagues)
Jaune Néon   : #ff0 (Projectiles, Shooters)
Rouge Néon   : #f00 (Ennemis, Dégâts)
Vert Néon    : #0f0 (Crédits, Santé)
Fond Sombre  : #050505
```

---

## 🏅 Records et Achievements

### Objectifs de Score

- 🥉 **Bronze** : 1,000 points
- 🥈 **Argent** : 5,000 points
- 🥇 **Or** : 10,000 points
- 💎 **Diamant** : 25,000 points
- 👑 **Légende** : 50,000+ points

### Défis

- ⭐ Atteindre la vague 10
- ⭐⭐ Battre un Boss sans dégâts
- ⭐⭐⭐ Combo x20
- ⭐⭐⭐⭐ Atteindre la vague 20
- ⭐⭐⭐⭐⭐ Score 100,000+

---

## 🐛 Dépannage

### Le jeu ne se charge pas

- ✅ Vérifiez que tous les fichiers sont dans le **même dossier**
- ✅ Utilisez un **navigateur moderne** (Chrome, Firefox, Edge)
- ✅ Ouvrez la **console** (F12) pour voir les erreurs

### Performances faibles

- ✅ Fermez les autres onglets
- ✅ Désactivez les extensions de navigateur
- ✅ Utilisez le **mode plein écran** (F11)

### Audio ne fonctionne pas

- ✅ Vérifiez le **volume** du navigateur
- ✅ Cliquez sur la page (requis pour Web Audio API)
- ✅ Vérifiez les **permissions** audio

---

## 🔮 Futures Améliorations Possibles

- [ ] 🎵 Musique de fond procédurale
- [ ] 🏆 Système d'achievements
- [ ] 💾 Unlocks permanents entre runs
- [ ] 📊 Statistiques détaillées
- [ ] 🌐 Leaderboard en ligne
- [ ] 🎨 Skins et thèmes
- [ ] 🎮 Support manette
- [ ] 📱 Version mobile optimisée

---

## 📝 Changelog

### Version 2.0 (Actuelle)
- ✅ Boss waves tous les 5 niveaux
- ✅ 3 power-ups uniques
- ✅ Système de combo
- ✅ Damage numbers
- ✅ Trails lumineux
- ✅ Background animé
- ✅ Shooter enemies tirent

### Version 1.0
- ✅ Système roguelite de base
- ✅ 7 améliorations
- ✅ 3 types d'ennemis
- ✅ Screen shake
- ✅ Dash mechanic
- ✅ Pause menu
- ✅ High score

---

## 👨‍💻 Développement

### Développé avec

- ❤️ Passion pour les jeux arcade
- ⚡ JavaScript moderne (ES6+)
- 🎨 Design cyberpunk minimaliste
- 🎮 Gameplay roguelite addictif

### Crédits

- **Game Design & Code** : Créé avec Gemini
- **Audio** : Web Audio API (procédural)
- **Graphics** : HTML5 Canvas
- **Inspiration** : Geometry Wars, Vampire Survivors

---

## 📄 Licence

Ce projet est libre d'utilisation pour un usage personnel et éducatif.

---

## 🎮 Prêt à Jouer ?

<div align="center">

### **Ouvrez `index.html` et commencez votre aventure !**

**Bon courage, pilote. Le néon vous attend.** ⚡

---

*Made with 💙 and lots of ☕*

</div>
