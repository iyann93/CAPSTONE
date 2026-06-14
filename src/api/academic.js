import api from './axios';

export const getSiswa = (params = {}) => 
  api.get('/siswa', { params }).then((r) => r.data.data);
