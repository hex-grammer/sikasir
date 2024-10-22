import { getPOSInvoiceDetails } from "./getPOSInvoice";
import { iPOSInvoice } from "./getPOSInvoiceList";

const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Closing%20Entry`;

const closePOS = async (posOpeningEntry: string, posInvoiceList: iPOSInvoice[]): Promise<any> => {
    // Log the posInvoiceList for debugging
    console.log('posInvoiceList', posInvoiceList);

    // Fetch details for each invoice and store them in an array
    const invoiceDetailsPromises = posInvoiceList.map(async (invoice) => {
        const details = await getPOSInvoiceDetails(invoice.name,['taxes','payments']);
        // console.log('details', details);
        
        return details;
    });

    // Wait for all promises to resolve
    const invoiceDetails = await Promise.all(invoiceDetailsPromises);

    // return;

    // Log the collected invoice details
    // console.log('TAXES', invoiceDetails[0]?.taxes);
    // console.log('PAYMENTS', invoiceDetails[0]?.payments);

    const grandTotal = posInvoiceList.reduce((acc, item) => acc + item.grand_total, 0);
    const netTotal = posInvoiceList.reduce((acc, item) => acc + item.net_total, 0);
    const totalQuantity = posInvoiceList.reduce((acc, item) => acc + item.total_qty, 0);
    const posTransactions = posInvoiceList.map(item=>{
        return {
            docstatus: 1,
            pos_invoice: item.name,
            grand_total: item.grand_total,
            customer: item.customer
        }
    })
    const taxes = [{
        docstatus: 1,
        amount: invoiceDetails.reduce((acc, item) => acc + (item?.taxes?.[0]?.tax_amount || 0), 0),
        account_head: invoiceDetails[0]?.taxes[0].account_head,
        rate: invoiceDetails[0]?.taxes[0].rate
    }];
    const paymentReconciliation = [{
        docstatus: 1,
        closing_amount: grandTotal,
        expected_amount: grandTotal,
        opening_amount: 0,
        mode_of_payment: invoiceDetails[0]?.payments[0].mode_of_payment
    }];

    const body = { 
        pos_opening_entry: posOpeningEntry,
        grand_total: grandTotal,
        net_total: netTotal,
        total_quantity: totalQuantity,
        pos_transactions: posTransactions,
        docstatus: 1,
        taxes,
        payment_reconciliation:paymentReconciliation
     }

    // return console.log('body', body);
     

    try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw response;
    }

    const result = await response.json();
    // console.log(result);
    
    return result;
  } catch (error: any) {
    console.error('Error closing POS:', error);
    throw new Error(error.message || "An unexpected error occurred while closing the POS.");
  }
};

export default closePOS;
