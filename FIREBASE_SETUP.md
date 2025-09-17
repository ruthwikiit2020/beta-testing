# Firebase Setup Guide

## 1. Enable Firestore Database

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: `rewise-ai`
3. Go to **Firestore Database** in the left sidebar
4. Click **"Create database"**
5. Choose **"Start in test mode"** (for development)
6. Select a location (choose the closest to your users)

## 2. Set Up Firestore Rules

1. In Firestore Database, go to **"Rules"** tab
2. Replace the default rules with the content from `firestore.rules` file:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click **"Publish"**

## 3. Enable Authentication

1. Go to **Authentication** in the left sidebar
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Enable **"Google"** provider
5. Add your domain to **"Authorized domains"**:
   - `localhost` (for development)
   - Your production domain (when deployed)

## 4. Test the Setup

1. Run your app: `npm run dev`
2. Sign in with Google
3. Click the **"Test DB"** button in the header
4. Check the browser console for success/error messages
5. Upload a PDF and generate flashcards
6. Sign out and sign back in
7. Your data should persist!

## 5. Debugging

If data is not persisting:

1. **Check Browser Console** for error messages
2. **Check Firebase Console** → Firestore Database → Data tab
3. **Verify Authentication** is working
4. **Check Firestore Rules** are correct
5. **Test with "Test DB" button** to verify connection

## 6. Production Deployment

When deploying to production:

1. Update Firestore rules for production security
2. Add your production domain to authorized domains
3. Consider upgrading to a paid plan for better performance
4. Set up proper error monitoring

## Troubleshooting

### Common Issues:

1. **"Permission denied"** → Check Firestore rules
2. **"User not authenticated"** → Check Google Auth setup
3. **"Network error"** → Check Firebase project configuration
4. **Data not saving** → Check browser console for errors

### Debug Commands:

```javascript
// In browser console, test Firebase connection:
console.log('Firebase config:', firebaseConfig);
console.log('Current user:', currentUser);
console.log('User data:', userData);
```
