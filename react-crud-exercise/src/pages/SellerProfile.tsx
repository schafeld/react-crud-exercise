import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getFirestore, doc, getDoc, collection, query, where, getDocs, DocumentData } from "firebase/firestore";
// import { getAuth } from "firebase/auth";
import { app } from "../firebase";

interface SellerData {
  displayName?: string;
  photoURL?: string;
  email?: string;
}

export default function SellerProfile() {
  const { sellerId } = useParams<{ sellerId: string }>();
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [listings, setListings] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);

  const db = getFirestore(app);

  useEffect(() => {
    const fetchSeller = async () => {
      if (!sellerId) return;
      setLoading(true);
      try {
        // Fetch seller user doc
        const userDoc = await getDoc(doc(db, "users", sellerId));
        if (userDoc.exists()) {
          setSeller(userDoc.data() as SellerData);
        } else {
          setSeller(null);
        }
        // Fetch seller's listings
        const listingsRef = collection(db, "listings");
        const q = query(listingsRef, where("userRef", "==", sellerId));
        const querySnap = await getDocs(q);
        const arr: DocumentData[] = [];
        querySnap.forEach((doc) => {
          arr.push({ id: doc.id, ...doc.data() });
        });
        setListings(arr);
      } catch (error) {
        setSeller(null);
        setListings([]);
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSeller();
  }, [sellerId, db]);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading seller profile...</div>;
  }

  if (!seller) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-bold text-red-600 mb-2">Seller not found</h2>
        <Link to="/" className="text-blue-600 hover:underline">Back to listings</Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Seller Profile</h2>
        {seller.photoURL && (
          <img
            src={seller.photoURL}
            alt="Seller"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-gray-300"
          />
        )}
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Name:</strong>
          <p className="text-gray-700 text-base">{seller.displayName || "No name provided"}</p>
        </div>
        <div className="mb-4">
          <strong className="block text-gray-700 text-sm font-bold mb-2">Email:</strong>
          <p className="text-gray-700 text-base">{seller.email || "No email provided"}</p>
        </div>
      </div>
      <div className="w-full max-w-md mt-8">
        <h3 className="text-xl font-semibold mb-2">Other Offers by this Seller</h3>
        {listings.length === 0 ? (
          <p className="text-gray-500">No other offers from this seller.</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {listings.map((listing) => (
              <li key={listing.id} className="py-2">
                <Link
                  to={`/listing/${listing.id}`}
                  className="font-medium text-blue-600 hover:underline"
                >
                  {listing.title || "Untitled Listing"}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <Link to="/" className="mt-6 text-blue-600 hover:underline">Back to listings</Link>
    </div>
  );
}