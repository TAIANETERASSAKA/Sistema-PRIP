import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:7070/api/',
  withCredentials: true
});

// Se a sessão expirou no servidor, limpa os dados locais e volta para o login
api.interceptors.response.use(
  response => response,
  error => {
    const ehRotaDeAuth = error.config?.url?.startsWith('/auth');

    if (error.response?.status === 401 && !ehRotaDeAuth) {
      sessionStorage.removeItem('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
