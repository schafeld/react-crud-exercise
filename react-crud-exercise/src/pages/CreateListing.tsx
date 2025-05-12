import { Link, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { getAuth } from "firebase/auth";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { db } from "../firebase";
import { Toast } from 'primereact/toast';
import ImageSelector from "../components/ImageSelector";
import LocationSelector from "../components/LocationSelector";

export default function CreateListing() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<{
    isNew: boolean;
    title: string;
    itemCount: number;
    maxPerCustomer: number;
    shortDescription: string;
    detailedDescription: string;
    price: number;
    images: File[];
    latitude: number | "";
    longitude: number | "";
    address: string;
  }>({
    isNew: true,
    title: "",
    itemCount: 1,
    maxPerCustomer: 1,
    shortDescription: "",
    detailedDescription: "",
    price: 0,
    images: [],
    latitude: "",
    longitude: "",
    address: "",
  });

  const navigate = useNavigate();
  const auth = getAuth();
  const toast = useRef<Toast>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleFileChange = (files: FileList | null) => {
    setFormData({
      ...formData,
      images: files ? Array.from(files) : []
    });
  };

  const handleLocationChange = (location: { latitude: number | ""; longitude: number | ""; address: string }) => {
    setFormData({ ...formData, ...location });
  };

  // Upload images to Firebase Storage
  const storeImages = async (images: File[]) => {
    return Promise.all(
      images.map((image) => {
        return new Promise<string>((resolve, reject) => {
          const storage = getStorage();
          const filename = `${auth.currentUser?.uid}-${image.name}-${Date.now()}`;
          const storageRef = ref(storage, `products/${filename}`);
          const uploadTask = uploadBytesResumable(storageRef, image);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Progress monitoring (optional)
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`Upload is ${progress}% done`);
            },
            (error) => {
              reject(error);
            },
            () => {
              // Get download URL on completion
              getDownloadURL(uploadTask.snapshot.ref)
                .then((downloadURL) => resolve(downloadURL))
                .catch((error) => reject(error));
            }
          );
        });
      })
    );
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    try {
      setLoading(true);
      
      if (!auth.currentUser) {
        toast.current?.show({ 
          severity: 'error',
          summary: 'Error',
          detail: "You must be logged in to create a listing"
        });
        return;
      }
      
      if (formData.images.length === 0) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: "Please add at least one image"
        });
        setLoading(false);
        return;
      }

      if (
        formData.latitude === "" ||
        formData.longitude === "" ||
        !formData.address.trim()
      ) {
        toast.current?.show({
          severity: 'error',
          summary: 'Error',
          detail: "Please provide a valid location"
        });
        setLoading(false);
        return;
      }

      // 1. Upload images to Firebase Storage
      const imgUrls = await storeImages(formData.images);
      
      // 2. Create listing object with image URLs and location
      const listingData = {
        isNew: formData.isNew,
        title: formData.title,
        itemCount: formData.itemCount,
        maxPerCustomer: formData.maxPerCustomer,
        shortDescription: formData.shortDescription,
        detailedDescription: formData.detailedDescription,
        price: formData.price,
        imgUrls: imgUrls, // Store array of image URLs
        userRef: auth.currentUser.uid,
        createdAt: serverTimestamp(),
        location: {
          latitude: formData.latitude,
          longitude: formData.longitude,
          address: formData.address,
        },
      };
      
      // 3. Save to Firestore
      const docRef = await addDoc(collection(db, "listings"), listingData);
      
      setLoading(false);
      toast.current?.show({
        severity: 'success',
        summary: 'Success',
        detail: "Listing created successfully"
      });
      navigate(`/listing/${docRef.id}`);
      
    } catch (error) {
      setLoading(false);
      console.error("Error creating listing:", error);
      toast.current?.show({
        severity: 'error',
        summary: 'Error',
        detail: "Could not create listing"
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
      <Toast ref={toast} />
      
      <h1 className="text-4xl font-bold text-gray-800 mt-6">Create a product listing</h1>
      <p className="text-gray-600 mt-4 mb-8">
        This is where you can create a new product listing.
      </p>

      <form onSubmit={handleSubmit} className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-md">
        {/* Line 1: Two buttons side by side */}
        <div className="flex flex-row gap-4 mb-6">
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md ${formData.isNew ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormData({ ...formData, isNew: true })}
          >
            New article
          </button>
          <button
            type="button"
            className={`flex-1 py-2 px-4 rounded-md ${!formData.isNew ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
            onClick={() => setFormData({ ...formData, isNew: false })}
          >
            Second hand
          </button>
        </div>

        {/* Line 2: Listing title input field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
            Listing Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Line 3: Two number input fields side by side */}
        <div className="flex flex-row gap-4 mb-6">
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="itemCount">
              Number of items
            </label>
            <input
              type="number"
              id="itemCount"
              name="itemCount"
              value={formData.itemCount}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxPerCustomer">
              Max items per customer
            </label>
            <input
              type="number"
              id="maxPerCustomer"
              name="maxPerCustomer"
              value={formData.maxPerCustomer}
              onChange={handleInputChange}
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Line 4: Input field "Short Product description" */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="shortDescription">
            Short Product description
          </label>
          <input
            type="text"
            id="shortDescription"
            name="shortDescription"
            value={formData.shortDescription}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Line 5: "Detailed product description" */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="detailedDescription">
            Detailled product description
          </label>
          <textarea
            id="detailedDescription"
            name="detailedDescription"
            value={formData.detailedDescription}
            onChange={handleInputChange}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          ></textarea>
        </div>

        {/* Line 6: "Price (per item)" */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="price">
            Price (per item)
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">$</span>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Location Selector */}
        <div className="mb-6">
          <LocationSelector
            latitude={formData.latitude}
            longitude={formData.longitude}
            address={formData.address}
            onChange={handleLocationChange}
          />
        </div>

        {/* Line 7: Image upload field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
            Images. First image will be cover image.
          </label>
          <ImageSelector
            onFilesChange={handleFileChange}
            selectedFiles={formData.images}
            label="Select files"
            multiple={true}
          />
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
            } text-white py-2 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500`}
          >
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>
      </form>

      <Link to="/" className="mt-6 text-blue-600 hover:underline">Go to Home</Link>
    </div>
  );
}
