import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
// import { useEffect } from "react";
// import { getFirestore, doc, getDoc } from "firebase/firestore";
// import { app } from "../firebase";

export default function Offers() {
  const { loggedIn, checkingStatus, currentUser } = useAuthStatus();
  // const [userData, setUserData] = useState(null);

  console.log("Current User:", currentUser);
  console.log("Logged In:", loggedIn);

  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Offers Page</h1>
      <p className="text-gray-600 mt-4">
        This is where you can view all the offers.
      </p>

        {checkingStatus ? (
          <p className="text-gray-600 mt-4">Loading...</p>
        ) : loggedIn ? (
          <p className="text-gray-600 mt-4">
          <Link to="/create-listing" className="text-blue-500 mt-4">
            Create Listing</Link>, {currentUser?.displayName || "User"}
          
          </p>
        ) : (
          <p className="text-gray-600 mt-4">
            <Link to="/signin" className="text-blue-500 mt-4">
              Sign In</Link> to create a listing.
          </p>
        )}

      
    </div>
  )
}