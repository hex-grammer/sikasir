import React from 'react';
import { Alert, View } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { iPOSInvoice } from '@/interfaces/posInvoice/iPOSInvoice';
import CustomButton from '../CustomButton';

const InvoicePrinter = ({ invoiceData }:{invoiceData:iPOSInvoice}) => {
  const generateHTML = () => {
    const itemsHTML = invoiceData.items
      .map(
        (item) =>
          `<tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.amount}</td>
          </tr>`
      )
      .join('');

    return `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
          </style>
        </head>
        <body>
          <h1>Invoice ${invoiceData.custom_pos_invoice_number}</h1>
          <p><strong>Customer:</strong> ${invoiceData.customer_name}</p>
          <p><strong>Date:</strong> ${invoiceData.posting_date}</p>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHTML}
            </tbody>
          </table>
          <p><strong>Thank you for your business!</strong></p>
        </body>
      </html>
    `;
  };

  const printInvoice = async () => {
    try {
      const { uri } = await Print.printToFileAsync({
        html: generateHTML(),
      });

      Alert.alert('Success', 'Invoice generated successfully!');
      await Print.printAsync({ uri });
    //   if (Platform.OS === 'ios') {
    //     await Print.printAsync({ uri });
    //   } else {
    //     sharePDF(uri);
    //   }
    } catch (error) {
      Alert.alert('Error', 'Failed to print the invoice.');
      console.error('Print Error:', error);
    }
  };

  const sharePDF = async (uri:string) => {
    try {
      const isSharingAvailable = await Sharing.isAvailableAsync();
      if (isSharingAvailable) {
        await Sharing.shareAsync(uri);
      } else {
        Alert.alert('Notice', 'Sharing is not available on this platform.');
      }
    } catch (error) {
      console.error('Share Error:', error);
    }
  };

  return (
      <CustomButton title="Print Invoice" onPress={printInvoice} />
    // <View style={{ padding: 20 }}>
    // </View>
  );
};

export default InvoicePrinter;
