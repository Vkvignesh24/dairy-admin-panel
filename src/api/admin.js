
import api from './client';

export const AdminAPI = {
  login: (idToken) =>
    api.post('/auth/login', { idToken }).then((r) => r.data),

  me: () =>
    api.get('/auth/me').then((r) => r.data),

  dashboard: () =>
    api.get('/dashboard/summary').then((r) => r.data),

  subscriptions: (params) =>
    api.get('/subscriptions', { params }).then((r) => r.data),

  tomorrow: (params) =>
    api.get('/tomorrow', { params }).then((r) => r.data),

  orders: (params) =>
    api.get('/orders', { params }).then((r) => r.data),

  products: () =>
    api.get('/products').then((r) => r.data),

  updateProduct: (id, body) =>
    api.put(`/products/${id}`, body).then((r) => r.data),

  toggleProduct: (id) =>
    api.patch(`/products/${id}/toggle`).then((r) => r.data),

  customers: (params) =>
    api.get('/customers', { params }).then((r) => r.data),

  customer: (id) =>
    api.get(`/customers/${id}`).then((r) => r.data),

  sendSubscriptionReminder: async () => {

    const res = await api.post(
      '/notifications/subscription-reminder'
    );

    return res.data;
  },
};

// export const AdminAPI = {

//   // existing methods...

//   sendSubscriptionReminder:
//     async () => {

//     const res = await client.post(
//       '/notifications/subscription-reminder'
//     );

//     return res.data;
//   },
// };