import AsyncStorage from '@react-native-async-storage/async-storage';

export interface iPOSInvoiceItem {
  item_code: string;
  qty: number;
  warehouse?: string;
  serial_no?: string;
  serial_and_batch_bundle?: string;
}

export interface iPOSInvoicePayment {
  mode_of_payment: string;
}

export interface iCreatePOSInvoicePayload {
  taxes_and_charges: string;
  customer: string;
  pos_profile: string;
  selling_price_list: string;
  set_warehouse: string;
  items: iPOSInvoiceItem[];
  payments: iPOSInvoicePayment[];
  name?: string;
}

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice`;

const createPOSInvoice = async (payload: iCreatePOSInvoicePayload) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const res = await response.json();
    if (response.ok) {
      // console.log('POS Invoice created successfully:', res.data);
      await AsyncStorage.setItem('posInvoice', JSON.stringify(res.data));
      return res.data;
    } else {
      let errorMessage = "Failed to create POS Invoice.";

      try {
        const serverMessages = JSON.parse(res._server_messages);
        const parsedMessage = serverMessages.map((msg: string) => {
          const messageObj = JSON.parse(msg);
          return messageObj.message;
        }).join(" | ");

        errorMessage = parsedMessage || errorMessage;
      } catch (parseError) {
        console.error("Error parsing server messages:", parseError);
      }
      console.error('Failed to create POS Invoice:', res);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('Error creating POS Invoice:', error);
    throw new Error(error.message || "An unexpected error occurred while creating the POS Invoice.");
  }
};

export default createPOSInvoice;
