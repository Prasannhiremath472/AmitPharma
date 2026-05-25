import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  closeLocator,
  selectStore,
  setUserLocation,
  setLocationLoading,
  setLocationError,
} from '../../redux/slices/storeSlice';
import { getStoresSortedByDistance } from '../../data/stores';
import STORES from '../../data/stores';

// Fix Leaflet default icon broken in Vite/webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom green marker for selected store
const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// User location marker (blue)
const userIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Helper: pan map to a position
function MapPanner({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, 14, { duration: 1 });
  }, [center, map]);
  return null;
}

const StoreLocatorModal = () => {
  const dispatch = useDispatch();
  const { isLocatorOpen, selectedStore, userLocation } = useSelector((s) => s.store);

  const [sortedStores, setSortedStores] = useState(STORES);
  const [hoveredId, setHoveredId] = useState(null);
  const [mapCenter, setMapCenter] = useState([18.5204, 73.8567]); // default: Pune
  const [searchQuery, setSearchQuery] = useState('');

  // Detect GPS on open
  const detectLocation = useCallback(() => {
    if (!navigator.geolocation) {
      dispatch(setLocationError('Geolocation not supported by your browser'));
      return;
    }
    dispatch(setLocationLoading());
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        dispatch(setUserLocation({ lat, lng }));
        const sorted = getStoresSortedByDistance(lat, lng);
        setSortedStores(sorted);
        setMapCenter([lat, lng]);
      },
      (err) => {
        dispatch(setLocationError(err.message || 'Location access denied'));
        setSortedStores(STORES);
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, [dispatch]);

  useEffect(() => {
    if (isLocatorOpen) {
      detectLocation();
      setSearchQuery('');
    }
  }, [isLocatorOpen, detectLocation]);

  const filtered = sortedStores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.pincode.includes(searchQuery)
  );

  const handleSelect = (store) => {
    dispatch(selectStore(store));
  };

  const handleFocusOnMap = (store) => {
    setMapCenter([store.lat, store.lng]);
    setHoveredId(store.id);
  };

  if (!isLocatorOpen) return null;

  return (
    <AnimatePresence>
      {isLocatorOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeLocator())}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[1000]"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-4 sm:inset-8 lg:inset-12 z-[1001] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white flex-shrink-0">
              <div>
                <h2 className="text-xl font-black text-gray-900 flex items-center gap-2">
                  <span className="text-primary-500">📍</span> Find Your Nearest Store
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">Select a store to shop from &mdash; orders will be routed to it</p>
              </div>
              <button
                onClick={() => dispatch(closeLocator())}
                className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-800 transition-colors text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Body: list + map side by side */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row min-h-0">

              {/* Left: Store List */}
              <div className="lg:w-[420px] flex-shrink-0 flex flex-col border-r border-gray-100">
                {/* Search */}
                <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
                    <input
                      type="text"
                      placeholder="Search by store name, city or pincode…"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-transparent"
                    />
                  </div>
                  <button
                    onClick={detectLocation}
                    className="mt-2 w-full flex items-center justify-center gap-2 text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 py-2 rounded-xl border border-primary-100 transition-colors"
                  >
                    🎯 Use My Current Location
                  </button>
                </div>

                {/* Store cards */}
                <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
                  {filtered.length === 0 && (
                    <p className="text-center text-sm text-gray-400 py-10">No stores found</p>
                  )}
                  {filtered.map((store) => {
                    const isSelected = selectedStore?.id === store.id;
                    const isHovered = hoveredId === store.id;
                    return (
                      <div
                        key={store.id}
                        onMouseEnter={() => setHoveredId(store.id)}
                        onMouseLeave={() => setHoveredId(null)}
                        onClick={() => handleFocusOnMap(store)}
                        className={`px-4 py-4 cursor-pointer transition-all duration-150 ${
                          isSelected
                            ? 'bg-primary-50 border-l-4 border-primary-500'
                            : isHovered
                            ? 'bg-gray-50 border-l-4 border-gray-200'
                            : 'border-l-4 border-transparent'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className="font-bold text-sm text-gray-900 truncate">{store.name}</p>
                              {!store.isOpen && (
                                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  Temporarily Closed
                                </span>
                              )}
                              {store.isOpen && store.distance !== undefined && store.distance < 3 && (
                                <span className="text-[10px] font-bold bg-primary-100 text-primary-700 px-1.5 py-0.5 rounded-full flex-shrink-0">
                                  Nearest
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{store.address}, {store.city} &mdash; {store.pincode}</p>
                            <p className="text-xs text-gray-400 mt-1">📞 {store.phone}</p>
                            <p className="text-xs text-gray-400 mt-0.5">🕐 {store.hours}</p>
                            {store.distance !== undefined && (
                              <p className="text-xs text-primary-600 font-semibold mt-1">
                                📍 {store.distance < 1
                                  ? `${Math.round(store.distance * 1000)} m away`
                                  : `${store.distance.toFixed(1)} km away`}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleSelect(store); }}
                            className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-xl transition-all duration-150 ${
                              isSelected
                                ? 'bg-primary-500 text-white shadow-sm'
                                : 'bg-gray-100 text-gray-700 hover:bg-primary-500 hover:text-white'
                            }`}
                          >
                            {isSelected ? '✓ Selected' : 'Select'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Map */}
              <div className="flex-1 min-h-[300px] lg:min-h-0 relative">
                <MapContainer
                  center={mapCenter}
                  zoom={12}
                  style={{ height: '100%', width: '100%' }}
                  className="z-0"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <MapPanner center={mapCenter} />

                  {/* User location marker */}
                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
                      <Popup>📍 Your Location</Popup>
                    </Marker>
                  )}

                  {/* Store markers */}
                  {STORES.map((store) => (
                    <Marker
                      key={store.id}
                      position={[store.lat, store.lng]}
                      icon={selectedStore?.id === store.id ? selectedIcon : new L.Icon.Default()}
                    >
                      <Popup>
                        <div className="text-sm">
                          <strong>{store.name}</strong><br />
                          {store.address}<br />
                          {store.city}, {store.pincode}<br />
                          📞 {store.phone}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>

                {/* Map legend */}
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl px-3 py-2 shadow text-xs text-gray-600 space-y-1 z-10">
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" /> Your Location</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-500 inline-block" /> Selected Store</div>
                  <div className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-gray-400 inline-block" /> Other Stores</div>
                </div>
              </div>
            </div>

            {/* Footer */}
            {selectedStore && (
              <div className="border-t border-gray-100 px-6 py-3 bg-primary-50 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-primary-500 text-lg">✓</span>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{selectedStore.name}</p>
                    <p className="text-xs text-gray-500">{selectedStore.city} &mdash; Online orders will be fulfilled from this store</p>
                  </div>
                </div>
                <button
                  onClick={() => dispatch(closeLocator())}
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold text-sm px-5 py-2 rounded-xl transition-colors"
                >
                  Continue Shopping →
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default StoreLocatorModal;
