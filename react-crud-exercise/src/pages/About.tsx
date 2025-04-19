import { Link } from "react-router";

export default function About() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">About Page</h1>
      <Link to="/">Go to Home</Link>
    </div>
  )
}
