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

This project is inspired by the [ReactJS and Tailwind CSS Fundamentals
](https://www.coursera.org/learn/packt-reactjs-and-tailwind-css-fundamentals-szmrn/home/info) taught by Stackt on Coursera. But the code implementation and the libraries used deviate considerably as this project is upgraded to use React 19, Vite, PrimeReact (with PrimeIcons), and TypeScript. You will _not_ be able to follow along with the course.

## TODOs / Future Work

- [ ] Add Storybook
- [ ] Add content database/s (aim for basic CMS or blog or "shopping window")
- [ ] Add unit tests (Jest?)
- [ ] Add e2e tests (Playwright?)
- [ ] Add i18n
- [ ] Add headless UI, e.g. TansStack Table
- [ ] Add documentation / set up instructions / tutorial
- [ ] Refactor / restructure code
- [ ] Implement a proper, consistent UI design
- [ ] Add Figma design?
- [ ] Maybe change displayName behavior in Firebase auth to match Firestore displayName, see [Hints and Ideas](#hints-and-ideas) below.

Additional features:

- [ ] Add a "protected content" wrapper component for page content exclusive to logged-in users

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
