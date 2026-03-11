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
| [expo-sqlite](https://docs.expo.dev/versions/latest/sdk/sqlite/) | Local SQLite database for menu cache |
| [expo-image-picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/) | Profile avatar selection |
| [react-native-mask-text](https://github.com/akinncar/react-native-mask-text) | Phone number masking |

## Project Structure

```
little-lemon-mobile/
├── App.tsx                  # Entry point — navigation setup
├── global.css               # NativeWind global styles
│
├── screens/
│   ├── Onboarding.tsx       # Registration screen (first launch)
│   ├── Home.tsx             # Landing screen with menu list
│   └── Profile.tsx          # User profile & settings
│
├── components/
│   ├── Header.tsx           # App header with logo
│   └── SplashScreen.tsx     # Loading screen on startup
│
└── utils/
    └── database.ts          # SQLite helpers (init, get, save, fetch)
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

All auth transitions use `navigation.reset()` so there is no back button into a previous auth state.

## Getting Started

### Prerequisites

- Node.js
- Expo Go app on your device, or an iOS/Android simulator

### Installation

```bash
npm install
npx expo start
```

## Features

### Onboarding Screen
- First name (letters only) + email validation
- **Next** button disabled until both fields are valid
- Saves user data and auth flag to AsyncStorage on submit

### Home Screen
- Header with logo and profile avatar (tap → Profile)
- Hero banner with restaurant info
- Menu list fetched from remote API and cached in a local **SQLite** database
  - First launch → fetches from API, stores in SQLite
  - Subsequent launches → loads from SQLite (works offline)

### Profile Screen
- Auto-populated with Onboarding data (first name, email)
- Avatar picker via device photo library; initials placeholder when no image
- Phone number input with `(999) 999-9999` USA mask
- Email notification checkboxes (cosmetic)
- **Save changes** → persists all fields to AsyncStorage
- **Discard changes** → reverts to last saved state
- **Log out** → clears all stored data, returns to Onboarding

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#495E57` | Backgrounds, buttons |
| Primary Yellow | `#F4CE14` | Headings, CTA buttons |
| Light | `#EDEFEE` | Labels, borders |
| Dark | `#333333` | Body text |
