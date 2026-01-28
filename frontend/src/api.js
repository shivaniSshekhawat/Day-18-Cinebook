import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://day-18-cinebook-t28g.vercel.app"
});

let activeRequests = 0;
let _showLoader = () => {};
let _hideLoader = () => {};
let _isManualLoading = () => false;

export const setupInterceptors = (showLoader, hideLoader, isManualLoading) => {
  _showLoader = showLoader;
  _hideLoader = hideLoader;
  _isManualLoading = isManualLoading;
};

api.interceptors.request.use((config) => {
  activeRequests++;
  if (!_isManualLoading()) {
    _showLoader("Processing...");
  }
  return config;
}, (error) => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    _hideLoader();
  }
  return Promise.reject(error);
});

api.interceptors.response.use((response) => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    _hideLoader();
  }
  return response;
}, (error) => {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    _hideLoader();
  }
  return Promise.reject(error);
});

export const getShows = () => api.get("/shows");
export const getShowSeats = (id) => api.get(`/shows/${id}/seats`);
export const lockSeats = (payload) => api.post("/bookings/book-seats", payload);
export const checkout = (payload) => api.post("/bookings/checkout", payload);

export default api;