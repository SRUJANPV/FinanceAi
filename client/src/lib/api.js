import axios from 'axios';
export const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1', withCredentials: true });
api.interceptors.request.use((config) => { const token = localStorage.getItem('accessToken'); if (token) config.headers.Authorization = `Bearer ${token}`; return config; });
let refreshing;
api.interceptors.response.use((response) => response, async (error) => { const request = error.config; if (error.response?.status !== 401 || request?._retry || request?.url === '/auth/refresh') return Promise.reject(error); request._retry = true; try { refreshing ??= api.post('/auth/refresh').then((r) => r.data.data.accessToken).finally(() => { refreshing = null; }); const token = await refreshing; localStorage.setItem('accessToken', token); request.headers.Authorization = `Bearer ${token}`; return api(request); } catch (refreshError) { localStorage.removeItem('accessToken'); return Promise.reject(refreshError); } });
