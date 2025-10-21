// API configuration
export const API_CONFIG = {
  // Use localhost in development, production URL in production
  get BASE_URL() {
    return process.env.NODE_ENV === 'production' 
      ? 'https://mahakama-api-production.up.railway.app/api'
      : 'http://localhost:3000/api';
  }
};
