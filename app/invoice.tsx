import { useNavigation } from 'expo-router';
import React from 'react';
import { View, Text, FlatList, Pressable, StyleSheet, ScrollView } from 'react-native';
import { HomeScreenNavigationProp } from './_layout';
import CustomButton from '@/components/CustomButton';

// Sample data
const CUSTOMER_INFO = {
  customer_name: "John Doe",
  nomor_invoice: "INV-2024001",
  transaction_date: "03 Oct 2024",
  kasir: "Jane Smith",
  alamat: "123 Main Street",
};

const ITEMS = [
    {
      item_code: "PKT001",
      item_name: "Voucher 5GB 7 Days",
      price: 70000,
      quantity: 1,
    },
    {
      item_code: "PKT002",
      item_name: "Voucher 10GB 14 Days",
      price: 120000,
      quantity: 2,
    },
    {
      item_code: "PKT003",
      item_name: "Voucher 20GB 30 Days",
      price: 200000,
      quantity: 1,
    },
    // {
    //   item_code: "PKT004",
    //   item_name: "Voucher 50GB 90 Days",
    //   price: 450000,
    //   quantity: 3,
    // },
    // {
    //   item_code: "PKT005",
    //   item_name: "Voucher 100GB 180 Days",
    //   price: 800000,
    //   quantity: 1,
    // },
    // {
    //   item_code: "PKT006",
    //   item_name: "Mobile Data 1GB 1 Day",
    //   price: 15000,
    //   quantity: 5,
    // },
    // {
    //   item_code: "PKT007",
    //   item_name: "Mobile Data 3GB 7 Days",
    //   price: 45000,
    //   quantity: 4,
    // },
    // {
    //   item_code: "PKT008",
    //   item_name: "Mobile Data 10GB 30 Days",
    //   price: 100000,
    //   quantity: 2,
    // },
    // {
    //   item_code: "PKT009",
    //   item_name: "Mobile Data 25GB 60 Days",
    //   price: 250000,
    //   quantity: 1,
    // },
    // {
    //   item_code: "PKT010",
    //   item_name: "Mobile Data Unlimited 30 Days",
    //   price: 300000,
    //   quantity: 1,
    // },
  ];  

// Sample total calculations
const totalBeforeTax = 180000;
const discount = 8000;
const PPN = totalBeforeTax * 0.11;
const grandTotal = totalBeforeTax - discount + PPN;

const InvoiceScreen = () => {
    const navigation = useNavigation<HomeScreenNavigationProp>();

  // Render customer info row
  const renderInfoRow = (label: string, value: string) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

// Render each item in the list
const renderItem = ({ item }: { item: { item_code: string; item_name: string; price: number; quantity: number } }) => (
    <View style={styles.itemRow}>
      {/* Top: Item Code and Name */}
      <View><Text>{item.item_code} - {item.item_name}</Text></View>
  
      {/* Bottom: Price x Quantity (Left) and Total (Right, Bold) */}
      <View style={styles.bottomRow}>
        <Text style={styles.itemDetails}>
          Rp {item.price.toLocaleString()} x {item.quantity}
        </Text>
        <Text style={styles.itemTotalBold}>
          Rp {(item.price * item.quantity).toLocaleString()}
        </Text>
      </View>
    </View>
  );  

  return (
    <ScrollView style={{backgroundColor:'white'}}>
        <View style={styles.container}>
            {/* Customer Info Section */}
            <View style={styles.infoSection}>
                {renderInfoRow("Customer Name", CUSTOMER_INFO.customer_name)}
                {renderInfoRow("Nomor Invoice", CUSTOMER_INFO.nomor_invoice)}
                {renderInfoRow("Transaction Date", CUSTOMER_INFO.transaction_date)}
                {renderInfoRow("Kasir", CUSTOMER_INFO.kasir)}
                {renderInfoRow("Alamat", CUSTOMER_INFO.alamat)}
            </View>

            {/* Item List Section */}
            <View style={styles.itemsSection}>
                <FlatList
                data={ITEMS}
                keyExtractor={(item) => item.item_code}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                scrollEnabled={false}
                />
            </View>

            {/* Totals Section */}
            <View>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Before Tax</Text>
                <Text style={styles.totalValue}>Rp {totalBeforeTax.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>Rp {discount.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>PPN 11%</Text>
                <Text style={styles.totalValue}>Rp {PPN.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>Rp {grandTotal.toLocaleString()}</Text>
                </View>
            </View>
        </View>

        {/* Buttons Section */}
        <View style={styles.buttonsSection}>
            <CustomButton title="Transaksi Baru" onPress={() => {navigation.navigate('point-of-sale');}}/>
            <CustomButton title="Print Invoice" type="outline" onPress={() => alert("Print Invoice")}/>
            <CustomButton title="Download Invoice" type="outline" onPress={() => alert("Download Invoice")}/>
            <CustomButton title="Kirim Email" type="outline" onPress={() => alert("Send Email")}/>
        </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    margin:15,
    marginBottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#ccc',
    padding: 15,
    paddingBottom:0,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  infoSection: {
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    textAlign: 'right',
  },
  itemsSection: {
    marginBottom: 8,
    flex: 1,
  },
  itemRow: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
  },
  itemTotalBold: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000',
  },
  itemTotal: {
    flex: 1,
    textAlign: 'right',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalLabel: {
    fontWeight: 'bold',
  },
  totalValue: {
    textAlign: 'right',
  },
  buttonsSection: {
    display: 'flex',
    gap: 8,
    padding:20,
    marginBottom: 80
  },
});

export default InvoiceScreen;
