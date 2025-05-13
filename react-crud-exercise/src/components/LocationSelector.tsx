import React, { useEffect, useState, useRef } from "react";

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
  const [mapHeight, setMapHeight] = useState(200);
  const [dragging, setDragging] = useState(false);
  const startY = useRef(0);
  const startHeight = useRef(200);

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

  const geocodeAddress = async (address: string) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
      const { lat, lon } = data[0];
      onChange({
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
        address,
      });
    }
  };

  const mapSrc =
    latitude && longitude
      ? `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`
      : "";

  // Drag handlers for resizing map
  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    startY.current = e.clientY;
    startHeight.current = mapHeight;
    document.body.style.cursor = "ns-resize";
  };

  const handleDrag = (e: MouseEvent) => {
    if (!dragging) return;
    const delta = e.clientY - startY.current;
    setMapHeight(Math.max(100, startHeight.current + delta));
  };

  const handleDragEnd = () => {
    setDragging(false);
    document.body.style.cursor = "";
  };

  useEffect(() => {
    if (dragging) {
      window.addEventListener("mousemove", handleDrag);
      window.addEventListener("mouseup", handleDragEnd);
      return () => {
        window.removeEventListener("mousemove", handleDrag);
        window.removeEventListener("mouseup", handleDragEnd);
        document.body.style.cursor = "";
      };
    }
  }, [dragging]);

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
        <div className="flex gap-2">
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
          <button
            type="button"
            className="px-3 py-2 bg-blue-500 text-white rounded-md"
            onClick={() => geocodeAddress(address)}
            title="Set coordinates from address"
          >
            Set coords
          </button>
        </div>
      </div>
      {geoLoading && (
        <div className="text-xs text-gray-500 mb-2">Detecting location...</div>
      )}
      {latitude && longitude && (
        <div className="mt-2">
          <iframe
            title="Google Maps Location"
            width="100%"
            height={mapHeight}
            frameBorder="0"
            src={mapSrc}
            allowFullScreen
            className="rounded-md border"
            style={{ resize: "none", pointerEvents: "auto" }}
          ></iframe>
          <div
            style={{
              height: "8px",
              cursor: "ns-resize",
              background: "#e5e7eb",
              borderRadius: "0 0 0.375rem 0.375rem",
              marginTop: "-8px",
              position: "relative",
              zIndex: 10,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              userSelect: "none",
            }}
            onMouseDown={handleDragStart}
            title="Drag to resize map"
          >
            <div style={{
              width: 40,
              height: 4,
              background: "#9ca3af",
              borderRadius: 2,
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelector;