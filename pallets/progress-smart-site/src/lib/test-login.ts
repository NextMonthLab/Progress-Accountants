import { apiRequest } from "./queryClient";

/**
 * A test function to make a login request to the server
 * This can be called from the browser console to help debug authentication issues
 */
export async function testLogin(username: string, password: string) {
  try {
    console.log(`Attempting login with username: ${username}`);
    const response = await apiRequest("POST", "/api/login", { username, password });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Login failed:', response.status, errorData);
      return { success: false, status: response.status, error: errorData };
    }
    
    const data = await response.json();
    console.log('Login successful:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Login error:', error);
    return { success: false, error };
  }
}

// Make the function available in the window object for console access
declare global {
  interface Window {
    testLogin: typeof testLogin;
  }
}

if (typeof window !== 'undefined') {
  window.testLogin = testLogin;
}