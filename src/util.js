import axios from "axios";
import { getToken } from "./Stores/service/getToken";

const apiurl = axios.create({
  baseURL: import.meta.env.VITE_APP_DEV_BASE_URL,
  // You can add other default configurations here if needed
});

apiurl.interceptors.request.use(
  (config) => {
    const tokenId = getToken(); // Fetch token inside the interceptor
    // console.log(tokenId);
    if (tokenId) {
      config.headers.Authorization = `Bearer ${tokenId}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiurl;

export function capitalizeWord(input) {
  if (!input || typeof input !== "string") {
    return "";
  }
  return input
    .split(" ")
    .filter(word => word.toLowerCase() !== "undefined")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()) 
    .join(" ");
} 
