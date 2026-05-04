import axios from 'axios';

axios.interceptors.request.use((request) => {
  const adminInfo = localStorage.getItem('adminInfo');

  if (adminInfo) {
    try {
      const parsed = JSON.parse(adminInfo);
      if (parsed?.token) {
        request.headers.Authorization = `Bearer ${parsed.token}`;
      }
    } catch (error) {
      localStorage.removeItem('adminInfo');
    }
  }

  return request;
});

axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401 && window.location.pathname !== '/login') {
      localStorage.removeItem('adminInfo');
      window.location.assign('/login');
    }

    return Promise.reject(error);
  }
);
