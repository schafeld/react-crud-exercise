import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Toast } from 'primereact/toast';
import ImageSelector from "../components/ImageSelector";
import LocationSelector from "../components/LocationSelector";

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
  displayLocation?: boolean; // Add this flag
  createdAt: {
    seconds: number;
    nanoseconds: number;
  };
  location?: {
    latitude: number | "";
    longitude: number | "";
    address: string;
  };
}

export default function EditListing() {
  const [formData, setFormData] = useState<Omit<ListingData, 'userRef' | 'createdAt' | 'imgUrls'> & {
    imgUrls: string[];
    displayLocation: boolean; // Add this property
    latitude: number | "";
    longitude: number | "";
    address: string;
  }>({
    isNew: false,
    title: "",
    itemCount: 1,
    maxPerCustomer: 1,
    shortDescription: "",
    detailedDescription: "",
    price: 0,
    imgUrls: [],
    displayLocation: false, // Default to false
    latitude: "",
    longitude: "",
    address: "",
  });
  
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [images, setImages] = useState<FileList | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const params = useParams();
  const navigate = useNavigate();
  const auth = getAuth();
  const toast = useRef<Toast>(null);

  // Fetch existing listing data
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
          const data = docSnap.data() as ListingData;
          
          // Check if the current user is the listing owner
          if (auth.currentUser?.uid !== data.userRef) {
            toast.current?.show({
              severity: 'error',
              summary: 'Unauthorized',
              detail: "You don't have permission to edit this listing"
            });
            navigate(`/listing/${listingId}`);
            return;
          }
          
          setFormData({
            isNew: data.isNew,
            title: data.title,
            itemCount: data.itemCount,
            maxPerCustomer: data.maxPerCustomer,
            shortDescription: data.shortDescription,
            detailedDescription: data.detailedDescription,
            price: data.price,
            imgUrls: [],
            displayLocation: data.displayLocation || false, // Get displayLocation from data or default to false
            latitude: data.location?.latitude ?? "",
            longitude: data.location?.longitude ?? "",
            address: data.location?.address ?? "",
          });
          setExistingImages(data.imgUrls || []);
          setLoading(false);
        } else {
          toast.current?.show({
            severity: 'error',
            summary: 'Error',
            detail: "Listing not found"
          });
          navigate("/");
        }
      } catch (error) {
        console.error("Error fetching listing:", error);
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: "Could not fetch listing details"
        });
        navigate("/");
      }
    };

    fetchListing();
  }, [params.listingId, auth.currentUser?.uid, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    
    // Handle checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prevState) => ({
        ...prevState,
        [id]: checked,
      }));
      return;
    }
    
    // Handle number inputs
    if (type === 'number') {
      let parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) parsedValue = 0;
      
      setFormData((prevState) => ({
        ...prevState,
        [id]: parsedValue,
      }));
      return;
    }
    
    // Handle text inputs
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleImageChange = (files: FileList | null) => {
    setImages(files);
  };

  const deleteImage = async (imageUrl: string): Promise<void> => {
    try {
      const urlPath = imageUrl.split('?')[0];
      const storageRef = ref(getStorage(), urlPath);
      
      await deleteObject(storageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  const removeExistingImage = async (index: number) => {
    const imageToRemove = existingImages[index];
    setExistingImages(existingImages.filter((_, idx) => idx !== index));
    await deleteImage(imageToRemove);
  };

  const handleLocationChange = (location: { latitude: number | ""; longitude: number | ""; address: string }) => {
    setFormData((prev) => ({
      ...prev,
      latitude: location.latitude,
      longitude: location.longitude,
      address: location.address,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const listingId = params.listingId;
      if (!listingId) throw new Error("Listing ID not found");
      
      if (!auth.currentUser) throw new Error("You must be logged in");
      
      const docRef = doc(db, "listings", listingId);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        throw new Error("Listing not found");
      }
      
      const oldData = docSnap.data() as ListingData;
      const oldImages = oldData.imgUrls || [];
      
      const imagesToDelete = oldImages.filter(url => !existingImages.includes(url));
      
      for (const imageUrl of imagesToDelete) {
        await deleteImage(imageUrl);
      }
      
      let imageUrls = [...existingImages];
      
      if (images && images.length > 0) {
        const promises = Array.from(images).map(async (image) => {
          return await uploadImage(image);
        });
        
        const uploadedImages = await Promise.all(promises);
        imageUrls = [...existingImages, ...uploadedImages];
      }
      
      await updateDoc(docRef, {
        isNew: formData.isNew,
        title: formData.title,
        itemCount: formData.itemCount,
        maxPerCustomer: formData.maxPerCustomer,
        shortDescription: formData.shortDescription,
        detailedDescription: formData.detailedDescription,
        price: formData.price,
        imgUrls: imageUrls,
        displayLocation: formData.displayLocation, // Add displayLocation flag
        location: formData.displayLocation ? {
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.address,
        } : null, // Only include location data if displayLocation is true
        updatedAt: serverTimestamp(),
      });
      
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: "Listing updated successfully"
      });
      
      navigate(`/listing/${listingId}`);
    } catch (error) {
      console.error("Error updating listing:", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: "Failed to update listing"
      });
      setSubmitting(false);
    }
  };
  
  const uploadImage = async (image: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storage = getStorage();
      const filename = `${auth.currentUser?.uid}-${image.name}-${Date.now()}`;
      const storageRef = ref(storage, `listings/${filename}`);
      const uploadTask = uploadBytesResumable(storageRef, image);
      
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          reject(error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <Toast ref={toast} />
      
      <div className="w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Listing</h1>
        
        <form onSubmit={handleSubmit}>
          {/* Basic Information */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  id="isNew"
                  checked={formData.isNew}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">Item is new</span>
              </label>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="itemCount" className="block text-sm font-medium text-gray-700 mb-1">
                  Available Items
                </label>
                <input
                  type="number"
                  id="itemCount"
                  value={formData.itemCount}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="maxPerCustomer" className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Per Customer
                </label>
                <input
                  type="number"
                  id="maxPerCustomer"
                  value={formData.maxPerCustomer}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                  Price ($)
                </label>
                <input
                  type="number"
                  id="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Descriptions */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Descriptions</h2>
            
            <div className="mb-4">
              <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Short Description
              </label>
              <input
                type="text"
                id="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="detailedDescription" className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description
              </label>
              <textarea
                id="detailedDescription"
                value={formData.detailedDescription}
                onChange={handleChange}
                rows={5}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>
          
          {/* Display Location Toggle */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Location</h2>
            <div className="flex items-center mb-4">
              <button
                type="button"
                className={`py-2 px-4 rounded-md ${
                  formData.displayLocation 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-700'
                }`}
                onClick={() => setFormData({ ...formData, displayLocation: !formData.displayLocation })}
              >
                {formData.displayLocation ? 'Hide location' : 'Display location'}
              </button>
              <span className="ml-3 text-sm text-gray-600">
                {formData.displayLocation 
                  ? 'Location will be visible to customers' 
                  : 'Location will be hidden from customers'}
              </span>
            </div>

            {/* Location Selector - only show when displayLocation is true */}
            {formData.displayLocation && (
              <LocationSelector
                latitude={formData.latitude}
                longitude={formData.longitude}
                address={formData.address}
                onChange={handleLocationChange}
              />
            )}
          </div>

          {/* Images */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            <ImageSelector
              existingImages={existingImages}
              onRemoveExistingImage={removeExistingImage}
              onFilesChange={handleImageChange}
              selectedFiles={images || undefined}
              label="Add New Images"
              multiple={true}
              uploadProgress={uploadProgress}
            />
          </div>
          
          {/* Submit buttons */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                submitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitting ? "Updating..." : "Update Listing"}
            </button>
            
            <button
              type="button"
              onClick={() => navigate(`/listing/${params.listingId}`)}
              disabled={submitting}
              className="flex-1 py-3 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
