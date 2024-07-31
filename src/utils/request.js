import axios from 'axios';
import { setupInterceptors } from './interceptors';

const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  timeout: 5000,
});


const request = {
  get(url, data) {
    return service.get(url, { params: data })
      .then(response => response)
      .catch(error => ({ error: error.message }));
  },
  post(url, data) {
    return service.post(url, data)
      .then(response => response)
      .catch(error => ({ error: error.message }));
  },
  put(url, data) {
    return service.put(url, data)
      .then(response => response)
      .catch(error => ({ error: error.message }));
  },
  delete(url, data) {
    return service.delete(url, { params: data })
      .then(response => response)
      .catch(error => ({ error: error.message }));
  },
  request(method, url, data) {
    return service({ method, url, ...data })
      .then(response => response)
      .catch(error => ({ error: error.message }));
  },
};

setupInterceptors(service);


export default request;
