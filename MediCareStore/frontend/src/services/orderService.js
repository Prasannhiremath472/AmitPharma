import api from '../api/axios';

const orderService = {
  create: (data) => api.post('/orders', data),
  verifyPayment: (data) => api.post('/orders/verify-payment', data),
  getMyOrders: (params) => api.get('/orders/my-orders', { params }),
  getById: (orderId) => api.get(`/orders/${orderId}`),
  cancel: (orderId, reason) => api.put(`/orders/${orderId}/cancel`, { reason }),
  getAll: (params) => api.get('/orders', { params }),
  updateStatus: (orderId, status, note) => api.put(`/orders/${orderId}/status`, { status, note }),
};

export default orderService;
