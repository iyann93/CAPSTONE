import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Untuk mengirim cookies (JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor untuk menyematkan token dan header cache ke setiap request
api.interceptors.request.use(
  (config) => {
    // Force bypass browser cache for all requests (SSOT enforcement)
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
      config.headers['Pragma'] = 'no-cache';
      config.headers['Expires'] = '0';
    }

    const user = JSON.parse(localStorage.getItem('siakad_user') || 'null');
    if (user?.accessToken) {
      config.headers['Authorization'] = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor untuk menangani expired token atau error auth global
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    // Jika Unauthorized dan bukan request ke /auth/login atau /auth/refresh, dan belum pernah di-retry
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Tandai agar tidak infinite loop

      try {
        // Coba refresh token
        const refreshResponse = await axios.post(
          '/api/v1/auth/refresh',
          {},
          { withCredentials: true }
        );
        
        const newAccessToken = refreshResponse.data?.data?.accessToken;
        
        // Simpan token baru ke localStorage
        const user = JSON.parse(localStorage.getItem('siakad_user') || '{}');

        // Mencegah tab-tab yang berbeda menimpa session satu sama lain
        if (newAccessToken && user.accessToken) {
          try {
            const oldPayload = JSON.parse(atob(user.accessToken.split('.')[1]));
            const newPayload = JSON.parse(atob(newAccessToken.split('.')[1]));
            if (oldPayload.userId !== newPayload.userId) {
              console.warn("Token refresh dibatalkan karena User ID berubah (kemungkinan login di tab lain).");
              localStorage.removeItem('siakad_user');
              window.location.href = '/login';
              return Promise.reject(new Error("Sesi tertimpa oleh tab lain"));
            }
          } catch (e) {
            console.error("Gagal memverifikasi payload token", e);
          }
        }

        user.accessToken = newAccessToken;
        localStorage.setItem('siakad_user', JSON.stringify(user));

        // Update header request asli dengan token baru
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        
        // Retry request asli
        return api(originalRequest);
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
