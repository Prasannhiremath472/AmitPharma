import api from '../api/axios';

const cartService = {
  get: () => api.get('/cart'),
  add: (product_id, quantity) => api.post('/cart/add', { product_id, quantity }),
  update: (productId, quantity) => api.put(`/cart/update/${productId}`, { quantity }),
  remove: (productId) => api.delete(`/cart/remove/${productId}`),
  clear: () => api.delete('/cart/clear'),
  count: () => api.get('/cart/count'),
};

export default cartService;
