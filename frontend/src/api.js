import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://day-18-cinebook-t28g.vercel.app"
});

export const getShows = () => api.get("/shows");
export const getShowSeats = (id) => api.get(`/shows/${id}/seats`);
export const lockSeats = (payload) => api.post("/bookings/book-seats", payload);
export const checkout = (payload) => api.post("/bookings/checkout", payload);

export default api;