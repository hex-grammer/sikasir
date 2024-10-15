import axios from "axios";
import { iCreatePOSInvoicePayload } from "./createPOSInvoice";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice`;

const updatePOSInvoice = async (invoiceName: string, updatePayload: Partial<iCreatePOSInvoicePayload>) => {
    try {
      const { data } = await axios.put(`${API_URL}/${invoiceName}`, updatePayload);
      console.log('POS Invoice updated successfully:', data);
      return data.data;
    } catch (error) {
      console.error('Error updating POS Invoice:', error);
      throw error;
    }
  };
  
export default updatePOSInvoice;