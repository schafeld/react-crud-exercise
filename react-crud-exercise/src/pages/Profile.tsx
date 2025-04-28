import { Link } from "react-router-dom"; // Correct import for react-router v6+
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { useState, useEffect } from "react";
import { app } from "../firebase"; // Assuming firebase is initialized in ../firebase
import { getFirestore, doc, getDoc, Timestamp } from "firebase/firestore"; // Import Firestore functions

// Define an interface for the additional user data from Firestore
interface UserData {
  timestamp?: Timestamp;
  providerId?: string;
  // Add other fields from your 'users' collection if needed
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null); // State for Firestore data
  const [loading, setLoading] = useState(true);
  const auth = getAuth(app);
  const db = getFirestore(app); // Get Firestore instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { // Make the callback async
      setUser(currentUser);
      if (currentUser) {
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData); // Set Firestore data
          } else {
            console.log("No such document in Firestore!");
            setUserData(null); // Reset if document doesn't exist
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setUserData(null); // Reset on error
        }
      } else {
        setUserData(null); // Clear Firestore data if no user is logged in
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db]); // Add db to dependency array

  if (loading) {
    return <p>Loading profile...</p>;
  }

  // Helper function to format Firestore Timestamp
  const formatTimestamp = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "Not available";
    return timestamp.toDate().toLocaleString(); // Or any other format you prefer
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6 min-h-screen">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile Page</h1>
      {user ? (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">User Information</h2>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-300"
            />
          )}
          <div className="mb-4">
            <strong className="block text-gray-700 text-sm font-bold mb-2">Display Name:</strong>
            <p className="text-gray-700 text-base">{user.displayName || "Not set"}</p>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700 text-sm font-bold mb-2">Email:</strong>
            <p className="text-gray-700 text-base">{user.email}</p>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700 text-sm font-bold mb-2">Email Verified:</strong>
            <p className="text-gray-700 text-base">{user.emailVerified ? "Yes" : "No"}</p>
          </div>
          <div className="mb-6">
            <strong className="block text-gray-700 text-sm font-bold mb-2">User ID:</strong>
            <p className="text-gray-700 text-base">{user.uid}</p>
          </div>
          {/* Display Firestore Data */}
          {userData ? (
            <>
              <div className="mb-4">
                <strong className="block text-gray-700 text-sm font-bold mb-2">Provider ID:</strong>
                <p className="text-gray-700 text-base">{userData.providerId || "Not available"}</p>
              </div>
              <div className="mb-4">
                <strong className="block text-gray-700 text-sm font-bold mb-2">Member since (timestamp from Firestore):</strong>
                <p className="text-gray-700 text-base">{formatTimestamp(userData.timestamp)}</p>
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm">Loading additional user data...</p>
          )}
          {/* Add more user details if needed, e.g., creation time, last sign-in */}
          {/* <div className="mb-4">
             <strong className="block text-gray-700 text-sm font-bold mb-2">Account Created:</strong>
             <p className="text-gray-700 text-base">{user.metadata.creationTime}</p>
           </div>
           <div className="mb-4">
             <strong className="block text-gray-700 text-sm font-bold mb-2">Last Signed In:</strong>
             <p className="text-gray-700 text-base">{user.metadata.lastSignInTime}</p>
           </div> */}
        </div>
      ) : (
        <p className="text-red-500">No user is currently logged in.</p>
      )}
      <div className="mt-4 space-x-4">
         <Link to="/about" className="text-blue-500 hover:text-blue-700">About</Link>
         <Link to="/app" className="text-blue-500 hover:text-blue-700">App</Link>
         {/* Add a link to sign in/sign out page if applicable */}
         {/* <Link to="/auth" className="text-blue-500 hover:text-blue-700">Sign In/Out</Link> */}
      </div>
    </div>
  );
}