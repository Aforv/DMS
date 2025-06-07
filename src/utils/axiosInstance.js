// // src/utils/axiosInstance.js
// import axios from 'axios';

// const axiosInstance = axios.create({
//   baseURL: 'http://localhost:4000',
// });

// axiosInstance.interceptors.request.use((config) => {
//   const token = localStorage.getItem('token');
//   //const { token } = useAuth()
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       localStorage.removeItem('token');
//       window.location.href = '/login'; // redirect to login
//     }
//     return Promise.reject(error);
//   }
// );

// // const token = localStorage.getItem('token');
// // const axiosInstance = axios.create({
// //   baseURL: 'http://localhost:4000',
// //   headers: {
// //     // Authorization: token,
// //     "Content-Type": "application/json",
// //     timeout : 1000,
// //   }
// // });

// export default axiosInstance;
