import AsyncStorage from "@react-native-async-storage/async-storage";
import { handleServiceError } from "../errorHandler";

export interface iPOSInvoice {
  name:string;
  custom_pos_invoice_number: string;
  customer_name: string;
  grand_total: number;
}

export const getPOSInvoiceList = async (POSProfile: string, status: string = "Draft"): Promise<iPOSInvoice[]> => {
  try {
    const sessionId = await AsyncStorage.getItem('sid');
    if (!sessionId) throw new Error('No session ID found. Please log in again.');    

    const URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice?fields=["name", "customer_name", "grand_total", "custom_pos_invoice_number"]&filters=[["pos_profile", "=", "${POSProfile}"], ["status", "=", "${status}"]]`;
    
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
    return data.reverse();
  } catch (error: any) {
    handleServiceError(error);
    return [];
  }
};
