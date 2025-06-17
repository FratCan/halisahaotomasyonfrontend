// 4. LocationPicker bileşeni (ayrı dosyada tanımla):
// LocationPicker.js
//import React, { useState } from "react";
//import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
/*
const LocationPicker = ({ onLocationChange, city, town }) => {
  const [marker, setMarker] = useState(null);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "YOUR_GOOGLE_API_KEY",
    libraries: ["places"]
  });

  const handleClick = async (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setMarker({ lat, lng });

    const geocoder = new window.google.maps.Geocoder();
    const res = await geocoder.geocode({ location: { lat, lng } });
    const comps = res[0]?.address_components;

    const city = comps?.find(c => c.types.includes("administrative_area_level_1"))?.long_name;
    const town = comps?.find(c => c.types.includes("administrative_area_level_2"))?.long_name;

    onLocationChange({ lat, lng, city, town });
  };

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={{ height: "300px", width: "100%" }}
        center={marker || { lat: 39.9208, lng: 32.8541 }}
        zoom={marker ? 14 : 6}
        onClick={handleClick}
      >
        {marker && <Marker position={marker} />}
      </GoogleMap>
    </>
  ) : <div>Harita yükleniyor...</div>;
};
*/
// LocationPicker.js
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Marker ikon düzeltmesi (Leaflet bug fix)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
});

const LocationPicker = ({ onLocationChange }) => {
  const [markerPosition, setMarkerPosition] = useState(null);

  const reverseGeocode = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
      );
      const data = await response.json();
      const address = data.address;

      const city =
        address.city ||
        address.town ||
        //address.village ||
        //address.state || // bazen sadece state döner
        "";
      const town =
        address.county || address.suburb || address.neighbourhood || "";

      return { city, town };
    } catch (error) {
      console.error("Reverse geocoding hatası:", error);
      return { city: "", town: "" };
    }
  };

  const MapClickHandler = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPosition([lat, lng]);

        const { city, town } = await reverseGeocode(lat, lng);
        onLocationChange({ lat, lng, city, town });
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[39.9208, 32.8541]}
      zoom={6}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <MapClickHandler />
      {markerPosition && <Marker position={markerPosition} />}
    </MapContainer>
  );
};

export default LocationPicker;




