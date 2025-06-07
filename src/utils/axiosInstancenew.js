// src/utils/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://43.250.40.133:5005/api/v1',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosInstance.interceptors.response.use(
  res => res,
  // async (error) => {
  //   const originalRequest = error.config;

  //   if (
  //     error.response?.status === 401 &&
  //     !originalRequest._retry &&
  //     localStorage.getItem('refreshToken')
  //   ) {
  //     originalRequest._retry = true;

  //     if (isRefreshing) {
  //       return new Promise((resolve, reject) => {
  //         failedQueue.push({ resolve, reject });
  //       })
  //         .then(token => {
  //           originalRequest.headers.Authorization = 'Bearer ' + token;
  //           return axiosInstance(originalRequest);
  //         })
  //         .catch(Promise.reject);
  //     }

  //     isRefreshing = true;
  //     const refreshToken = localStorage.getItem('refreshToken');

  //     try {
  //       const res = await axios.post('/api/auth/refresh', { refreshToken });
  //       localStorage.setItem('token', res.data.accessToken);
  //       processQueue(null, res.data.accessToken);
  //       originalRequest.headers.Authorization = 'Bearer ' + res.data.accessToken;
  //       return axiosInstance(originalRequest);
  //     } catch (err) {
  //       processQueue(err, null);
  //       localStorage.clear();
  //       window.location.href = '/login';
  //       return Promise.reject(err);
  //     } finally {
  //       isRefreshing = false;
  //     }
  //   }

  //   return Promise.reject(error);
  // }
);

export default axiosInstance;
