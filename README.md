# VibeCode Daily Flow Tracker

A gamified daily discipline app built with React, TypeScript, and Firebase.

## Setup Instructions

### 1. Firebase Configuration

1. Create a new Firebase project at https://console.firebase.google.com
2. Enable Authentication (Anonymous) and Firestore Database
3. Copy your Firebase config and create a `.env.local` file:

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 2. Deploy Firestore Rules

```bash
firebase login
firebase use --add your_project_id
firebase deploy --only firestore:rules
```

### 3. Development

```bash
npm install
npm run dev
```

### 4. Deploy to Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

## Features

- ✅ Anonymous authentication
- ✅ Firestore with offline persistence
- ✅ Gamified UI with indigo/violet gradient theme
- ✅ Responsive design with Tailwind CSS
- ✅ TypeScript for type safety

## Next Steps

Ready for Step 2: Morning Check-In form implementation.