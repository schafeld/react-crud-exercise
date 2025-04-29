import { Link } from "react-router-dom"; // Correct import for react-router v6+
import { getAuth, onAuthStateChanged, User, updateProfile } from "firebase/auth"; // Import updateProfile
import { useState, useEffect } from "react";
import { app } from "../firebase"; // Assuming firebase is initialized in ../firebase
import { getFirestore, doc, getDoc, Timestamp, updateDoc, setDoc } from "firebase/firestore"; // Import Firestore functions including updateDoc and setDoc

// Define an interface for the additional user data from Firestore
interface UserData {
  timestamp?: Timestamp;
  providerId?: string;
  displayName?: string; // Add displayName here if you store it in Firestore
  // Add other fields from your 'users' collection if needed
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null); // State for Firestore data
  const [loading, setLoading] = useState(true);
  const [editingName, setEditingName] = useState(false); // State to track editing mode (optional)
  const [displayName, setDisplayName] = useState(""); // State for editable display name
  const [isSaving, setIsSaving] = useState(false); // State to track saving process
  const auth = getAuth(app);
  const db = getFirestore(app); // Get Firestore instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { // Make the callback async
      setUser(currentUser);
      if (currentUser) {
        setDisplayName(currentUser.displayName || ""); // Initialize editable display name
        // Fetch additional user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const fetchedData = docSnap.data() as UserData;
            setUserData(fetchedData);
            // Optionally sync Firestore displayName if it exists and differs
            // if (fetchedData.displayName && fetchedData.displayName !== currentUser.displayName) {
            //   setDisplayName(fetchedData.displayName);
            // }
          } else {
            console.log("No such document in Firestore! Creating one.");
            // Optionally create the document if it doesn't exist
            // await setDoc(userDocRef, {
            //   email: currentUser.email,
            //   displayName: currentUser.displayName,
            //   timestamp: serverTimestamp(), // Use serverTimestamp for creation time
            //   providerId: currentUser.providerData[0]?.providerId || 'password',
            // });
            // const newDocSnap = await getDoc(userDocRef); // Re-fetch after creation
            // if (newDocSnap.exists()) {
            //     setUserData(newDocSnap.data() as UserData);
            // } else {
                 setUserData(null); // Reset if document doesn't exist or creation failed
            // }
          }
        } catch (error) {
          console.error("Error fetching/creating user data from Firestore:", error);
          setUserData(null); // Reset on error
        }
      } else {
        setUserData(null); // Clear Firestore data if no user is logged in
        setDisplayName(""); // Clear display name if no user
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db]); // Add db to dependency array

  // Handle Display Name Update
  const handleSaveDisplayName = async () => {
    if (!user || !displayName || isSaving) return; // Prevent saving if no user, empty name, or already saving

    setIsSaving(true);
    const userDocRef = doc(db, "users", user.uid);

    try {
      // 1. Update Firestore document
      //    Choose ONE of the following: updateDoc or setDoc with merge
      //    updateDoc: Fails if the document doesn't exist.
      //    setDoc with merge: Creates the document if it doesn't exist, or updates it if it does.
      await setDoc(userDocRef, { displayName: displayName }, { merge: true });
      // or await updateDoc(userDocRef, { displayName: displayName });

      // 2. Update Firebase Auth profile (optional but recommended for consistency)
      await updateProfile(user, { displayName: displayName });

      // 3. Update local state (optional, as onAuthStateChanged might re-trigger)
      setUser({ ...user, displayName: displayName } as User); // Update user state locally
      if (userData) {
        setUserData({ ...userData, displayName: displayName }); // Update userData state locally
      }

      console.log("Display name updated successfully!");
      setEditingName(false); // Exit editing mode (if using)
    } catch (error) {
      console.error("Error updating display name:", error);
      // Add user feedback for error
    } finally {
      setIsSaving(false); // Re-enable button
    }
  };


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
            {/* Editable Display Name Field */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isSaving} // Disable input while saving
              />
              <button
                onClick={handleSaveDisplayName}
                disabled={isSaving || !displayName || displayName === user.displayName} // Disable if saving, empty, or unchanged
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  (isSaving || !displayName || displayName === user.displayName) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
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