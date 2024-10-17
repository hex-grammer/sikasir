import AsyncStorage from '@react-native-async-storage/async-storage';

export interface iPOSInvoiceItem {
  item_code: string;
  qty: number;
  warehouse?: string;
  serial_no?: string;
  serial_and_batch_bundle?: string;
  actual_batch_qty?: number;
  actual_qty?: number;
  allow_zero_valuation_rate?: number;
  amount?: number;
  base_amount?: number;
  base_net_amount?: number;
  base_net_rate?: number;
  base_price_list_rate?: number;
  base_rate?: number;
  base_rate_with_margin?: number;
  brand?: string;
  conversion_factor?: number;
  cost_center?: string;
  creation?: string;
  delivered_by_supplier?: number;
  delivered_qty?: number;
  description?: string;
  discount_amount?: number;
  discount_percentage?: number;
  docstatus?: number;
  doctype?: string;
  enable_deferred_revenue?: number;
  expense_account?: string;
  grant_commission?: number;
  has_item_scanned?: number;
  idx?: number;
  image?: string;
  income_account?: string;
  is_fixed_asset?: number;
  is_free_item?: number;
  item_group?: string;
  item_name?: string;
  item_tax_rate?: string;
  item_tax_template?: string;
  margin_rate_or_amount?: number;
  margin_type?: string;
  modified?: string;
  modified_by?: string;
  name?: string;
  net_amount?: number;
  net_rate?: number;
  owner?: string;
  page_break?: number;
  parent?: string;
  parentfield?: string;
  parenttype?: string;
  price_list_rate?: number;
  rate?: number;
  rate_with_margin?: number;
  stock_qty?: number;
  stock_uom?: string;
  total_weight?: number;
  uom?: string;
  use_serial_batch_fields?: number;
  weight_per_unit?: number;
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
