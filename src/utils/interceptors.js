export function setupInterceptors(service) {
  service.interceptors.request.use(
    config => {
      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );


  service.interceptors.response.use(
    response => {
      if (response.status === 200) {
        return response.data;
      }
      return Promise.reject(response.data);
    },
    error => {
      return errorHandler(error);
    }
  );
}


function errorHandler(error) {
  let errorMessage = '';

  if (!error.response) {
    errorMessage = 'Network Error: Please check your internet connection.';
  } else {
    switch (error.response.status) {
      case 401:
        errorMessage = 'Unauthorized: Access is denied due to invalid credentials.';
        break;
      case 403:
        errorMessage = 'Forbidden: You do not have the necessary permissions.';
        break;
      case 404:
        errorMessage = 'Not Found: The requested resource could not be found.';
        break;
      case 500:
        errorMessage = 'Internal Server Error: Please try again later.';
        break;
      default:
        errorMessage = `HTTP status code: ${error.response.status}`;
        break;
    }
  }

  return Promise.reject(new Error(errorMessage));
}