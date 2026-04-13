# Personal Fitness Plan & Athlete Metrics

A premium, localized web application designed for high-performance training and athlete metric tracking. This app serves as a centralized hub for managing a 4-week periodized training cycle, exercise tutorials, and personal records.

![License](https://img.shields.io/badge/license-MIT-blue)
![Tech Stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-orange)
![PWA](https://img.shields.io/badge/PWA-Ready-success)

## 🚀 Features

*   **Periodized Training Plan**: Structured 7-day workout schedule focusing on Upper Push/Pull, Lower Body, and HIIT Complexes.
*   **Athlete Profile**: Persistent storage for key metrics like Age, VO2max, Weight, and Bench 1RM.
*   **Intelligent Weight Tracking**: Automated set-detection (e.g., "4 × 6") with per-set weight logging and persistence across sessions.
*   **Tutorial Integration**: Embedded YouTube video cards for every exercise to ensure perfect form.
*   **PWA Ready**: Installable on mobile and desktop for offline access and a native application feel.
*   **Premium UI/UX**: Dark mode aesthetic with OS-level safe-area support, smooth animations, and responsive typography.

## 🛠️ Technology Stack

*   **Core**: HTML5, Vanilla JavaScript (ES6+)
*   **Styling**: Modern CSS3 (Custom Properties, Flexbox, CSS Grid)
*   **Storage**: Browser `localStorage` for zero-backend persistence.
*   **Icons/Media**: YouTube iFrame API integration.

## 📂 Project Structure

```text
personal-fitness-plan/
├── css/
│   └── styles.css          # Core design system and layout
├── js/
│   ├── app.js              # UI logic, state management, and PWA handling
│   └── data.js             # Training plan content and exercise prescriptions
├── index.html              # Main application entry point
├── training-plan-data.md   # Reference document for plan calibration
└── sw.js                   # Service Worker for offline capabilities
```

## 🏁 Getting Started

### 1. Local Development
To run the project locally with live-reloading capacities:

```bash
# Using npx serve (recommended)
npx serve .
```

### 2. Usage
1.  **Select a Day**: Use the tab bar or swipe left/right on mobile.
2.  **Log Weights**: Tap an exercise header to expand details and enter your weights for each set.
3.  **Update Profile**: Navigate to the "Profile" tab to adjust your baseline metrics.

## 📄 License
This project is licensed under the MIT License.
