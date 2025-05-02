import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "../firebase";
import { useAuthStatus } from "../hooks/useAuthStatus";

// Interface for user data fetched from Firestore
interface UserData {
  displayName?: string;
  // Add other fields if needed from your 'users' collection
}

export default function Home() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const db = getFirestore(app);
  const { loggedIn, checkingStatus, currentUser } = useAuthStatus();

  // Fetch Firestore data when currentUser changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            setUserData(docSnap.data() as UserData);
          } else {
            console.log("No user document found in Firestore for home page.");
            setUserData({ displayName: currentUser.displayName || "User" });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setUserData({ displayName: currentUser.displayName || "User" });
        }
      } else {
        setUserData(null);
      }
    };

    if (!checkingStatus) {
      fetchUserData();
    }
  }, [currentUser, db, checkingStatus]);

  const displayName = userData?.displayName;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Home Page</h1>
      {checkingStatus ? (
        <p className="text-gray-600 mt-4">Loading...</p>
      ) : loggedIn ? (
        <p className="text-gray-600 mt-4">
          Welcome, <em>{displayName || currentUser?.displayName || "User"}</em>! This is your home page.
        </p>
      ) : (
        <p className="text-gray-600 mt-4">
          Welcome to the Home Page! This is where you can find the latest updates and information.
        </p>
      )}
      <Link to="/about">About</Link>
      <Link to="/app">App</Link>
    </div>
  );
}