// 4. LocationPicker bileşeni (ayrı dosyada tanımla):
// LocationPicker.js
import React, { useState } from "react";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

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

export default LocationPicker;
