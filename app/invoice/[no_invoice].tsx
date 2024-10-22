import { useFocusEffect, useLocalSearchParams, useNavigation } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ScrollView, Image } from 'react-native';
import CustomButton from '@/components/CustomButton';
import { HomeScreenNavigationProp } from '../_layout';
import { getPOSInvoiceDetails, iPOSInvoiceDetails } from '@/services/pos/getPOSInvoice';
import { iPOSInvoiceItem } from '@/services/pos/createPOSInvoice'; 
import Separator from '@/components/invoice/Separator';

const InvoiceScreen = () => {
  const { no_invoice } = useLocalSearchParams<{ no_invoice: string }>();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [posInvoice, setPosInvoice] = useState<iPOSInvoiceDetails | null>(null);

  const fetchPOSInvoice = useCallback(async () => {
    const res = await getPOSInvoiceDetails(no_invoice);
    setPosInvoice(res);
  }, [no_invoice]);

  useFocusEffect(useCallback(() => {
    fetchPOSInvoice();
  }, [fetchPOSInvoice]));

  if (!posInvoice) return <View><Text>Loading...</Text></View>;

  const { customer_details, owner_details, cluster_details } = posInvoice;

  const renderInfoRow = (label: string, value: string) => (
    <View style={styles.infoRow}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.colon}>:</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );

  const renderItem = ({ item }: { item: iPOSInvoiceItem }) => (
    <View style={styles.itemRow}>
      <Text style={[styles.itemText, styles.itemCodeColumn]}>{item.item_code}</Text>
      <Text style={[styles.itemText, styles.descriptionColumn]}>{item.item_name}</Text>
      <Text style={[styles.itemText, styles.qtyColumn]}>{item.qty}</Text>
      <Text style={[styles.itemText, styles.totalColumn]}>
        {((item.price_list_rate || 0) * item.qty).toLocaleString()}
      </Text>
    </View>
  );

  return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.logoSection}>
          <Image 
            source={require('@/assets/images/Logo Megaponsel.png')} 
            style={styles.logo} 
            resizeMode="contain"
          />
        </View>

        <Text style={styles.companyInfo}>
          PT. MAKASSAR MEGA PUTRA PRIMA {'\n'} JL. AP PETTARANI NO. 18 BLOK A10, KEL. TAMAMAUNG, KEC. PANAKKUKKANG, MAKASSAR 90231 NPWP: 002.217.307.4.812.000 {'\n'} TLP: 0411-427116
        </Text>

        <Separator />

        <Text style={styles.companyInfo}>
          {cluster_details ? (
            <>
              CLUSTER {cluster_details.nomor_cluster} - {cluster_details.nama_cluster} {'\n'} 
              {cluster_details.alamat_cluster} {'\n'} 
              {cluster_details.telpon ? `TLP: ${cluster_details.telpon}` : ''}
            </>
          ) : (
            "Cluster details not available"
          )}
        </Text>

        <Separator />

        <View style={styles.infoSection}>
          {renderInfoRow("ID DIGISPOS", customer_details.custom_id_outlet || "-")}
          {renderInfoRow("CUSTOMER", posInvoice.customer_name || "-")}
          {renderInfoRow("NPWP", customer_details.custom_npwp || "-")}
          {renderInfoRow("KTP", customer_details.custom_ktp || "-")}
          {renderInfoRow("ALAMAT", customer_details.custom_alamat || "-")}
          <Separator />
          {renderInfoRow("NO INVOICE", posInvoice.custom_pos_invoice_number || "-")}
          {renderInfoRow("TGL INVOICE", `${posInvoice.posting_date} ${posInvoice.posting_time}` || "-")}
          {renderInfoRow("SALES", owner_details.full_name || "-")}
        </View>

        <Separator />

        <View>
          <View style={styles.itemRow}>
            <Text style={[styles.headerText, styles.itemCodeColumn]}>ITEM</Text>
            <Text style={[styles.headerText, styles.descriptionColumn]}>DESKRIPSI</Text>
            <Text style={[styles.headerText, styles.qtyColumn]}>QTY</Text>
            <Text style={[styles.headerText, styles.totalColumn]}>TOTAL</Text>
          </View>
          <FlatList
            data={posInvoice.items.length > 0 ? posInvoice.items : [{ item_code: 'VC12', item_name: 'VOUCHER INTERNET (V065)', qty: 1, price_list_rate: 2000 }]}
            keyExtractor={(item) => item.item_code}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            scrollEnabled={false}
          />
        </View>

        <View>
          {[
            { label: "TOTAL BEFORE TAX", value: posInvoice.net_total || 0 },
            { label: "DISCOUNT", value: posInvoice.discount_amount || 0 },
            { label: "TAX", value: posInvoice.total_taxes_and_charges || 0 },
            { label: "TOTAL AFTER TAX", value: posInvoice.grand_total || 0 },
            { label: "PAID AMOUNT", value: posInvoice.paid_amount || 0 },
          ].map(({ label, value }) => (
            <View key={label} style={styles.totalRow}>
              <Text style={styles.totalLabel}>{label}</Text>
              <Text style={styles.totalValue}>Rp {value.toLocaleString()}</Text>
            </View>
          ))}
        </View>

        <Separator />
        <Text style={styles.taxNote}>
          "Invoice yang dipersamakan dengan Faktur Pajak berdasarkan PMK Nomor 6/PMK.03/2021"
        </Text>
        <Separator />

        <Text style={styles.footerNote}>
          TERIMA KASIH SUDAH BERBELANJA. INI ADALAH BUKTI PEMBAYARAN YANG SAH DARI PT. MAKASSAR MEGA PUTRA PRIMA. HARAP DISIMPAN SEBAGAI BUKTI JIKA NANTI TERJADI HAL – HAL YANG MERUGIKAN CUSTOMER.
        </Text>
      </View>

      <View style={styles.buttonsSection}>
        <CustomButton title="Selesai" onPress={() => navigation.navigate('(tabs)')}/>
        <CustomButton title="Transaksi Baru" type="outline" onPress={() => navigation.navigate('point-of-sale')}/>
        <CustomButton title="Print Invoice" type="outline" onPress={() => alert("Print Invoice")}/>
        <CustomButton title="Download Invoice" type="outline" onPress={() => alert("Download Invoice")}/>
        <CustomButton title="Kirim Email" type="outline" onPress={() => alert("Send Email")}/>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: { backgroundColor: 'white' },
  container: {
    margin: 15,
    marginBottom: 0,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderColor: '#ccc',
    padding: 15,
    paddingVertical: 0,
    borderWidth: 1,
    borderBottomWidth: 0,
  },
  logoSection: { alignItems: 'center', justifyContent: 'center' },
  logo: { width: 100, height: 78.5 },
  companyInfo: { textAlign: 'center', fontSize: 12, textTransform: 'uppercase' },
  infoSection: { paddingVertical: 4 },
  infoRow: { flexDirection: 'row', alignItems: 'flex-start' },
  label: { fontWeight: 'bold', flex: 1, textAlign: 'left' },
  colon: { marginHorizontal: 4, textAlign: 'center', width: 10 },
  value: { flex: 2, textAlign: 'left' },
  itemRow: { flexDirection: 'row', marginBottom: 4 },
  headerText: { fontWeight: 'bold' },
  itemCodeColumn: { flex: 1 },
  descriptionColumn: { flex: 3 },
  qtyColumn: { flex: 1, textAlign: 'center' },
  totalColumn: { flex: 2, textAlign: 'right' },
  itemText: {},
  totalRow: { flexDirection: 'row', justifyContent: 'space-between' },
  totalLabel: { fontWeight: 'bold' },
  totalValue: { textAlign: 'right' },
  taxNote: { textAlign: 'center', fontWeight: 'bold' },
  footerNote: { textAlign: 'justify' },
  buttonsSection: { display: 'flex', gap: 8, padding: 20, marginBottom: 80 },
});

export default InvoiceScreen;
