const API_BASE_URL = 'http://localhost:5000/api';

function getAuthHeaders() {
  const token = localStorage.getItem('sahayata_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = { ...getAuthHeaders(), ...(options.headers || {}) };

  const response = await fetch(url, { ...options, headers });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed. Please check if the server is running.');
  }

  return data;
}

export const api = {
  // Services
  getServices: () => apiRequest('/services'),
  getServiceById: (id) => apiRequest(`/services/${id}`),

  // Helpers
  getHelpers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return apiRequest(`/helpers${query ? `?${query}` : ''}`);
  },
  getHelperById: (id) => apiRequest(`/helpers/${id}`),
  setHelperAvailability: (available) =>
    apiRequest('/helpers/me/availability', {
      method: 'PATCH',
      body: JSON.stringify({ available })
    }),

  // Auth
  register: (payload) =>
    apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  login: (payload) =>
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  getMe: () => apiRequest('/auth/me'),
  updateProfile: (payload) =>
    apiRequest('/auth/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }),

  // Bookings
  getBookings: () => apiRequest('/bookings'),
  createBooking: (payload) =>
    apiRequest('/bookings', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  smartMatch: (payload) =>
    apiRequest('/bookings/smart-match', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  urgentBooking: (payload) =>
    apiRequest('/bookings/urgent', {
      method: 'POST',
      body: JSON.stringify(payload)
    }),
  replaceHelper: (bookingId, reason = '') =>
    apiRequest(`/bookings/${bookingId}/replace`, {
      method: 'POST',
      body: JSON.stringify({ reason })
    }),
  recordAttendance: (bookingId, action) =>
    apiRequest(`/bookings/${bookingId}/attendance`, {
      method: 'PATCH',
      body: JSON.stringify({ action })
    }),
  updateBooking: (bookingId, payload) =>
    apiRequest(`/bookings/${bookingId}`, {
      method: 'PATCH',
      body: JSON.stringify(payload)
    }),
  submitReview: (bookingId, payload) =>
    apiRequest(`/bookings/${bookingId}/review`, {
      method: 'POST',
      body: JSON.stringify(payload)
    }),

  // Admin
  getAdminSummary: () => apiRequest('/admin/summary'),
  getAdminUsers: () => apiRequest('/admin/users'),
  verifyHelper: (helperId, verified) =>
    apiRequest(`/admin/helpers/${helperId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ verified })
    })
};
