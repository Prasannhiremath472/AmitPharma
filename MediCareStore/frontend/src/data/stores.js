// Amit R. Medical — Store Locations
// Replace lat/lng and details with your real store data

const STORES = [
  {
    id: 1,
    name: "Amit R. Medical — Main Branch",
    address: "Shop No. 12, Gandhi Chowk, MG Road",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411001",
    phone: "+91 98765 43210",
    email: "pune.main@amitmedical.com",
    hours: "Mon–Sat: 8:00 AM – 10:00 PM | Sun: 9:00 AM – 8:00 PM",
    lat: 18.5204,
    lng: 73.8567,
    isOpen: true,
  },
  {
    id: 2,
    name: "Amit R. Medical — Kothrud",
    address: "Plot 45, Karve Road, Near Kothrud Bus Stand",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411038",
    phone: "+91 98765 43211",
    email: "pune.kothrud@amitmedical.com",
    hours: "Mon–Sat: 8:30 AM – 9:30 PM | Sun: 10:00 AM – 7:00 PM",
    lat: 18.5074,
    lng: 73.8077,
    isOpen: true,
  },
  {
    id: 3,
    name: "Amit R. Medical — Wakad",
    address: "Shop 7, Wakad Main Road, Pimpri-Chinchwad",
    city: "Pimpri-Chinchwad",
    state: "Maharashtra",
    pincode: "411057",
    phone: "+91 98765 43212",
    email: "wakad@amitmedical.com",
    hours: "Mon–Sat: 9:00 AM – 9:00 PM | Sun: 10:00 AM – 6:00 PM",
    lat: 18.5975,
    lng: 73.7608,
    isOpen: true,
  },
  {
    id: 4,
    name: "Amit R. Medical — Hadapsar",
    address: "Magarpatta City Road, Hadapsar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411028",
    phone: "+91 98765 43213",
    email: "hadapsar@amitmedical.com",
    hours: "Mon–Sat: 8:00 AM – 10:00 PM | Sun: 9:00 AM – 8:00 PM",
    lat: 18.5089,
    lng: 73.9260,
    isOpen: false, // Temporarily closed
  },
  {
    id: 5,
    name: "Amit R. Medical — Baner",
    address: "Survey No. 88, Baner Road, Near Balewadi",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411045",
    phone: "+91 98765 43214",
    email: "baner@amitmedical.com",
    hours: "Mon–Sat: 8:00 AM – 9:30 PM | Sun: 9:00 AM – 7:00 PM",
    lat: 18.5590,
    lng: 73.7868,
    isOpen: true,
  },
  {
    id: 6,
    name: "Amit R. Medical — Viman Nagar",
    address: "Phoenix Marketcity, Nagar Road, Viman Nagar",
    city: "Pune",
    state: "Maharashtra",
    pincode: "411014",
    phone: "+91 98765 43215",
    email: "vimannagar@amitmedical.com",
    hours: "Mon–Sun: 10:00 AM – 10:00 PM",
    lat: 18.5679,
    lng: 73.9143,
    isOpen: true,
  },
];

// Calculate distance between two lat/lng points in km (Haversine formula)
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Sort stores by distance from a given lat/lng
export function getStoresSortedByDistance(userLat, userLng) {
  return STORES.map((store) => ({
    ...store,
    distance: getDistanceKm(userLat, userLng, store.lat, store.lng),
  })).sort((a, b) => a.distance - b.distance);
}

export default STORES;
