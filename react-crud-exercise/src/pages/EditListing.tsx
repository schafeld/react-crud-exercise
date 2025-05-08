import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { Toast } from 'primereact/toast';

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
    nanoseconds: number;
  };
}

export default function EditListing() {
  const [formData, setFormData] = useState<Omit<ListingData, 'userRef' | 'createdAt'>>({
    isNew: false,
    title: "",
    itemCount: 1,
    maxPerCustomer: 1,
    shortDescription: "",
    detailedDescription: "",
    price: 0,
    imgUrls: []
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
            imgUrls: []
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImages(e.target.files);
    }
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
        ...formData,
        imgUrls: imageUrls,
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
          
          {/* Images */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Images</h2>
            
            {/* Existing images */}
            {existingImages.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Current Images</p>
                <div className="flex flex-wrap gap-4">
                  {existingImages.map((url, index) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Listing image ${index}`}
                        className="w-24 h-24 object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Upload new images */}
            <div>
              <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                Add New Images
              </label>
              <input
                type="file"
                id="images"
                onChange={handleImageChange}
                accept="image/*"
                multiple
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="mt-2">
                <div className="h-2 bg-gray-200 rounded-full">
                  <div 
                    className="h-full bg-blue-600 rounded-full" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Uploading: {Math.round(uploadProgress)}%</p>
              </div>
            )}
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
