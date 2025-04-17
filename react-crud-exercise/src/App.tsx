import { JSX, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App(): JSX.Element {
  const [count, setCount] = useState<number>(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank" rel="noopener noreferrer">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="bg-blue-500 text-white border-4 border-blue-700 rounded-lg p-4 m-5 shadow-lg">Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)} 
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded">
          count is {count}
        </button>
        <p className="mt-4 text-gray-700">
          Edit <code className="bg-gray-200 p-1 rounded">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App