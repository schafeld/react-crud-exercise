import { Link } from "react-router-dom";

export default function Offers() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Offers Page</h1>
      <p className="text-gray-600 mt-4">
        This is where you can view all the offers.
      </p>


        {/* If user is logged in show create listing button
        <Link to="/create-listing" className="text-blue-500 mt-4">
          Create Listing
        </Link> */}


      <Link to="/about">About</Link>
      <Link to="/app">App</Link>
    </div>
  )
}