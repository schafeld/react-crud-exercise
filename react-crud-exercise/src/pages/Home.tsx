import { Link } from "react-router";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Home Page</h1>
      <Link to="/about">About</Link>
      <Link to="/app">App</Link>
    </div>
  )
}