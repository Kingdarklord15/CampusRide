"use client";

import { useEffect, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet marker icon asset mapping issue
const setupLeafletMarkers = () => {
  if (typeof window === "undefined") return;
  delete (L.Icon.Default.prototype as any)._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });
};

interface MapProps {
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  driverLat?: number;
  driverLng?: number;
}

export default function MapComponent({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng,
  driverLat,
  driverLng,
}: MapProps) {
  const [map, setMap] = useState<L.Map | null>(null);
  const [pickupMarker, setPickupMarker] = useState<L.Marker | null>(null);
  const [dropoffMarker, setDropoffMarker] = useState<L.Marker | null>(null);
  const [driverMarker, setDriverMarker] = useState<L.Marker | null>(null);
  const [routeLine, setRouteLine] = useState<L.Polyline | null>(null);

  // Initialize Leaflet markers setup
  useEffect(() => {
    setupLeafletMarkers();
  }, []);

  // Map Initialization
  useEffect(() => {
    const mapContainer = document.getElementById("campus-ride-map");

    if (!mapContainer) return;

    const initialMap = L.map(mapContainer).setView(
      [28.545, 77.192],
      15
    );

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        attribution:
          "&copy; OpenStreetMap contributors",
      }
    ).addTo(initialMap);

    setMap(initialMap);

    return () => {
      initialMap.remove();
    };
  }, []);

  // Update Pickup Marker
  useEffect(() => {
    if (!map) return;

    if (pickupLat && pickupLng) {
      if (pickupMarker) {
        pickupMarker.setLatLng([pickupLat, pickupLng]);
      } else {
        const customIcon = L.divIcon({
          className: "bg-white w-6 h-6 rounded-full border border-black flex items-center justify-center text-black text-xs font-bold shadow-md",
          html: "P",
          iconSize: [24, 24],
        });
        const marker = L.marker([pickupLat, pickupLng], { icon: customIcon }).addTo(map);
        marker.bindPopup("Pickup Location");
        setPickupMarker(marker);
      }
      map.panTo([pickupLat, pickupLng]);
    } else if (pickupMarker) {
      pickupMarker.remove();
      setPickupMarker(null);
    }
  }, [map, pickupLat, pickupLng]);

  // Update Dropoff Marker
  useEffect(() => {
    if (!map) return;

    if (dropoffLat && dropoffLng) {
      if (dropoffMarker) {
        dropoffMarker.setLatLng([dropoffLat, dropoffLng]);
      } else {
        const customIcon = L.divIcon({
          className: "bg-zinc-850 w-6 h-6 rounded-full border border-white/20 flex items-center justify-center text-white text-xs font-bold shadow-md",
          html: "D",
          iconSize: [24, 24],
        });
        const marker = L.marker([dropoffLat, dropoffLng], { icon: customIcon }).addTo(map);
        marker.bindPopup("Dropoff Location");
        setDropoffMarker(marker);
      }
    } else if (dropoffMarker) {
      dropoffMarker.remove();
      setDropoffMarker(null);
    }
  }, [map, dropoffLat, dropoffLng]);

  // Update Driver Marker
  useEffect(() => {
    if (!map) return;

    if (driverLat && driverLng) {
      if (driverMarker) {
        driverMarker.setLatLng([driverLat, driverLng]);
      } else {
        const customIcon = L.divIcon({
          className: "bg-white w-6 h-6 rounded-full border border-black flex items-center justify-center text-xs font-bold shadow-md animate-bounce",
          html: "🚗",
          iconSize: [24, 24],
        });
        const marker = L.marker([driverLat, driverLng], { icon: customIcon }).addTo(map);
        marker.bindPopup("Driver Current Location");
        setDriverMarker(marker);
      }
    } else if (driverMarker) {
      driverMarker.remove();
      setDriverMarker(null);
    }
  }, [map, driverLat, driverLng]);

  // Draw routing line between Pickup and Dropoff
  useEffect(() => {
    if (!map) return;

    if (pickupLat && pickupLng && dropoffLat && dropoffLng) {
      const latlngs = [
        [pickupLat, pickupLng] as [number, number],
        [dropoffLat, dropoffLng] as [number, number],
      ];

      if (routeLine) {
        routeLine.setLatLngs(latlngs);
      } else {
        const line = L.polyline(latlngs, { color: "#ffffff", weight: 3, opacity: 0.9 }).addTo(map);
        setRouteLine(line);
      }

      // Zoom to fit both points
      const bounds = L.latLngBounds(latlngs);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else if (routeLine) {
      routeLine.remove();
      setRouteLine(null);
    }
  }, [map, pickupLat, pickupLng, dropoffLat, dropoffLng]);

  return <div id="campus-ride-map" className="w-full h-full rounded-xl overflow-hidden border border-white/8 shadow-glass min-h-[350px] bg-white/[0.02] backdrop-blur-md" />;
}
