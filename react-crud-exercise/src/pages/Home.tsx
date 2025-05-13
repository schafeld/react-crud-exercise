import { Link } from "react-router-dom";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { useFirestoreUser } from "../hooks/useFirestoreUser";
import RecentOffers from "../components/RecentOffers";

export default function Home() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  const { userData, loading } = useFirestoreUser();
  
  const isLoading = checkingStatus || loading;

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Home Page</h1>

      {isLoading ? (
        <p className="text-gray-600 mt-4">Loading...</p>
      ) : loggedIn ? (
        <p className="text-gray-600 mt-4">
          Welcome, <em>{userData?.displayName || "User"}</em>! This is your home page.
        </p>
      ) : (
            <p className="text-gray-600 mt-4">
              You are not logged in. Please <Link to="/signin" className="text-blue-500">sign in</Link> to access your account.
            </p>
      )}
      <h3 className="text-2xl font-semibold text-gray-800 mt-6">Recent Offers - New Stuff</h3>
      <RecentOffers
        isNew={true} // true for new offers | false for recent offers | undefined or null for all recent offers
        showImage={true}
        showTitle={true}
        showDescription={true}
        showPrice={true}
        showDate={true}
        limit={5}
      />
      <h3 className="text-2xl font-semibold text-gray-800 mt-6">Recent Offers - Used Items</h3>
      <RecentOffers
        isNew={false} // true for new offers | false for recent offers | undefined or null for all recent offers
        showImage={true}
        showTitle={true}
        showDescription={false}
        showPrice={true}
        showDate={false}
        limit={5}
      />
      {/* <Link to="/about">About</Link>
      <Link to="/app">App</Link> */}
    </div>
  );
}