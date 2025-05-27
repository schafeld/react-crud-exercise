# react-crud-exercise

A sample CRUD app in React

⚠️ **This project is a work in progress. It is not yet complete.**
It is (going to be) a simple CRUD app that allows users to create, read, update, and delete data. The app is built with React, Vite, TypeScript, and Tailwind CSS. It uses Firebase for authentication and Firestore for the database. _It will run, but you'll need your own Firebase credentials/database._

## Developer Notes

This project is [_not_ set up with create-react-app](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).

## Set up React with Vite, Typescript, and Tailwind CSS

### 1. Install Vite and React from scratch

See [official docs](https://react.dev/learn/build-a-react-app-from-scratch#vite)

```bash
npm create vite@latest react-crud-exercise -- --template react-ts
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p // did not work for me, so I added configs manually, see below

npm install @tailwindcss/postcss
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest
npm install -D tailwindcss@3
npm install -D postcss-import
```

```javascript
// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

```javascript
// postcss.config.js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
```

Code to add to your CSS file (e.g., `index.css`):

```css
@import 'tailwindcss/preflight';
@tailwind utilities;
@import 'tailwindcss';
```

Copilot, Perplexity, and Gemini produced utter BS here.
Look at [these docs](https://tailwindcss.com/docs/installation/using-vite) to get Tailwind working with Vite.

Also added [Tailwind CSS Forms](https://github.com/tailwindlabs/tailwindcss-forms) for better form styling.

```bash
npm install -D @tailwindcss/forms
```

```javascript
// tailwind.config.cjs
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/forms')],
};
```

### 3. Add TypeScript support

```bash
npm install --save-dev @types/react
npm install --save-dev @types/react-dom
```

### 4. Add React Router

Follow [these instructions](https://reactrouter.com/start/data/installation) to add React Router to your app.

```bash
npm i react-router
npm i react-router-dom
npm i @types/react-router-dom
```

## Firebase

[Firebase console](https://console.firebase.google.com/project/react-crud-exercise)

This project uses Firebase for authentication and Firestore for the database. Follow [Firebase instructions](https://console.firebase.google.com/project/react-crud-exercise/overview).

```bash
npm install firebase

```

Firebase documentation:

- [Firebase Authentication](https://firebase.google.com/docs/auth/web/start)
- [Firestore](https://firebase.google.com/docs/firestore/quickstart)

## Origin and Inspiration

This project was inspired by the [ReactJS and Tailwind CSS Fundamentals
](https://www.coursera.org/learn/packt-reactjs-and-tailwind-css-fundamentals-szmrn/home/info) taught by Stackt on Coursera. I took the course (including [certificate](https://www.coursera.org/account/accomplishments/specialization/8EP9S2HKOPVR)), but for this code implementation I deliberately chose different libraries ans set-up, used TypeScript and the most recent version of React. Also the features differ significantly from the tutorial. You will _not_ be able to follow along with the course with this code.

## TODOs / Future Work

- [ ] Add Storybook
- [ ] Add content database/s (aim for basic CMS or blog or "shopping window", Builder.io CMS?)
- [x] Set up unit tests
- [ ] Add unit tests
- [ ] Add e2e tests (Playwright?)
- [ ] Add i18n
- [ ] Add headless UI, e.g. TansStack Table
- [ ] Add/update documentation / set up instructions / tutorial
- [ ] Refactor / restructure code
- [ ] Refactor to use same component for create and edit product?
- [ ] Implement a proper, consistent UI design
- [ ] Add Figma design?
- [ ] Maybe change displayName behavior in Firebase auth to match Firestore displayName, see [Hints and Ideas](#hints-and-ideas) below.
- [ ] Vendor profiles should have a custom vendor image (email login user do not have a profile image, Google OAuth users do) and a vendor link (instead of their email address being exposed)
- [ ] Add configuration and filter for currency display
- [x] Make location optional
- [ ] Handle case of user trying to upload more than 5 images (max images per product)
- [ ] Handle case of user trying to upload an image larger than 5MB (max image size)
- [ ] Add more distinctive user roles (admin, vendor, user) and permissions
- [ ] Wishlist/bookmarks for products
- [ ] Checkout process
- [ ] Add payment processing (Stripe?)
- [ ] Add contact form for site feedback (and for individual vendors?)
- [ ] Allow user to change password

Additional features:

- [x] Add a "protected content" wrapper component for page content exclusive to logged-in users

Actual refactoring suggestions:

- [x] Profile could be refactored to only rely on the ProtectedRoute component for authentication. The inline authentication check could be removed.

### Hints and ideas

The displayName is read from the Firestore users collection. When it was changed it will _not_ be the same as the Firebase auth displayName. The Firebase auth displayName is not updated when the Firestore user is updated. I don't want to change this behavior, while testing the app. I want to keep the Firebase auth displayName as it is. Maybe I will change this behavior when the app is ready for production.

## License

This project's code is licensed under : Currently not licensed. Intended to become MIT or GPL license when ready.

Images by Unsplash are licensed under the [Unsplash License](https://unsplash.com/license):

- ["Road through trees", Kellen Riggen](https://unsplash.com/de/fotos/eine-kurvige-strasse-mit-einem-baum-an-der-seite-ZHnTWmiz000)
- ["Welcome aboard, life saver", Adam Cai](https://unsplash.com/de/fotos/ein-rettungsschwimmer-der-an-einer-wand-hangt-mit-einem-willkommensschild-an-bord-_Sp4jNiW_j0)
- ["Welcome Back", Nick Fewings](https://unsplash.com/de/fotos/ein-willkommensschild-mit-einem-smiley-bTRsbY5RLr4)

## Installation of the complete shop (PRELIMINARY, 2025-05-19)

Created with prompt:

Please look at the entire @workspace. Can you deduce what a novice user, after checking out this project, would have to do to get the shop running (including Firebase set-up).
Please add instructions after "Installation of the complete shop" in the Readme.

---

Follow these steps to set up and run the React CRUD Exercise project:

### 1. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/yourusername/react-crud-exercise.git
cd react-crud-exercise

# Install dependencies
npm install
```

### 2. Set up Firebase

1. Create a Firebase account at [firebase.google.com](https://firebase.google.com/) if you don't have one
2. Create a new Firebase project from the [Firebase Console](https://console.firebase.google.com/)
3. Enable the following services:
   - Authentication (Email/Password and Google Sign-In)
   - Firestore Database
   - Storage

### 3. Set up Firebase Authentication

1. In the Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** and **Google** authentication providers

### 4. Set up Firestore Database

1. In the Firebase Console, go to **Firestore Database** → **Create database**
2. Start in test mode, then add security rules
3. Add the following security rules in **Firestore Database** → **Rules**:

```
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Listings
    match /listings/{listing} {
      allow read;
      allow create: if request.auth != null && request.resource.data.imgUrls.size() < 7;
      allow delete: if resource.data.userRef == request.auth.uid;
      allow update: if resource.data.userRef == request.auth.uid;
    }
    // Users
    match /users/{user} {
      allow read;
      allow create;
      allow update: if request.auth.uid == user;
    }
  }
}
```

### 5. Set up Firebase Storage

1. In the Firebase Console, go to **Storage** → **Get started**
2. Start in test mode, then add security rules
3. Add the following security rules in **Storage** → **Rules**:

```
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024 && // 5MB
        request.resource.contentType.matches('image/.*');
      // Allow delete only for files that include the user's ID in the path
      allow delete: if request.auth != null &&
        resource.name.matches('products/' + request.auth.uid + '.*');
      }
  }
}
```

### 6. Create Firebase Index for Filtering

Create a composite index as described in Firebase.md:

1. Go to **Firestore Database** → **Indexes** → **Add Index**
2. Set:
   - **Collection ID:** `listings`
   - **Fields:**
     - `isNew` (Ascending)
     - `createdAt` (Descending)
3. Click **Create index** and wait for it to build

### 7. Configure Firebase in Your Project

1. In the Firebase Console, go to **Project Overview** → **Project settings**
2. Scroll down to **Your apps** and click the Web icon (</>) to add a web app
3. Register your app and copy the Firebase configuration
4. Edit firebase.ts and replace the `firebaseConfig` object with your own:

```typescript
const firebaseConfig: FirebaseConfig = {
  apiKey: 'YOUR_API_KEY',
  authDomain: 'YOUR_PROJECT_ID.firebaseapp.com',
  projectId: 'YOUR_PROJECT_ID',
  storageBucket: 'YOUR_PROJECT_ID.appspot.com',
  messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
  appId: 'YOUR_APP_ID',
};
```

### 8. Run the Development Server

```bash
npm run dev
```

Your application should now be running at http://localhost:5173
