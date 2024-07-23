# Chat App

A chat application built with React Native, Expo, and Firebase.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Configuration](#database-configuration)
- [Running the App](#running-the-app)
- [File Structure](#file-structure)
- [Dependencies](#dependencies)
- [Additional Notes](#additional-notes)
- [Contributing](#contributing)
- [License](#license)

## Prerequisites

Before you begin, ensure you have met the following requirements:

- You have installed Node.js and npm.
- You have installed Expo CLI.
- You have installed Android Studio (for Android development).
- You have a Firebase account.

## Installation

Follow these steps to set up the development environment:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/chat-app.git
   cd chat-app
   ```

2. Install the necessary libraries:

   ```bash
   npm install
   ```

3. Install Expo CLI globally if you haven't already:
   ```bash
   npm install -g expo-cli
   ```

## Database Configuration

This app uses Firebase Firestore for the database and Firebase Storage for storing images.

1. Create a Firebase project:

   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Click on "Add project" and follow the instructions.

2. Add an app to your Firebase project:

   - Click on the `</>` icon (for web) to add a new app.
   - Register the app and copy the Firebase configuration object.

3. Replace the Firebase configuration in `App.js` with your Firebase project credentials:
   ```javascript
   const firebaseConfig = {
     apiKey: 'YOUR_API_KEY',
     authDomain: 'YOUR_AUTH_DOMAIN',
     projectId: 'YOUR_PROJECT_ID',
     storageBucket: 'YOUR_STORAGE_BUCKET',
     messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
     appId: 'YOUR_APP_ID',
   }
   ```

## Running the App

To start the development server, run:

```bash
npx expo start
```

To run the app on an Android device or emulator, run:

```bash
npx expo run:android
```

To run the app on an iOS device or simulator, run:

```bash

npx expo run:ios
```

To run the app in a web browser, run:

```bash

npx expo start --web
```
