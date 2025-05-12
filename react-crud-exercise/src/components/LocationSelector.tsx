import React, { useEffect, useState } from "react";

interface LocationSelectorProps {
  latitude: number | "";
  longitude: number | "";
  address: string;
  onChange: (location: { latitude: number | ""; longitude: number | ""; address: string }) => void;
}

const LocationSelector: React.FC<LocationSelectorProps> = ({
  latitude,
  longitude,
  address,
  onChange,
}) => {
  const [geoLoading, setGeoLoading] = useState(false);

  useEffect(() => {
    if ((latitude === "" || longitude === "") && "geolocation" in navigator) {
      setGeoLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onChange({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude,
            address,
          });
          setGeoLoading(false);
        },
        () => setGeoLoading(false)
      );
    }
    // eslint-disable-next-line
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    onChange({
      latitude: name === "latitude" ? Number(value) : latitude,
      longitude: name === "longitude" ? Number(value) : longitude,
      address: name === "address" ? value : address,
    });
  };

  const mapSrc =
    latitude && longitude
      ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
      : "";

  return (
    <div className="mb-6">
      <label className="block text-gray-700 text-sm font-bold mb-2">Location</label>
      <div className="flex flex-col md:flex-row gap-4 mb-2">
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1" htmlFor="latitude">
            Latitude
          </label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={latitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Latitude"
            required
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs text-gray-600 mb-1" htmlFor="longitude">
            Longitude
          </label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={longitude}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Longitude"
            required
          />
        </div>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-600 mb-1" htmlFor="address">
          Address/Description
        </label>
        <textarea
          id="address"
          name="address"
          value={address}
          onChange={handleInputChange}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Short address or description"
          required
        />
      </div>
      {geoLoading && (
        <div className="text-xs text-gray-500 mb-2">Detecting location...</div>
      )}
      {latitude && longitude && (
        <div className="mt-2">
          <iframe
            title="Google Maps Location"
            width="100%"
            height="200"
            frameBorder="0"
            src={mapSrc}
            allowFullScreen
            className="rounded-md border"
          ></iframe>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;