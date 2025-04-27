import { getToken } from "./Stores/service/getToken";
import apiurl from "./util";
const tokenId =   getToken()

const setupInterceptors = () => {
  apiurl.interceptors.request.use(
    (config) => {
      // Add the tokenId to the request header
      if (tokenId) {
        config.headers.Authorization = `Bearer ${tokenId}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;