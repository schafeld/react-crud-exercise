# react-crud-exercise

A sample CRUP app in React

### Developer Notes

This project is [_not_ set up with create-react-app](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).

### Set up React with Vite, Typescript, and Tailwind CSS

1. Install Vite and React from scratch

See [official docs](https://react.dev/learn/build-a-react-app-from-scratch#vite)

```bash
npm create vite@latest react-crud-exercise -- --template react-ts
```

2. Install Tailwind CSS

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

3. Add TypeScript support

```bash
npm install --save-dev @types/react
npm install --save-dev @types/react-dom
```
