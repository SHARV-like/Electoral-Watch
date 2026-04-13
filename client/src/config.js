// Centralized API Configuration
// Vite automatically injects 'production' into import.meta.env.MODE when you run `npm run build` for Render deployment.

export const API_BASE_URL = import.meta.env.MODE === 'production' 
  ? 'https://electoral-watch-api.onrender.com' // Production Backend string (Make sure to replace with your exact Render Web Service URL later)
  : 'http://localhost:5000';                   // Local Backend string

export default API_BASE_URL;
