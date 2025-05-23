import { Link, useSearchParams } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import { useAuthStatus } from "../hooks/useAuthStatus";
import { collection, getDocs, query, orderBy, limit, startAfter, QueryDocumentSnapshot, getCountFromServer, doc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { db, storage } from "../firebase";
import { Toast } from "primereact/toast";
// // Add PrimeReact PrimeIcons import:
// import "primereact/resources/primereact.min.css";
// import "primeicons/primeicons.css";

// Configuration constant for number of items per page
const ITEMS_PER_PAGE = 3;

interface Listing {
  id: string;
  title: string;
  price: number;
  imgUrls: string[];
  createdAt: {
    seconds: number;
    nanoseconds: number; // Firestore timestamp format
  };
  isNew: boolean;
  userRef?: string; // <-- Add this if not present
}

export default function Offers() {
  const { loggedIn, checkingStatus, currentUser } = useAuthStatus(); // Use currentUser directly
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get page from URL or default to page 1
  const currentPage = parseInt(searchParams.get("page") || "1");
  
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [pageCache, setPageCache] = useState<Map<number, Listing[]>>(new Map());
  
  const isLoading = checkingStatus || loading;
  
  const toast = useRef<Toast>(null);
  
  // Fetch total count for pagination
  useEffect(() => {
    const fetchTotalCount = async () => {
      try {
        const listingsRef = collection(db, "listings");
        const snapshot = await getCountFromServer(listingsRef);
        const totalCount = snapshot.data().count;
        const pages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPages(pages > 0 ? pages : 1);
      } catch (error) {
        console.error("Error fetching total count:", error);
      }
    };
    
    fetchTotalCount();
  }, []);
  

  
  const handleDeleteListing = async (listingId: string, listingImages: string[]) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      try {
        setLoading(true);
        
        // 1. Delete all images from storage
        if (listingImages && listingImages.length > 0) {
          // First approach: delete images directly from URLs
          const deletePromises = listingImages.map(async (imageUrl) => {
            // Extract the path from the URL
            const imagePath = imageUrl.split('firebasestorage.googleapis.com/')[1].split('?')[0];
            const fullPath = decodeURIComponent(imagePath.split('/o/')[1]);
            const imageRef = ref(storage, fullPath);
            return deleteObject(imageRef);
          });
          
          await Promise.all(deletePromises);
        }
        
        // 2. Delete the listing document
        const listingRef = doc(db, "listings", listingId);
        await deleteDoc(listingRef);
        
        // 3. Update the UI - both current listings and cache
        setListings(prev => prev.filter(listing => listing.id !== listingId));
        
        // 4. Update the page cache to remove the deleted listing from all cached pages
        setPageCache(prev => {
          const newCache = new Map(prev);
          // Update each page in the cache
          newCache.forEach((pageListings, pageNum) => {
            newCache.set(
              pageNum, 
              pageListings.filter(listing => listing.id !== listingId)
            );
          });
          return newCache;
        });
        
        // 5. Refresh data if the current page becomes empty
        const currentPageData = pageCache.get(currentPage) || [];
        const updatedCurrentPageData = currentPageData.filter(listing => listing.id !== listingId);
        if (updatedCurrentPageData.length === 0 && currentPage > 1) {
          // If the page is now empty and it's not the first page, go to previous page
          handlePageChange(currentPage - 1);
        } else if (updatedCurrentPageData.length === 0) {
          // If it's the first page and now empty, we need to refresh
          fetchListings();
        }
        
        // 6. Update total count and pages
        const listingsRef = collection(db, "listings");
        const snapshot = await getCountFromServer(listingsRef);
        const totalCount = snapshot.data().count;
        const pages = Math.ceil(totalCount / ITEMS_PER_PAGE);
        setTotalPages(pages > 0 ? pages : 1);
        
        // 7. Show success message
        toast.current?.show({
          severity: 'success',
          summary: 'Success',
          detail: 'Listing deleted successfully',
          life: 3000
        });
        
      } catch (error) {
        console.error("Error deleting listing:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete listing',
          life: 3000
        });
      } finally {
        setLoading(false);
      }
    }
  };

  // Add this helper function for the refresh case
  const fetchListings = useCallback(async () => {
    try {
      setLoading(true);
      
      // Clear the cache for the current page to force a fresh fetch
      setPageCache(prev => {
        const newCache = new Map(prev);
        newCache.delete(currentPage);
        return newCache;
      });
      
      const listingsRef = collection(db, "listings");
      const skipCount = (currentPage - 1) * ITEMS_PER_PAGE;
      
      // For Firestore pagination, we need to get documents up to the start of our page
      // and then get the page we want
      let lastDoc: QueryDocumentSnapshot | null = null;
      
      // If we're not on the first page, we need to find our starting point
      if (currentPage > 1) {
        // Find the document that's right before our page starts
        const prevPageQuery = query(
          listingsRef,
          orderBy("createdAt", "desc"),
          limit(skipCount)
        );
        const prevPageSnapshot = await getDocs(prevPageQuery);
        lastDoc = prevPageSnapshot.docs[prevPageSnapshot.docs.length - 1];
      }
      
      // Create the query for the current page
      let pageQuery;
      if (lastDoc) {
        pageQuery = query(
          listingsRef,
          orderBy("createdAt", "desc"),
          startAfter(lastDoc),
          limit(ITEMS_PER_PAGE)
        );
      } else {
        pageQuery = query(
          listingsRef,
          orderBy("createdAt", "desc"),
          limit(ITEMS_PER_PAGE)
        );
      }
      
      // Execute the query
      const querySnap = await getDocs(pageQuery);
      
      // Process results
      const listingsData: Listing[] = [];
      querySnap.forEach((doc) => {
        const data = doc.data();
        listingsData.push({
          id: doc.id,
          title: data.title,
          price: data.price,
          imgUrls: data.imgUrls,
          createdAt: data.createdAt,
          isNew: data.isNew,
          userRef: data.userRef,
        });
      });
      
      // Cache the results
      setPageCache(prev => new Map(prev).set(currentPage, listingsData));
      setListings(listingsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching listings:", error);
      setLoading(false);
    }
  }, [currentPage]);

  // Fetch listings based on current page
  useEffect(() => {
    fetchListings();
  }, [fetchListings]);
  
  // Handle page changes
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setSearchParams({ page: page.toString() });
    }
  };
  
  // Format date
  const formatDate = (timestamp: { seconds: number; nanoseconds: number }) => {
    if (!timestamp) return "";
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };
  
  // Generate pagination buttons
  const renderPagination = () => {
    const pages = [];
    const maxDisplayedPages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    const endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
    
    if (endPage - startPage + 1 < maxDisplayedPages) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }
    
    // First page button
    pages.push(
      <button 
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1 || loading}
        className={`px-3 py-1 mx-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
      >
        &laquo;
      </button>
    );
    
    // Previous page button
    pages.push(
      <button 
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className={`px-3 py-1 mx-1 rounded-md ${currentPage === 1 ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
      >
        &lt;
      </button>
    );
    
    // Page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button 
          key={i}
          onClick={() => handlePageChange(i)}
          disabled={loading}
          className={`px-3 py-1 mx-1 rounded-md ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
        >
          {i}
        </button>
      );
    }
    
    // Next page button
    pages.push(
      <button 
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className={`px-3 py-1 mx-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
      >
        &gt;
      </button>
    );
    
    // Last page button
    pages.push(
      <button 
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages || loading}
        className={`px-3 py-1 mx-1 rounded-md ${currentPage === totalPages ? 'bg-gray-200 text-gray-400' : 'bg-gray-200 hover:bg-gray-300 text-gray-700'}`}
      >
        &raquo;
      </button>
    );
    
    return pages;
  };
  
  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <Toast ref={toast} />
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Recent Listings</h1>
      <p className="text-gray-600 mt-2 mb-8">
        Browse our latest product listings (Page {currentPage} of {totalPages})
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
                listings.map((listing) => {
                  return (
                    <div key={listing.id} className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow relative">
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

                        {/* Badge for New or Second Hand */}
                        <span
                          className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded ${
                            listing.isNew
                              ? "bg-green-500 text-white"
                              : "bg-yellow-400 text-gray-800"
                          }`}
                        >
                          {listing.isNew ? "New" : "Second Hand"}
                        </span>
                        
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
                      {/* Pencil icon button for owner's listings */}
                      {currentUser && listing.userRef === currentUser.uid && (
                        <div className="absolute bottom-2 right-2 flex space-x-2" style={{ zIndex: 2 }}>
                          <Link
                            to={`/edit-listing/${listing.id}`}
                            className="bg-white rounded-2 px-2 py-1 shadow hover:bg-gray-100 transition"
                            title="Edit Listing"
                          >
                            <i className="pi pi-pencil text-gray-600" style={{ fontSize: "0.8rem" }} />
                          </Link>
                          
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              handleDeleteListing(listing.id, listing.imgUrls || []);
                            }}
                            className="bg-white rounded-2 px-2 py-1 shadow hover:bg-gray-100 transition"
                            title="Delete Listing"
                          >
                            <i className="pi pi-trash text-red-600" style={{ fontSize: "0.8rem" }} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-3 text-center p-8">
                  <p className="text-gray-500">No listings found</p>
                </div>
              )}
            </div>
            
            {/* Pagination */}
            <div className="flex justify-center items-center my-8">
              {renderPagination()}
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