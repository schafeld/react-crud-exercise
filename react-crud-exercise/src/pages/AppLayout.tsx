import { JSX, useState } from 'react';
import { Link } from 'react-router-dom';
import viteLogo from '/vite.svg';
import reactLogo from '../assets/react.svg';
import './AppLayout.css';


function AppLayout(): JSX.Element {
  const [count, setCount] = useState<number>(0);

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="flex space-x-4">
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="w-16 h-16" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="w-16 h-16" alt="React logo" />
        </a>
      </div>
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Vite + React + Typescript + Tailwind CSS + PrimeReact + PrimeIcons</h1>
      <div className="card mt-6 p-6 bg-white shadow-md rounded-lg">
        <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-600">
          Edit <code className="bg-gray-200 px-1 py-0.5 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="mt-6 text-gray-500">
        Click on the Vite and React logos to learn more
      </p>
      <p className="mt-6 text-gray-500">
        <Link to="/">Go to Home</Link>
      </p>
      <p className="mt-6 text-gray-500">
        <Link to="/about">Go to About</Link>
      </p>
    </div>
  );
}

export default AppLayout;

