import axios from 'axios';

export interface iPOSInvoiceItem {
  item_code: string;
  qty: number;
  warehouse: string;
  serial_no?: string;
  serial_and_batch_bundle?: string;
}

export interface iPOSInvoicePayment {
  mode_of_payment: string;
}

export interface iCreatePOSInvoicePayload {
  customer: string;
  pos_profile: string;
  selling_price_list: string;
  set_warehouse: string;
  items: iPOSInvoiceItem[];
  payments: iPOSInvoicePayment[];
}

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice`;

const createPOSInvoice = async (payload: iCreatePOSInvoicePayload) => {
  try {
    const { data } = await axios.post(API_URL, payload);
    console.log('POS Invoice created successfully:', data);
    return data.data;
  } catch (error) {
    console.error('Error creating POS Invoice:', error);
    throw error;
  }
};

export default createPOSInvoice;
