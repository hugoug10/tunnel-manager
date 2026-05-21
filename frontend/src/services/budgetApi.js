import axios from 'axios';
const api = axios.create({ baseURL: '/api/budget' });

export const budgetApi = {
  getCatalog:       ()       => api.get('/catalog').then(r => r.data),
  createCatalog:    (data)   => api.post('/catalog', data).then(r => r.data),
  updateCatalog:    (id, d)  => api.put(`/catalog/${id}`, d).then(r => r.data),
  deleteCatalog:    (id)     => api.delete(`/catalog/${id}`).then(r => r.data),
  getSuppliers:     ()       => api.get('/suppliers').then(r => r.data),
  getItems:         ()       => api.get('/items').then(r => r.data),
  createItem:       (data)   => api.post('/items', data).then(r => r.data),
  updateItem:       (id, d)  => api.put(`/items/${id}`, d).then(r => r.data),
  deleteItem:       (id)     => api.delete(`/items/${id}`).then(r => r.data),
  getSummary:       ()       => api.get('/summary').then(r => r.data),
  getPriceHistory:  (mid)    => api.get(`/price-history/${mid}`).then(r => r.data),
  getAiAnalysis:    ()       => api.get('/ai-analysis').then(r => r.data),
};
