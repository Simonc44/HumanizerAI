# HumanizerAI

![License](https://img.shields.io/badge/license-Apache%202.0-blue.svg)

HumanizerAI est une application web conçue pour affiner et analyser le texte. Elle transforme le contenu généré par l'IA en une écriture plus naturelle et authentique, et peut également évaluer si un texte a été probablement écrit par un humain ou une IA.

## Fonctionnalités

- **Humanizer** : Prenez n'importe quel texte généré par l'IA et réécrivez-le pour qu'il paraisse plus humain, engageant et indétectable.
- **AI Detector** : Analysez un morceau de texte pour obtenir un score de probabilité, indiquant s'il a été généré par une IA ou écrit par un humain.

## Pile Technologique

Ce projet est construit avec une pile technologique moderne et performante :

- **Framework** : [Next.js](https://nextjs.org/) (avec App Router)
- **Langage** : [TypeScript](https://www.typescriptlang.org/)
- **Styling** : [Tailwind CSS](https://tailwindcss.com/)
- **Composants UI** : [Shadcn/UI](https://ui.shadcn.com/)
- **Animations** : [Framer Motion](https://www.framer.com/motion/)
- **Fonctionnalités IA** : [Genkit](https://firebase.google.com/docs/genkit) (utilisant les modèles Gemini de Google)
- **Déploiement** : Firebase App Hosting

## Pour commencer

Pour lancer ce projet en local, suivez les étapes ci-dessous.

### Prérequis

Assurez-vous d'avoir installé [Node.js](https://nodejs.org/) (version 18 ou supérieure) sur votre machine.

### Installation

1.  **Clonez le dépôt**
    Si vous travaillez en dehors de Firebase Studio, clonez ce dépôt sur votre machine locale.

2.  **Installez les dépendances**
    Naviguez jusqu'au répertoire du projet et installez les paquets nécessaires.
    ```bash
    npm install
    # ou
    yarn install
    # ou
    pnpm install
    ```

3.  **Configurez les variables d'environnement**
    Ce projet utilise Genkit pour se connecter aux modèles IA de Google. Vous aurez besoin d'une clé API Gemini.

    - Créez un fichier `.env.local` à la racine du projet.
    - Ajoutez-y votre clé API comme suit :
      ```
      GEMINI_API_KEY="VOTRE_CLÉ_API_ICI"
      ```
    *Vous pouvez obtenir une clé API depuis Google AI Studio.*

4.  **Lancez le serveur de développement**
    Exécutez la commande suivante pour démarrer l'application en mode développement.
    ```bash
    npm run dev
    ```
    Ouvrez [http://localhost:9002](http://localhost:9002) dans votre navigateur pour voir le résultat.

## Licence

Ce projet est sous licence Apache, Version 2.0. Voir le fichier `LICENSE` pour plus de détails.
