import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (username: string, password: string) => {
  try {
    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/login`,
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
    const sessionId = response.headers['set-cookie']?.[0];
    if (!sessionId) {
      throw new Error('Failed to retrieve session ID');
    }

    await AsyncStorage.setItem('sid', sessionId);
    return true;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/method/logout`);
    await AsyncStorage.removeItem('sid');
    return true;
  } catch (error) {
    console.error('Logout failed:', error);
  }
};
