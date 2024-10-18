import { Alert } from "react-native";

export const handleServiceError = (error: any, customErrorMessages?: Record<string, string>) => {
  console.error('Service Error:', error);

  let errorMessage: string;
  switch (true) {
    case error instanceof TypeError:
      errorMessage = "Network Error. Please check your internet connection and try again.";
      break;
    case error.message.includes('No session ID found'):
      errorMessage = "Authentication Error. Please log in again.";
      break;
    case error.message.includes("don't have permission"):
      errorMessage = error.message;
      break;
    case error instanceof Response:
      errorMessage = handleResponseError(error);
      break;
    default:
      errorMessage = customErrorMessages?.[error.message] || error.message || "An unexpected error occurred. Please try again.";
  }

  Alert.alert("Error", errorMessage);
  throw error;
};

const handleResponseError = (response: Response): string => {
  switch (response.status) {
    case 400:
      return "Bad request. Please check your input and try again.";
    case 401:
      return "Unauthorized. Please log in again.";
    case 403:
      return "Forbidden. You don't have permission to access this resource.";
    case 404:
      return "Resource not found. Please check the URL and try again.";
    case 500:
      return "Internal server error. Please try again later.";
    default:
      return `Request failed with status ${response.status}. Please try again.`;
  }
};
