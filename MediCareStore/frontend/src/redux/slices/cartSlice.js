import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/cart');
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart');
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
  try {
    const response = await api.post('/cart/add', { product_id, quantity });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to add to cart');
  }
});

export const updateCartItem = createAsyncThunk('cart/updateItem', async ({ productId, quantity }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/cart/update/${productId}`, { quantity });
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to update cart');
  }
});

export const removeFromCart = createAsyncThunk('cart/removeItem', async (productId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/cart/remove/${productId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to remove from cart');
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await api.delete('/cart/clear');
    return { items: [], totals: { subtotal: 0, total: 0, shipping: 0 }, itemCount: 0 };
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to clear cart');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totals: { subtotal: 0, savings: 0, shipping: 0, tax: 0, total: 0 },
    itemCount: 0,
    isOpen: false,
    loading: false,
    error: null,
  },
  reducers: {
    toggleCartSidebar: (state) => { state.isOpen = !state.isOpen; },
    openCartSidebar: (state) => { state.isOpen = true; },
    closeCartSidebar: (state) => { state.isOpen = false; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    const handlePending = (state) => { state.loading = true; state.error = null; };
    const handleFulfilled = (state, action) => {
      state.loading = false;
      state.items = action.payload.items || [];
      state.totals = action.payload.totals || {};
      state.itemCount = action.payload.itemCount || 0;
    };
    const handleRejected = (state, action) => {
      state.loading = false;
      state.error = action.payload;
    };

    builder
      .addCase(fetchCart.pending, handlePending)
      .addCase(fetchCart.fulfilled, handleFulfilled)
      .addCase(fetchCart.rejected, handleRejected)
      .addCase(addToCart.pending, handlePending)
      .addCase(addToCart.fulfilled, handleFulfilled)
      .addCase(addToCart.rejected, handleRejected)
      .addCase(updateCartItem.pending, handlePending)
      .addCase(updateCartItem.fulfilled, handleFulfilled)
      .addCase(updateCartItem.rejected, handleRejected)
      .addCase(removeFromCart.pending, handlePending)
      .addCase(removeFromCart.fulfilled, handleFulfilled)
      .addCase(removeFromCart.rejected, handleRejected)
      .addCase(clearCart.fulfilled, (state) => {
        state.items = [];
        state.totals = { subtotal: 0, savings: 0, shipping: 0, tax: 0, total: 0 };
        state.itemCount = 0;
        state.loading = false;
      });
  },
});

export const { toggleCartSidebar, openCartSidebar, closeCartSidebar, clearError } = cartSlice.actions;
export default cartSlice.reducer;
