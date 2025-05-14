import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { doc, getDoc, deleteDoc, doc as firestoreDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Toast } from 'primereact/toast';
import { useRef } from "react";
import DeletionDialog from "../components/DeletionDialog";

// Interface for the listing data
interface ListingData {
  isNew: boolean;
  title: string;
  itemCount: number;
  maxPerCustomer: number;
  shortDescription: string;
  detailedDescription: string;
  price: number;
  imgUrls: string[];
  userRef: string;
  createdAt: {
    seconds: number;
    nanoseconds: number; // Firestore timestamp format
  };
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

export default function DisplayListing() {
  const [listing, setListing] = useState<ListingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sellerName, setSellerName] = useState<string | null>(null);
  const params = useParams();
  const auth = getAuth();
  const toast = useRef<Toast>(null);
  
  // Check if the current user is the listing owner
  const isOwner = auth.currentUser?.uid === listing?.userRef;

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const listingId = params.listingId;
        if (!listingId) {
          throw new Error("Listing ID not found");
        }

        const docRef = doc(db, "listings", listingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setListing(docSnap.data() as ListingData);
          // Fetch seller name
          const userRef = docSnap.data().userRef;
          if (userRef) {
            const sellerDoc = await getDoc(doc(db, "users", userRef));
            if (sellerDoc.exists()) {
              setSellerName(sellerDoc.data().displayName || null);
            }
          }
          setLoading(false);
        } else {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: "Listing not found"
          });
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: "Could not fetch listing"
        });
        setLoading(false);
      }
    };

    fetchListing();
  }, [params.listingId]);

  const handleDelete = async () => {
    if (!params.listingId) return;
    setDeleting(true);
    try {
      await deleteDoc(firestoreDoc(db, "listings", params.listingId));
      toast.current?.show({
        severity: 'success',
        summary: 'Deleted',
        detail: 'Listing deleted successfully',
      });
      setShowDeleteDialog(false);
      // Optionally redirect to home after deletion
      setTimeout(() => {
        window.location.href = "/";
      }, 1200);
    } catch (error) {
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to delete listing: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setShowDeleteDialog(false);
    } finally {
      setDeleting(false);
    }
  };

  // Format the date for display
  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return "Unknown date";
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Listing Not Found</h1>
        <Link to="/" className="text-blue-600 hover:underline">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <Toast ref={toast} />
      <DeletionDialog
        visible={showDeleteDialog}
        onCancel={() => setShowDeleteDialog(false)}
        onDelete={handleDelete}
        deleting={deleting}
      />
      
      <div className="w-full max-w-6xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">{listing.title}</h1>
        
        <div className="flex flex-row items-center gap-4 mb-6">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            listing.isNew ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
          }`}>
            {listing.isNew ? "New" : "Second hand"}
          </span>
          
          <span className="text-gray-500">
            Posted on {formatDate(listing.createdAt)}
          </span>
        </div>
        
        {/* Image gallery */}
        <div className="mb-8">
          <div className="mb-4 h-96 overflow-hidden rounded-lg">
            {listing.imgUrls && listing.imgUrls.length > 0 ? (
              <img
                src={listing.imgUrls[activeImageIndex]}
                alt={`${listing.title} - Image ${activeImageIndex + 1}`}
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>
          
          {/* Thumbnail gallery */}
          {listing.imgUrls && listing.imgUrls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {listing.imgUrls.map((url, index) => (
                <div
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 cursor-pointer rounded-md overflow-hidden border-2 ${
                    index === activeImageIndex ? "border-blue-500" : "border-transparent"
                  }`}
                >
                  <img
                    src={url}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Listing details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">Details</h2>
            
            <div className="space-y-4">
              <p className="text-gray-600 mb-4">{listing.shortDescription}</p>
              
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Description</h3>
                <p className="text-gray-600 whitespace-pre-line">{listing.detailedDescription}</p>
              </div>

              {/* Location info */}
              {listing.location && listing.location.latitude && listing.location.longitude && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Location</h3>
                  <div className="text-gray-600 text-sm mb-1">
                    <span className="font-semibold">Address:</span> {listing.location.address}
                  </div>
                  <div className="text-gray-600 text-sm mb-1">
                    <span className="font-semibold">Coordinates:</span> {listing.location.latitude}, {listing.location.longitude}
                  </div>
                  <iframe
                    title="Google Maps Location"
                    width="100%"
                    height="200"
                    frameBorder="0"
                    src={`https://maps.google.com/maps?q=${listing.location.latitude},${listing.location.longitude}&z=15&output=embed`}
                    allowFullScreen
                    className="rounded-md border mt-2"
                  ></iframe>
                </div>
              )}
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="mb-4">
              <span className="text-3xl font-bold text-gray-900">${listing.price.toFixed(2)}</span>
              <span className="text-gray-500 ml-2">per item</span>
            </div>
            
            <div className="space-y-4 mb-6">
              <div>
                <span className="font-semibold text-gray-700">Available items:</span>
                <span className="ml-2 text-gray-600">{listing.itemCount}</span>
              </div>
              
              <div>
                <span className="font-semibold text-gray-700">Maximum per customer:</span>
                <span className="ml-2 text-gray-600">{listing.maxPerCustomer}</span>
              </div>
            </div>
            
            {/* Show "Add to Cart" only if NOT logged in */}
            {!auth.currentUser && (
              <button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              >
                Add to Cart
              </button>
            )}
            
            {/* Show edit/delete buttons if the user is the owner */}
            {isOwner && (
              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/edit-listing/${params.listingId}`}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Edit
                </Link>
                <button
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  onClick={() => setShowDeleteDialog(true)}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Seller Profile Link */}
      <div className="mt-8 w-full max-w-6xl flex justify-end">
        <Link
          to={`/seller/${listing.userRef}`}
          className="text-blue-600 hover:underline text-lg"
        >
          View {sellerName ? `${sellerName}'s` : "Seller"} Vendor Profile
        </Link>
      </div>

      <Link to="/" className="mt-6 text-blue-600 hover:underline">Back to listings</Link>
    </div>
  );
}