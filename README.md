# 🍋 Little Lemon — Mobile App

A React Native mobile application built with Expo and TypeScript for the Little Lemon Mediterranean restaurant.

## Tech Stack

| Technology | Purpose |
|---|---|
| [Expo](https://expo.dev) (v55) | React Native framework |
| TypeScript | Type-safe development |
| [NativeWind](https://www.nativewind.dev) v4 | Tailwind CSS styling for React Native |
| [React Navigation](https://reactnavigation.org) v7 | Screen navigation |
| [AsyncStorage](https://react-native-async-storage.github.io/async-storage/) | Persistent local storage |

## Project Structure

```
little-lemon-mobile/
├── App.tsx                  # Entry point — auth flow + navigation setup
├── index.ts                 # Expo entry
├── global.css               # NativeWind global styles
├── tailwind.config.js       # Tailwind configuration
│
├── screens/
│   ├── Onboarding.tsx       # Login/registration screen
│   ├── Home.tsx             # Home screen
│   ├── Menu.tsx             # Menu screen
│   ├── Cart.tsx             # Cart screen
│   └── Profile.tsx          # Profile screen with logout
│
└── components/
    ├── Header.tsx           # App header with logo
    └── SplashScreen.tsx     # Loading screen on startup
```

## Navigation Architecture

```
App.tsx
 ├── isLoading → SplashScreen (while reading AsyncStorage)
 ├── NOT logged in → Onboarding screen
 └── Logged in → Bottom Tab Navigator
                   ├── Home
                   ├── Menu
                   ├── Cart
                   └── Profile
```

Auth state is persisted via AsyncStorage. Navigation between auth states uses **callbacks** instead of `navigate()` — required when using conditional rendering with React Navigation.

## Getting Started

### Prerequisites

- Node.js
- Expo Go app on your iOS/Android device, or an iOS/Android simulator

### Installation

```bash
# Install dependencies
npm install

# Start the development server
npx expo start
```

Then scan the QR code with **Expo Go** or press `i` for iOS simulator / `a` for Android.

## Features

### Onboarding Screen
- First name validation (letters only, cannot be empty)
- Email validation (standard email format)
- **Next** button is disabled until both fields are valid
- Keyboard avoids inputs on focus
- On submit: saves completion flag to AsyncStorage and navigates to the main app

### Profile Screen
- **Log Out** button clears AsyncStorage and returns to Onboarding

## Color Palette

| Token | Hex | Usage |
|---|---|---|
| Primary Green | `#495E57` | Backgrounds |
| Primary Yellow | `#F4CE14` | Headings, active buttons |
| Light | `#EDEFEE` | Labels, input borders |
| Dark | `#333333` | Body text |
