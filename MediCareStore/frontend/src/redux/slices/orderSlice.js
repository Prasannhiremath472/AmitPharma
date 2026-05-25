import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios';

export const fetchMyOrders = createAsyncThunk('orders/fetchMine', async (params = {}, { rejectWithValue }) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await api.get(`/orders/my-orders?${queryString}`);
    return response.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to fetch orders');
  }
});

export const fetchOrder = createAsyncThunk('orders/fetchOne', async (orderId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Order not found');
  }
});

export const cancelOrder = createAsyncThunk('orders/cancel', async ({ orderId, reason }, { rejectWithValue }) => {
  try {
    await api.put(`/orders/${orderId}/cancel`, { reason });
    return orderId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.message || 'Failed to cancel order');
  }
});

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    current: null,
    pagination: { page: 1, limit: 10, total: 0, totalPages: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrent: (state) => { state.current = null; },
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data || [];
        state.pagination = action.payload.pagination || state.pagination;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrder.pending, (state) => { state.loading = true; })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        const item = state.items.find(o => o.order_id === action.payload);
        if (item) item.status = 'cancelled';
        if (state.current?.order_id === action.payload) state.current.status = 'cancelled';
      });
  },
});

export const { clearCurrent, clearError } = orderSlice.actions;
export default orderSlice.reducer;
