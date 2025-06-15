import axios from 'axios'

const API_BASE_URL = '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/college/login'
    }
    return Promise.reject(error)
  }
)

// API functions
export const collegeAPI = {
  getAll: () => api.get('/colleges'),
  getById: (id) => api.get(`/colleges/${id}`),
  create: (data) => api.post('/colleges', data),
  login: (credentials) => api.post('/college/login', credentials),
}

export const eventAPI = {
  getAll: () => api.get('/events'),
  getById: (id) => api.get(`/events/${id}`),
  create: (data) => api.post('/events', data),
  update: (id, data) => api.put(`/events/${id}`, data),
  delete: (id) => api.delete(`/events/${id}`),
  getRegistrations: (id) => api.get(`/events/${id}/registrations`),
}

export const registrationAPI = {
  create: (data) => api.post('/registrations', data),
}

export const feedAPI = {
  getAll: () => api.get('/feed'),
  create: (data) => api.post('/feed', data),
}

export const adminAPI = {
  login: (credentials) => api.post('/admin/login', credentials),
  getAllEvents: () => api.get('/admin/events'),
  getAllFeed: () => api.get('/admin/feed'),
  getUsers: () => api.get('/users'),
}

export default api