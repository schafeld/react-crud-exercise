# react-crud-exercise

A sample CRUD app in React

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

## Origin and Inspiration

This project is inspired by the [ReactJS and Tailwind CSS Fundamentals
](https://www.coursera.org/learn/packt-reactjs-and-tailwind-css-fundamentals-szmrn/home/info) taught by Stackt on Coursera. But the code deviates considerably as this project is upgraded to use React 19, Vite, and TypeScript.

## License

This project's code is licensed under : Currently not licensed.

Images by Unsplash are licensed under the [Unsplash License](https://unsplash.com/license):

- ["Road through trees", Kellen Riggen](https://unsplash.com/de/fotos/eine-kurvige-strasse-mit-einem-baum-an-der-seite-ZHnTWmiz000)
- ["Welcome aboard, life saver", Adam Cai](https://unsplash.com/de/fotos/ein-rettungsschwimmer-der-an-einer-wand-hangt-mit-einem-willkommensschild-an-bord-_Sp4jNiW_j0)
