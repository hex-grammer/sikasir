import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { handleServiceError } from './errorHandler';

export const login = async (username: string, password: string): Promise<boolean> => {
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

    const sessionId = response.headers['set-cookie']?.[0];
    if (!sessionId) {
      throw new Error('Failed to retrieve session ID');
    }

    await AsyncStorage.setItem('sid', sessionId);
    return true;
  } catch (error: any) {
    return handleServiceError(error, {
      'Failed to retrieve session ID': 'Login failed. Please try again.',
    });
  }
};

export const logout = async (): Promise<boolean> => {
  try {
    await axios.get(`${process.env.EXPO_PUBLIC_API_URL}/api/method/logout`);
    await AsyncStorage.removeItem('sid');
    return true;
  } catch (error: any) {
    return handleServiceError(error, {
      'Logout failed': 'Failed to logout. Please try again.',
    });
  }
};
