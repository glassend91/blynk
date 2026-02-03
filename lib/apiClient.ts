import axios from "axios";

export const apiClient = axios.create({
    baseURL: "https://blynk-backend-x8pk.onrender.com/api",
    // baseURL: "http://localhost:5000/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
    // Using localStorage for auth; no cookies required
    withCredentials: false,
    timeout: 150000,
});

// Attach auth token from cookie for browser requests
apiClient.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        const token = localStorage.getItem("auth_token");
        if (token) {
            config.headers = { ...(config.headers as any), Authorization: `Bearer ${token}` } as any;
        }
    }
    return config;
});

// Response interceptor for consistent error surfaces
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // For validation errors, preserve the original error structure
        if (error?.response?.data?.success === false && error?.response?.data?.errors) {
            return Promise.reject(error);
        }

        const message =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Request failed";
        return Promise.reject(new Error(message));
    }
);

export default apiClient;


