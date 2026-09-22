const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const API_URL = (configuredApiUrl || "http://localhost:8000").replace(/\/+$/, "");

export default {
    API_URL
};
