"use client";

import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

// Fix for default marker icons in Leaflet with Next.js
const DefaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

type Location = {
  id: string;
  name: string;
  address: string;
  hours: string;
  phone: string;
  rating: number;
  ratingCount: number;
  lat?: number;
  lng?: number;
  photo: string;
};

type MapProps = {
  locations: Location[];
  focused?: Location | null;
  onMarkerClick?: (loc: Location) => void;
};

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function LeafletMap({ locations, focused, onMarkerClick }: MapProps) {
  const defaultCenter: [number, number] = [-33.8688, 151.2093]; // Sydney
  const center: [number, number] = focused?.lat && focused?.lng 
    ? [focused.lat, focused.lng] 
    : defaultCenter;

  return (
    <MapContainer
      center={center}
      zoom={13}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((loc) => (
        loc.lat && loc.lng && (
          <Marker 
            key={loc.id} 
            position={[loc.lat, loc.lng]}
            eventHandlers={{
              click: () => onMarkerClick?.(loc),
            }}
          >
            <Popup>
              <div className="font-semibold text-[#3F205F]">{loc.name}</div>
              <div className="text-xs text-[#6F6C90]">{loc.address}</div>
            </Popup>
          </Marker>
        )
      ))}
      <ChangeView center={center} zoom={focused ? 15 : 13} />
    </MapContainer>
  );
}
