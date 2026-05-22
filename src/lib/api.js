/**
 * API Utility for authenticated requests
 */
const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend-support-hub.onrender.com';

export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const url = endpoint.startsWith('http') ? endpoint : `${BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // window.location.href = '/login';
    return;
  }

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const api = {
  getTickets: () => fetchApi('/api/tickets'),
  getTicket: (id) => fetchApi(`/api/tickets/${id}`),
  createTicket: (data) => fetchApi('/api/tickets', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTicket: (id, data) => fetchApi(`/api/tickets/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  }),
  deleteTicket: (id) => fetchApi(`/api/tickets/${id}`, {
    method: 'DELETE',
  }),
  addReply: (id, data) => fetchApi(`/api/tickets/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  rateTicket: (id, data) => fetchApi(`/api/tickets/${id}/rate`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  getPublicTicket: (id) => fetchApi(`/api/tickets/public/${id}`),
  addPublicReply: (id, data) => fetchApi(`/api/tickets/public/${id}/messages`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  ratePublicTicket: (id, data) => fetchApi(`/api/tickets/public/${id}/rate`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
};
