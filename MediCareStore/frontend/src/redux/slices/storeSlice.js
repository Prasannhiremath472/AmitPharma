import { createSlice } from '@reduxjs/toolkit';
import STORES from '../../data/stores';

// Load persisted selected store from localStorage
const loadPersistedStore = () => {
  try {
    const saved = localStorage.getItem('selectedStore');
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validate it still exists in the stores list
      if (STORES.find((s) => s.id === parsed.id)) return parsed;
    }
  } catch (_) {}
  return null;
};

const storeSlice = createSlice({
  name: 'store',
  initialState: {
    selectedStore: loadPersistedStore(), // null = not yet selected
    isLocatorOpen: false,
    userLocation: null, // { lat, lng }
    locationLoading: false,
    locationError: null,
  },
  reducers: {
    selectStore(state, action) {
      state.selectedStore = action.payload;
      state.isLocatorOpen = false;
      try {
        localStorage.setItem('selectedStore', JSON.stringify(action.payload));
      } catch (_) {}
    },
    clearStore(state) {
      state.selectedStore = null;
      localStorage.removeItem('selectedStore');
    },
    openLocator(state) {
      state.isLocatorOpen = true;
    },
    closeLocator(state) {
      state.isLocatorOpen = false;
    },
    setUserLocation(state, action) {
      state.userLocation = action.payload;
      state.locationLoading = false;
      state.locationError = null;
    },
    setLocationLoading(state) {
      state.locationLoading = true;
      state.locationError = null;
    },
    setLocationError(state, action) {
      state.locationLoading = false;
      state.locationError = action.payload;
    },
  },
});

export const {
  selectStore,
  clearStore,
  openLocator,
  closeLocator,
  setUserLocation,
  setLocationLoading,
  setLocationError,
} = storeSlice.actions;

export default storeSlice.reducer;
