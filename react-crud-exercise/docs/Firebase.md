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
      // Allow delete only for files that include the user's ID in the path
      allow delete: if request.auth != null &&
        resource.name.matches('products/' + request.auth.uid + '.*');
      }
  }
}
```

## Firebase filtering

The isNew filtering neeeds an index.

If your Firestore `isNew` field is always a boolean (`true` or `false`) and the filtering still doesn't work, but you get results when you **don't** filter, the most common cause is a missing Firestore **composite index** for the query:

```js
where("isNew", "==", isNew),
orderBy("createdAt", "desc"),
```

**What happens:**  
Firestore requires a composite index for queries that use both `where` and `orderBy` on different fields. If the index is missing, you usually get an error in the browser console or Firebase logs, but sometimes it silently returns no results.

---

## How to fix

1. **Check your browser console** for any Firestore errors or index creation links.
2. **Manually create the index:**
   - Go to [Firebase Console > Firestore > Indexes](https://console.firebase.google.com/).
   - Click **"Add Index"**.
   - Set:
     - **Collection ID:** `listings`
     - **Fields:**
       - `isNew` (Ascending or Descending, doesn't matter for equality filter)
       - `createdAt` (Descending)
   - Save and wait for the index to build.

---

## Example: Add this index

| Field     | Order      |
| --------- | ---------- |
| isNew     | Ascending  |
| createdAt | Descending |

---

## Summary

- Firestore needs a composite index for `where("isNew", "==", ...)` + `orderBy("createdAt", "desc")`.
- Create the index in the Firebase Console and your filtering will work.
- Without the index, the RecentOfferings component should be used without the isNew filter. It should the return all listings, ordered by `createdAt` descending.

```js

---

**Tip:**
If you want to avoid composite indexes, you can filter in-memory after fetching, but this is not recommended for large datasets.

---
```
