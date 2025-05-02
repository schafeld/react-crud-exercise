import { Link } from "react-router-dom";

export default function CreateListing() {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Create a product listing</h1>
      <p className="text-gray-600 mt-4">
        This is where you can create a new product listing.
      </p>

      
      <Link to="/">Go to Home</Link>
    </div>
  )
}
