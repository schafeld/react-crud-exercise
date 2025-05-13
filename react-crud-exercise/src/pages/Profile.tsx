import { Link, useNavigate } from "react-router-dom"; // Added useNavigate
import { getAuth, signOut } from "firebase/auth"; // Removed onAuthStateChanged, User
import { useState, useEffect } from "react";
import { app } from "../firebase";
import { getFirestore, doc, getDoc, Timestamp, setDoc, collection, query, where, getDocs, DocumentData } from "firebase/firestore"; // Added new imports
import { useAuthStatus } from "../hooks/useAuthStatus"; // Import the hook

// Define an interface for the additional user data from Firestore
interface UserData {
  timestamp?: Timestamp;
  providerId?: string;
  displayName?: string;
  // Add other fields from your 'users' collection if needed
}

export default function Profile() {
  const [userData, setUserData] = useState<UserData | null>(null); // State for Firestore data
  const [editableDisplayName, setEditableDisplayName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [userListings, setUserListings] = useState<DocumentData[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);
  const { loggedIn, checkingStatus, currentUser } = useAuthStatus(); // Use the hook
  const auth = getAuth(app); // Keep auth for signOut
  const db = getFirestore(app);
  const navigate = useNavigate(); // Hook for navigation after logout

  // Fetch Firestore data when currentUser changes
  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        setEditableDisplayName(""); // Reset editable name
        const userDocRef = doc(db, "users", currentUser.uid);
        try {
          const docSnap = await getDoc(userDocRef);
          if (docSnap.exists()) {
            const fetchedData = docSnap.data() as UserData;
            setUserData(fetchedData);
            setEditableDisplayName(fetchedData.displayName || currentUser.displayName || "");
          } else {
            console.log("No user document in Firestore! Consider creating one.");
            setUserData(null); // No specific Firestore data found
            setEditableDisplayName(currentUser.displayName || "");
          }
        } catch (error) {
          console.error("Error fetching user data from Firestore:", error);
          setUserData(null); // Reset on error
          setEditableDisplayName(currentUser.displayName || ""); // Fallback editable name
        }

        // Fetch user's listings
        setLoadingListings(true);
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("userRef", "==", currentUser.uid));
        try {
          const querySnap = await getDocs(q);
          const listingsArr: DocumentData[] = [];
          querySnap.forEach((doc) => {
            listingsArr.push({ id: doc.id, ...doc.data() });
          });
          setUserListings(listingsArr);
        } catch (error) {
          console.error("Error fetching user listings:", error);
          setUserListings([]);
        } finally {
          setLoadingListings(false);
        }
      } else {
        // Clear states if user logs out or is not logged in initially
        setUserData(null);
        setEditableDisplayName("");
        setUserListings([]);
      }
    };

    if (!checkingStatus) { // Only fetch when auth status is determined
        fetchUserData();
    }
  }, [currentUser, db, checkingStatus]); // Depend on currentUser, db, and checkingStatus

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully');
      navigate('/'); // Redirect to home after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleSaveDisplayName = async () => {
    // Use currentUser from hook
    if (!currentUser || !editableDisplayName || isSaving || editableDisplayName === userData?.displayName) return;

    setIsSaving(true);
    const userDocRef = doc(db, "users", currentUser.uid);

    try {
      await setDoc(userDocRef, { displayName: editableDisplayName }, { merge: true });
      setUserData(prevData => ({ ...prevData, displayName: editableDisplayName }));
      console.log("Display name updated successfully in Firestore!");
    } catch (error) {
      console.error("Error updating display name in Firestore:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Use checkingStatus for loading state
  if (checkingStatus) {
    return <p>Loading profile...</p>;
  }

  const formatTimestamp = (timestamp: Timestamp | undefined) => {
    if (!timestamp) return "Not available";
    return timestamp.toDate().toLocaleString();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Profile Page</h1>
      {loggedIn && currentUser ? ( // Check loggedIn and currentUser
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h2 className="text-2xl font-semibold mb-4 text-center">User Information</h2>
          {currentUser.photoURL && (
            <img
              src={currentUser.photoURL}
              alt="Profile"
              className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-300"
            />
          )}
          {/* Display Name Section */}
          <div className="mb-4">
            <strong className="block text-gray-700 text-sm font-bold mb-2">Display Name:</strong>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={editableDisplayName}
                onChange={(e) => setEditableDisplayName(e.target.value)}
                placeholder="Enter new display name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                disabled={isSaving}
              />
              <button
                onClick={handleSaveDisplayName}
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
            <p className="text-gray-700 text-base">{currentUser.email}</p>
          </div>
          <div className="mb-4">
            <strong className="block text-gray-700 text-sm font-bold mb-2">Email Verified:</strong>
            <p className="text-gray-700 text-base">{currentUser.emailVerified ? "Yes" : "No"}</p>
          </div>
          <div className="mb-6">
            <strong className="block text-gray-700 text-sm font-bold mb-2">User ID:</strong>
            <p className="text-gray-700 text-base">{currentUser.uid}</p>
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
             <p className="text-gray-500 text-sm">Loading additional user data...</p> // Show if userData is null after initial check
          )}

        </div>
      ) : (
          <div>
            <p className="text-red-500">No user is currently logged in.</p>
            <p>
              You can <Link to="/signin" className="text-blue-500 hover:underline">Sign In</Link> or <Link to="/signup" className="text-blue-500 hover:underline">Sign Up</Link>.
            </p>
          </div>
      )}
      {loggedIn && (
        <div className="w-full max-w-md mt-8">
          <h3 className="text-xl font-semibold mb-2">Your Listings</h3>
          {loadingListings ? (
            <p className="text-gray-500">Loading your listings...</p>
          ) : userListings.length === 0 ? (
            <p className="text-gray-500">You have not created any listings yet.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {userListings.map((listing) => (
                <li key={listing.id} className="py-2">
                  <Link
                    to={`/listing/${listing.id}`}
                    className="font-medium text-blue-600 hover:underline"
                  >
                    {listing.title || "Untitled Listing"}
                  </Link>
                  {/* Add more listing fields as needed */}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <div className="mt-4 space-x-4">
        {loggedIn && ( // Show Log Out button only if logged in
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