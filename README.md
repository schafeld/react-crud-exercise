# react-crud-exercise

A sample CRUP app in React

### Developer Notes

This project is [_not_ set up with create-react-app](https://react.dev/blog/2025/02/14/sunsetting-create-react-app).

### Set up React with Vite, Typescript, and Tailwind CSS

1. Install Vite

```bash
npm create vite@latest react-crud-exercise --template react-ts
```

2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p // did not work for me, so I added configs manually, see below
```

3. Configure Tailwind CSS

```bash
npm install @tailwindcss/postcss
```

```javascript
// tailwind.config.js
/** @type {import('tailwindcss').Config} */
/** @type {import('tailwindcss').Config} */
const tailwindConfig = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default tailwindConfig;
```

```javascript
// postcss.config.cjs
module.exports = {
  plugins: {
    '@tailwindcss/postcss': {}, // Changed from 'tailwindcss' to '@tailwindcss/postcss'
    autoprefixer: {},
  },
};
```

4. Add Tailwind CSS to your CSS

```css
/* src/App.css */
@tailwind base;
@tailwind components;
@tailwind utilities;
```

5. Start the development server

```bash
npm run dev
```

6. Open your browser and go to [http://localhost:5173](http://localhost:5173)
7. Open your code editor and start coding!
