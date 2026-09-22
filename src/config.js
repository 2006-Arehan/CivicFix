const configuredApiUrl = import.meta.env.VITE_API_URL?.trim();
const productionApiUrl = "https://civicfix-backend.onrender.com";
const isGitHubPages = typeof window !== "undefined"
    && window.location.hostname.endsWith(".github.io");
const API_URL = (
    configuredApiUrl
    || (isGitHubPages ? productionApiUrl : "http://localhost:8000")
).replace(/\/+$/, "");

export default {
    API_URL
};
