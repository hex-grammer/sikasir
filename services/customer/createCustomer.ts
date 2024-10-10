import axios from 'axios';

export interface iCreateCustomerModal {
    id_outlet: string;
    nama_customer: string;
    ktp: string;
    alamat: string;
    fotoKtpUri: string;
    email?: string;
    telpon?: string;
}

export const createCustomer = async (userId: string, customerData: iCreateCustomerModal) => {
  try {
    const payload = {
      doc: {
        owner: userId,
        customer_name: customerData.nama_customer,
        custom_ktp: customerData.ktp,
        custom_alamat: customerData.alamat,
        custom_id_outlet: customerData.id_outlet,
        image: customerData.fotoKtpUri, 
        email_id: customerData.email,
        mobile_no: customerData.telpon,
        email_address: customerData.email,
        mobile_number: customerData.telpon,
        docstatus: 0,
        doctype: "Customer",
        name: `new-customer-${Math.random().toString(36).substring(2, 12)}`,
        __islocal: 1,
        __unsaved: 1,
        naming_series: "CUST-.YYYY.-",
        customer_type: "Individual",
        is_internal_customer: 0,
        companies: [],
        language: "en",
        credit_limits: [],
        accounts: [],
        sales_team: [],
        so_required: 0,
        dn_required: 0,
        is_frozen: 0,
        disabled: 0,
        portal_users: [],
        __run_link_triggers: 1,
      },
    };

    const response = await axios.post(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.client.save`,
      payload
    );
    return response.data.message;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};