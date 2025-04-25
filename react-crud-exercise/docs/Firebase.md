# Firebase Documentation for 'React CRUD Exercise'

Administer the database through the [Firebase console](https://console.firebase.google.com/project/react-crud-exercise).

Choose a [Firestore database](https://console.firebase.google.com/project/react-crud-exercise/firestore/databases/-default-/data).

[Rules template](https://www.coursera.org/learn/packt-reactjs-and-tailwind-css-fundamentals-szmrn/lecture/O5FD0/install-firebase-and-react-toastify-and-sign-up-the-user) for the database:

```Firestore
// Firestore rules

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

```Firestore
// Storage rules
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null && request.resource.size < 5 * 1024 * 1024 && // 5MB
        request.resource.contentType.matches('image/.*');
      }
  }
}
```
