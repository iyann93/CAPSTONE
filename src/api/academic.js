import api from './axios';

export const getSiswa = (params = {}) =>
  api.get('/siswa', { params }).then((r) => {
    const payload = r.data.data;
    if (Array.isArray(payload)) return payload;
    if (payload && Array.isArray(payload.data)) return payload.data;
    return [];
  });

export const getSemesters = () =>
  api.get('/semester').then(r => r.data.data || []);
