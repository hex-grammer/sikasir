import { iPOSInvoice } from "@/interfaces/posInvoice/iPOSInvoice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleServiceError } from "../errorHandler";

export const getPOSInvoiceDetails = async (noInvoice: string): Promise<iPOSInvoice | null> => {
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
      throw response;
    }

    const { data } = await response.json();
    return data;
  } catch (error: any) {
    handleServiceError(error);
    return null;
  }
};
