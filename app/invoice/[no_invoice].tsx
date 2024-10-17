import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { HomeScreenNavigationProp } from '../_layout';
import { getPOSInvoiceDetails } from '@/services/pos/getPOSInvoice';
import { iPOSInvoice } from '@/interfaces/posInvoice/iPOSInvoice';
import { iPOSInvoiceItem } from '@/services/pos/createPOSInvoice'; 

const InvoiceScreen = () => {
  const { no_invoice } = useLocalSearchParams<{ no_invoice: string }>();
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const [posInvoice, setPosInvoice] = useState<iPOSInvoice|null>(null)

  const fetchPOSInvoice = async () => {
    const res = await getPOSInvoiceDetails(no_invoice);
    setPosInvoice(res);
  }

  // Render customer info row
  const renderInfoRow = (label: string, value: string) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  // Render each item in the list
  const renderItem = ({ item }: { item: iPOSInvoiceItem }) => (
    <View style={styles.itemRow}>
      {/* Top: Item Code and Name */}
      <View><Text>{item.item_code} - {item.item_name}</Text></View>
  
      {/* Bottom: Price x Quantity (Left) and Total (Right, Bold) */}
      <View style={styles.bottomRow}>
        <Text style={styles.itemDetails}>
          Rp {item.price_list_rate?.toLocaleString()} x {item.qty}
        </Text>
        <Text style={styles.itemTotalBold}>
          Rp {(item?.price_list_rate || 0 * item.qty).toLocaleString()}
        </Text>
      </View>
    </View>
  );  

  useFocusEffect(
    useCallback(() => {
      fetchPOSInvoice();
    }, [])
  );

  if(!posInvoice) return (
    <View>
      <Text>Loading...</Text>
    </View>
  )

  return (
    <ScrollView style={{backgroundColor:'white'}}>
        <View style={styles.container}>
            {/* Customer Info Section */}
            <View style={styles.infoSection}>
                {renderInfoRow("Customer Name", posInvoice.customer)}
                {renderInfoRow("Nomor Invoice", posInvoice.custom_pos_invoice_number)}
                {renderInfoRow("Transaction Date", posInvoice.posting_date)}
                {renderInfoRow("Kasir", "PKY - DEWI SINTA (TESTING)")} 
                {renderInfoRow("Alamat", "Jl. Ampera no.123 (TESTING)")}
            </View>

            {/* Item List Section */}
            <View style={styles.itemsSection}>
                <FlatList
                data={posInvoice.items}
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
                <Text style={styles.totalValue}>Rp {posInvoice.net_total.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Discount</Text>
                <Text style={styles.totalValue}>Rp {posInvoice.discount_amount.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>PPN 11%</Text>
                <Text style={styles.totalValue}>Rp {posInvoice.total_taxes_and_charges.toLocaleString()}</Text>
                </View>
                <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Grand Total</Text>
                <Text style={styles.totalValue}>Rp {posInvoice.grand_total.toLocaleString()}</Text>
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
