import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
// import { useFirestoreUser } from "../hooks/useFirestoreUser"; TODO: Remove this if no user data is needed
import { collection, getDocs, query, orderBy, limit, startAfter, QueryDocumentSnapshot } from "firebase/firestore";
import { db } from "../firebase";

interface Listing {
  id: string;
  title: string;
  price: number;
  imgUrls: string[];
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
}

export default function Offers() {
  const { loggedIn, checkingStatus } = useAuthStatus();
  // const { userData, loading: userLoading } = useFirestoreUser();
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(false);
  
  const isLoading = checkingStatus || loading; //  || userLoading
  
  // Fetch initial listings
  useEffect(() => {
    const fetchListings = async () => {
      try {
        setLoading(true);
        
        // Create query for 6 items (5 to display + 1 to check if there are more)
        const listingsRef = collection(db, "listings");
        const q = query(
          listingsRef,
          orderBy("createdAt", "desc"),
          limit(6)
        );
        
        // Execute query
        const querySnap = await getDocs(q);
        
        const lastVisibleDoc = querySnap.docs[querySnap.size - 1];
        const hasMoreListings = querySnap.size > 5;
        
        // Process results
        const listingsData: Listing[] = [];
        querySnap.forEach((doc) => {
          if (listingsData.length < 5) { // Only take the first 5
            listingsData.push({
              id: doc.id,
              ...doc.data(),
            } as Listing);
          }
        });
        
        setListings(listingsData);
        setLastVisible(lastVisibleDoc);
        setHasMore(hasMoreListings);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching listings:", error);
        setLoading(false);
      }
    };
    
    fetchListings();
  }, []);
  
  // Fetch next page of listings
  const fetchMoreListings = async () => {
    try {
      setLoading(true);
      
      // Create query for next 6 items
      const listingsRef = collection(db, "listings");
      const q = query(
        listingsRef,
        orderBy("createdAt", "desc"),
        startAfter(lastVisible),
        limit(6)
      );
      
      // Execute query
      const querySnap = await getDocs(q);
      
      const lastVisibleDoc = querySnap.docs[querySnap.size - 1];
      const hasMoreListings = querySnap.size > 5;
      
      // Process results
      const listingsData: Listing[] = [];
      querySnap.forEach((doc) => {
        if (listingsData.length < 5) { // Only take the first 5
          listingsData.push({
            id: doc.id,
            ...doc.data(),
          } as Listing);
        }
      });
      
      setListings(listingsData);
      setLastVisible(lastVisibleDoc);
      setHasMore(hasMoreListings);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching more listings:", error);
      setLoading(false);
    }
  };
  
  // Format date
  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return "";
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };
  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Recent Listings</h1>
      <p className="text-gray-600 mt-2 mb-8">
        Browse our latest product listings
      </p>

      {isLoading ? (
        <div className="w-full max-w-4xl flex justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Listings grid */}
          <div className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {listings.length > 0 ? (
                listings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                    <Link to={`/listing/${listing.id}`} className="block">
                      <div className="h-48 overflow-hidden">
                        {listing.imgUrls && listing.imgUrls.length > 0 ? (
                          <img 
                            src={listing.imgUrls[0]} 
                            alt={listing.title}
                            className="w-full h-full object-cover" 
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No image</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 truncate">
                          {listing.title}
                        </h3>
                        <p className="text-xl font-bold text-blue-600 mb-2">
                          ${listing.price.toFixed(2)}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(listing.createdAt)}
                        </p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col-span-3 text-center p-8">
                  <p className="text-gray-500">No listings found</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-between items-center my-8">
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md"
                disabled={loading}
              >
                First Page
              </button>
              
              {hasMore && (
                <button
                  onClick={fetchMoreListings}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Next Page →"}
                </button>
              )}
            </div>
          </div>
          
          {/* Create listing CTA */}
          <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md mt-8">
            {loggedIn ? (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Want to sell something?</h3>
                  <p className="text-gray-600">Create your own listing now.</p>
                </div>
                <Link 
                  to="/create-listing" 
                  className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md"
                >
                  Create Listing
                </Link>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Want to sell something?</h3>
                  <p className="text-gray-600">Sign in to create your own listing.</p>
                </div>
                <Link 
                  to="/signin" 
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md"
                >
                  Sign In
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}