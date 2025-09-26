import hc from "./api";

// Error codes that indicate authentication issues
const AUTH_ERROR_CODES = ["INVALID_API_KEY", "AUTHORIZATION_HEADER_REQUIRED"];

// Store the logout function reference
let logoutFn: (() => void) | null = null;

// Register the logout function
export const registerLogout = (fn: () => void) => {
  logoutFn = fn;
};

// Wrapper for API calls that handles token expiration
export const apiCall = async <T>(
  apiCallFn: () => Promise<Response>,
  parseResponse: (response: Response) => Promise<T>
): Promise<T> => {
  try {
    const response = await apiCallFn();

    if (!response.ok) {
      const errorData = await response.json();

      // Check if the error is related to authentication
      if (AUTH_ERROR_CODES.includes(errorData.cause)) {
        console.log("Token expired or invalid, logging out...");
        // Call the logout function if registered
        if (logoutFn) {
          logoutFn();
        }
        throw new Error("Session expired. Please login again.");
      }

      throw new Error(errorData.cause || "An error occurred");
    }

    return await parseResponse(response);
  } catch (error) {
    // If the error is already handled (like token expiration), just rethrow
    if (
      error instanceof Error &&
      error.message === "Session expired. Please login again."
    ) {
      throw error;
    }

    // Check if the error is related to authentication (from catch blocks)
    if (
      error instanceof Error &&
      (error.message.includes("INVALID_API_KEY") ||
        error.message.includes("AUTHORIZATION_HEADER_REQUIRED"))
    ) {
      console.log("Token expired or invalid, logging out...");
      // Call the logout function if registered
      if (logoutFn) {
        logoutFn();
      }
      throw new Error("Session expired. Please login again.");
    }

    throw error;
  }
};
