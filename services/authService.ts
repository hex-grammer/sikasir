import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FRAPPE_BASE_URL = 'http://157.245.58.91:8080'; // Replace with your Frappe instance

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${FRAPPE_BASE_URL}/api/method/login`,
      {
        usr: username,
        pwd: password,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    // Get the session ID from response headers and store it in AsyncStorage
    const sessionId = response.headers['set-cookie']?.[0]; // Assuming the session ID is the first cookie
    if (sessionId) {
      await AsyncStorage.setItem('sid', sessionId);
      return true; // Indicate success
    } else {
      throw new Error('Failed to retrieve session ID');
    }
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.get(`${FRAPPE_BASE_URL}/api/method/logout`);
    await AsyncStorage.removeItem('sid'); // Clear the session ID
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
