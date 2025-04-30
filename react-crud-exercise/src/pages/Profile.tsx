import { Link } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged, User } from "firebase/auth"; // Removed updateProfile
import { useState, useEffect } from "react";
import { app } from "../firebase";
import { getFirestore, doc, getDoc, Timestamp, setDoc } from "firebase/firestore"; // Removed updateDoc as setDoc with merge is used

// Define an interface for the additional user data from Firestore
interface UserData {
  timestamp?: Timestamp;
  providerId?: string;
  displayName?: string;
  // Add other fields from your 'users' collection if needed
}

export default function Profile() {
  const [user, setUser] = useState<User | null>(null); // Still keep Auth user for UID, email etc.
  const [userData, setUserData] = useState<UserData | null>(null); // State for Firestore data (including displayName)
  const [loading, setLoading] = useState(true);
  // State for the editable display name in the input field
  const [editableDisplayName, setEditableDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false); // State to track saving process
  const auth = getAuth(app);
  const db = getFirestore(app); // Get Firestore instance

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => { // Make the callback async
      setUser(currentUser);
      setUserData(null); // Reset Firestore data on auth change
      setEditableDisplayName(""); // Reset editable name
      if (currentUser) {
        // Fetch user data from Firestore
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const fetchedData = docSnap.data() as UserData;
            setUserData(fetchedData);
            // Initialize editable display name from Firestore data or fallback
            setEditableDisplayName(fetchedData.displayName || currentUser.displayName || "");
          } else {
            console.log("No user document in Firestore! Consider creating one.");
            // Initialize editable display name even if no Firestore doc (e.g., from Auth profile)
            setEditableDisplayName(currentUser.displayName || "");
            // Optionally create a default document here if needed
            // await setDoc(userDocRef, { displayName: currentUser.displayName || "", timestamp: serverTimestamp(), providerId: currentUser.providerData[0]?.providerId || 'unknown' });
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
        }
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db]); // Add db to dependency array

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Handle Display Name Update in Firestore
  const handleSaveDisplayName = async () => {
    // Use editableDisplayName for the check and save
    if (!user || !editableDisplayName || isSaving || editableDisplayName === userData?.displayName) return;

    setIsSaving(true);
    const userDocRef = doc(db, "users", user.uid);

    try {
      // Use setDoc with merge to update or create the displayName field in Firestore
      await setDoc(userDocRef, { displayName: editableDisplayName }, { merge: true });

      // Update local userData state to reflect the change immediately
      setUserData(prevData => ({ ...prevData, displayName: editableDisplayName }));

      console.log("Display name updated successfully in Firestore!");
    } catch (error) {
      console.error("Error updating display name in Firestore:", error);
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
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
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
          {/* Display Name Section */}
          <div className="mb-4">
            <strong className="block text-gray-700 text-sm font-bold mb-2">Display Name:</strong>
            {/* Display current name from Firestore */}
            {/* <p className="text-gray-700 text-base mb-2">{userData?.displayName || "Not set"}</p> */}
            {/* Editable Display Name Field */}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editableDisplayName} // Controlled input using editableDisplayName state
                onChange={(e) => setEditableDisplayName(e.target.value)} // Update editable state
                placeholder="Enter new display name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isSaving} // Disable input while saving
              />
              <button
                onClick={handleSaveDisplayName}
                // Disable if saving, empty, or unchanged from Firestore data
                disabled={isSaving || !editableDisplayName || editableDisplayName === userData?.displayName}
                className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                  (isSaving || !editableDisplayName || editableDisplayName === userData?.displayName) ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          {/* Other User Info */}
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
                <strong className="block text-gray-700 text-sm font-bold mb-2">Member since:</strong>
                <p className="text-gray-700 text-base">{formatTimestamp(userData.timestamp)}</p>
              </div>
            </>
          ) : (
            !loading && <p className="text-gray-500 text-sm">Loading additional user data...</p> // Show only if not initial loading
          )}
          {/* ... (rest of the component remains similar) ... */}
        </div>
      ) : (
          <div>
            <p className="text-red-500">No user is currently logged in.</p>
            <p>
              You can <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link> or <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>.
            </p>
          </div>
      )}
      <div className="mt-4 space-x-4">
        {user && ( // Show Log Out button only if user is logged in
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700 focus:outline-none"
          >
            Log Out
          </button>
        )}
      </div>
    </div>
  );
}