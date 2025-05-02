import { Link } from "react-router-dom";
import { useState } from "react";

export default function CreateListing() {
  const [formData, setFormData] = useState<{
    isNew: boolean;
    title: string;
    itemCount: number;
    maxPerCustomer: number;
    shortDescription: string;
    detailedDescription: string;
    price: number;
    images: File[];
  }>({
    isNew: true,
    title: "",
    itemCount: 1,
    maxPerCustomer: 1,
    shortDescription: "",
    detailedDescription: "",
    price: 0,
    images: []
  });


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      images: Array.from(e.target.files || [])
    });
  };


  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Add API call to save the listing
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gray-100 p-6">
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

        {/* Line 7: Image upload field */}
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="images">
            Images. First image will be cover image.
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end mt-8">
          <button
            type="submit"
            className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Create Listing
          </button>
        </div>
      </form>

      <Link to="/" className="mt-6 text-blue-600 hover:underline">Go to Home</Link>
    </div>
  )
}
