import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <Link to="/">
        <h1 className="text-4xl font-bold text-gray-800 mt-6">"Ollis Flohmarkt" CRUD App</h1>
      </Link>
    </header>
  )
}
