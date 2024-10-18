import { iPOSInvoice } from "@/interfaces/posInvoice/iPOSInvoice";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const getPOSInvoiceDetails = async (noInvoice: string): Promise<iPOSInvoice> => {
  try {
    const sessionId = await AsyncStorage.getItem('sid');
    if (!sessionId) throw new Error('No session ID found. Please log in again.');

    const URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice/${noInvoice}`;
    
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': sessionId,
      },
    });

    if (!response.ok) {
      if (response.status === 403) {
        throw new Error("You don't have permission to access this POS Invoice.");
      }      
      throw new Error(`Failed to fetch POS invoice. Status: ${response.status}`);
    }

    const { data } = await response.json();
    return data;
  } catch (error: any) {
    console.error('Error in getPOSInvoiceDetails:', error);
    
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
      default:
        errorMessage = error.message || "Failed to fetch POS invoice. Please try again.";
    }
    
    Alert.alert("Error", errorMessage);
    throw error;
  }
};
