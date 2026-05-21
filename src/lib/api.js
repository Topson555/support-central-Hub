/**
 * API Utility for authenticated requests
 */
export const fetchApi = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
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
};
