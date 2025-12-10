# DaysA.live

**DaysA.live** is an interactive web application that helps you discover hidden milestones, prime days, and fun sequences in your life timeline. By calculating the days elapsed since a specific date (like your birthday), it celebrates the unique moments that often go unnoticed.

## Features

-   **Milestone Tracking**: Automatically identifies significant day counts, such as "10,000 Days" or "12,345 Sequence".
-   **Interactive Flip Cards**: Each milestone is presented as a card that flips to reveal more details or actions.
-   **Calendar Integration**: Direct links to add your milestones to Google Calendar.
-   **Season Indicators**: Shows the current season for a given date.
-   **Persistence**: Your start date is saved in your browser's local storage, so you don't have to re-enter it.
-   **Shareable**: Easy sharing integration for Bluesky.

## Tech Stack

This project is built with a modern, performance-focused stack:

-   **[React 19](https://react.dev/)**: For building the user interface.
-   **[TypeScript](https://www.typescriptlang.org/)**: For static type safety.
-   **[Vite](https://vitejs.dev/)**: For fast development and bundling.
-   **[Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)**: For celebratory effects.
-   **GitHub Actions**: For automated deployment to GitHub Pages.
-   **[Antigravity](https://github.com/)**: Powered by Google DeepMind's advanced AI coding agent.


## Getting Started

### Prerequisites

-   Node.js (v18 or higher recommended)
-   npm

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/sohjsolwin/daysalive.git
    cd daysalive
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

3.  Start the development server:
    ```bash
    npm run dev
    ```

4.  Open your browser and navigate to `http://localhost:5173`.

## Deployment

The project is configured for automated deployment to GitHub Pages using GitHub Actions.

-   **Workflow**: `.github/workflows/deploy.yml`
-   **Config**: `vite.config.ts` acts as the build configuration (updates `base` path for proper asset loading).

Any push to the `main` branch will trigger the deployment workflow.
