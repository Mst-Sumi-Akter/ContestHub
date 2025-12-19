import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "https://contest-hub-server-gamma-drab.vercel.app";

const useAxios = () => {
    const instance = axios.create({
        baseURL: API_URL,
        withCredentials: true,
    });

    // Add a request interceptor to include the token
    instance.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem("authToken");
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return instance;
};

export default useAxios;
