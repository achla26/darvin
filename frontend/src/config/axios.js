import axios from 'axios';

const axiosInstance = axios.create({
    baseURL:import.meta.VITE_API_URL,
});

export default axiosInstance;