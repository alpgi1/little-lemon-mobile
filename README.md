# 🍋 Little Lemon — Mobile App

A React Native mobile application built with Expo and TypeScript for the Little Lemon Mediterranean restaurant.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Expo](https://expo.dev) (v55) | React Native framework |
| TypeScript | Type-safe development |
| [NativeWind](https://www.nativewind.dev) v4 | Tailwind CSS styling |
| [React Navigation](https://reactnavigation.org) v7 | Stack navigation |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistent key-value storage |
| [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Local SQLite database for offline menu cache |
| [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) | Profile avatar selection |
| [react-native-mask-text](https://github.com/akinncar/react-native-mask-text) | Phone number masking |

## Project Structure

```
little-lemon-mobile/
├── App.tsx                  # Entry point — Stack navigator setup
├── global.css               # NativeWind global styles
│
├── screens/
│   ├── Onboarding.tsx       # Registration screen (first launch)
│   ├── Home.tsx             # Landing screen — menu list + filtering
│   └── Profile.tsx          # User profile & settings
│
├── components/
│   ├── Header.tsx           # App header with logo
│   └── SplashScreen.tsx     # Loading screen on startup
│
└── utils/
    └── database.ts          # SQLite helpers (init, get, save, fetch, filter)
```

## Navigation Architecture

```
Stack Navigator (all screens always registered)
 ├── Onboarding  ──reset──▶  Home
 ├── Home        ──navigate─▶ Profile
 │                ◀──goBack──
 └── Profile     ──reset──▶  Onboarding (Log Out)

App start: reads AsyncStorage → initialRouteName = Home | Onboarding
```

## Getting Started

```bash
npm install
npx expo start
```

## Features

### Onboarding Screen
- First name (letters only) + email validation
- **Next** disabled until both inputs are valid
- Saves user data and auth flag to AsyncStorage

### Home Screen
- Header with logo and profile avatar (tap → Profile)
- Hero banner with restaurant info and embedded search bar
- Horizontal scrollable category filter (Starters / Mains / Desserts)
  - Multi-select: multiple categories can be active at once
  - Selected category highlighted with green background
- Menu loaded from **SQLite** (fetched from API on first launch, cached for offline use)
- **500ms debounced** text search filtered against dish names
- Category + text filters combined with **AND** logic via SQL

### Profile Screen
- Auto-populated with Onboarding data (first name, email)
- Avatar picker with initials placeholder
- Phone number with `(999) 999-9999` USA mask
- Email notification checkboxes
- **Save / Discard changes** with AsyncStorage persistence
- **Log out** → clears all data, returns to Onboarding

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#495E57` | Backgrounds, buttons |
| Primary Yellow | `#F4CE14` | Headings, CTA buttons |
| Light | `#EDEFEE` | Labels, borders |
| Dark | `#333333` | Body text |
