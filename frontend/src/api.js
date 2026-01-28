import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL || "https://day-18-cinebook-t28g.vercel.app",
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

api.interceptors.request.use(
  (config) => {
    activeRequests++;

    const isShowsRequest = config.url === "/shows";
    const defaultMessage = isShowsRequest
      ? "Fetching latest movies..."
      : "Processing...";

    if (!_isManualLoading()) {
      _showLoader(defaultMessage);
    }

    // Handle Cold Starts (Free Tiers)
    config.timeoutId = setTimeout(() => {
      if (activeRequests > 0 && !_isManualLoading()) {
        _showLoader("Server is waking up... This may take a few seconds 🎬");
      }
    }, 3500);

    return config;
  },
  (error) => {
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      _hideLoader();
    }
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response) => {
    if (response.config.timeoutId) clearTimeout(response.config.timeoutId);
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      _hideLoader();
    }
    return response;
  },
  (error) => {
    if (error.config?.timeoutId) clearTimeout(error.config.timeoutId);
    activeRequests--;
    if (activeRequests <= 0) {
      activeRequests = 0;
      _hideLoader();
    }

    // Log helpful info for developers
    if (error.code === "ERR_NETWORK") {
      console.warn(
        "Network Error: Is the backend URL correct? Current baseURL:",
        api.defaults.baseURL,
      );
    }

    return Promise.reject(error);
  },
);

// Retry logic with exponential backoff
export const retryRequest = async (
  requestFn,
  maxRetries = 3,
  initialDelay = 1000,
) => {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await requestFn();
    } catch (error) {
      lastError = error;

      // Don't retry on 401/403 or other client errors
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status < 500
      ) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        console.log(
          `Retry attempt ${attempt + 1}/${maxRetries} after ${delay}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

export const getShows = () => retryRequest(() => api.get("/shows"), 3, 1000);
export const getShowSeats = (id) => api.get(`/shows/${id}/seats`);
export const lockSeats = (payload) => api.post("/bookings/book-seats", payload);
export const checkout = (payload) => api.post("/bookings/checkout", payload);

export default api;
