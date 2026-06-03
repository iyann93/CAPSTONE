import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1',
  withCredentials: true, // Untuk mengirim cookies (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menangani expired token atau error auth global
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Jika Unauthorized dan bukan request ke /auth/login
    if (
      error.response &&
      error.response.status === 401 &&
      !error.config.url.includes('/auth/login') &&
      !error.config.url.includes('/auth/refresh')
    ) {
      try {
        // Coba refresh token
        await axios.post(
          'http://localhost:5000/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );
        
        // Retry request asli
        return api.request(error.config);
      } catch (refreshError) {
        // Jika refresh gagal, logout lokal
        localStorage.removeItem('siakad_user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
