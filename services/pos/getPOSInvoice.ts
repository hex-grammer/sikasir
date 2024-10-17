import { iPOSInvoice } from "@/interfaces/posInvoice/iPOSInvoice";
import { Alert } from "react-native";

export const getPOSInvoiceDetails = async (noInvoice: string):Promise<iPOSInvoice> => {
  try {
    const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice/${noInvoice}`);

    if (!response.ok) {
      throw new Error("Failed to fetch POS items.");
    }

    const {data} = await response.json();
    // console.log('posInvoice:', data);
    return data;
  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to fetch POS items. Please try again.");
    throw error;
  }
};
