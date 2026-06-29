// API configuration
export const API_CONFIG = {
  // Get base URL from environment variable with fallback to localhost
  get BASE_URL() {
    return (
      import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api"
    ).replace(/\/+$/, ""); // Remove trailing slashes
  },
};
