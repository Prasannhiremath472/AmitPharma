import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/users/wishlist');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

export const toggleWishlist = createAsyncThunk('wishlist/toggle', async (product_id, { rejectWithValue }) => {
  try {
    const response = await api.post('/users/wishlist', { product_id });
    return { product_id, inWishlist: response.data.data.inWishlist };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message);
  }
});

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearWishlist: (state) => { state.items = []; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => { state.loading = true; })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchWishlist.rejected, (state) => { state.loading = false; })
      .addCase(toggleWishlist.fulfilled, (state, action) => {
        const { product_id, inWishlist } = action.payload;
        if (inWishlist) {
          // Will be re-fetched
        } else {
          state.items = state.items.filter(item => item.product_id !== product_id);
        }
      });
  },
});

export const { clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
