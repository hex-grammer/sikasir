import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from './_layout';
import { ThemedView } from '@/components/ThemedView';
import CartItem, { iCartItem } from '@/components/cart/CartItem';
import CustomButton from '@/components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { iPOSInvoice } from '@/interfaces/posInvoice/iPOSInvoice';
import updatePOSInvoice from '@/services/pos/updatePOSInvoice';
import { validateLink } from '@/services/validateLink';
import submitPOSInvoice from '@/services/pos/submitPOSInvoice';
import { router } from 'expo-router';

export default function CartScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [cartItems, setCartItems] = useState<iCartItem[]>([]);
  const [posInvoice, setPosInvoice] = useState<iPOSInvoice | null>(null);

  const getPOSInvoice = async () => {
    try {
      const data = await AsyncStorage.getItem('posInvoice');
      const posInvoice: iPOSInvoice | null = data ? JSON.parse(data) : null;

      if (posInvoice && posInvoice.items) {
        setPosInvoice(posInvoice);
        setCartItems(posInvoice.items);
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    }
  };

  const handleRemoveItem = (itemCode: string) => {
    Alert.alert(
      'Hapus Item?',
      `Anda yakin ingin menghapus item ${itemCode} dari keranjang?`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const updatedItems = cartItems.filter(item => item.item_code !== itemCode);

            if (!updatedItems.length) {
              AsyncStorage.removeItem('posInvoice');
              setPosInvoice(null);
              setCartItems([]);
              return;
            }

            const updatedInvoice = await updatePOSInvoice(posInvoice?.name || '', { name: posInvoice?.name, items: updatedItems})
            
            setCartItems(updatedItems);
            setPosInvoice(updatedInvoice);

            await AsyncStorage.setItem('posInvoice', JSON.stringify(updatedInvoice));
          },
        },
      ]
    );
  };

  const handleCheckout = async () => {
    if (!posInvoice) {
      Alert.alert('Oops!', 'Keranjang masih kosong. Silakan tambahkan item sebelum checkout.');
      return;
    }
    
    const isValidPosInvoice = await validateLink('POS Invoice', posInvoice.name)

    if (!isValidPosInvoice) {
      Alert.alert('Gagal', 'Data tidak valid.');
      await AsyncStorage.removeItem('posInvoice');
      return;
    }

    const isSaved =  await submitPOSInvoice(posInvoice);

    if (!isSaved) return Alert.alert('Gagal', 'Data gagal disimpan.');

    Alert.alert('Berhasil', 'Data berhasil disimpan.');

    await AsyncStorage.removeItem('posInvoice');
    setPosInvoice(null);
    setCartItems([]);
    router.push(`/invoice/${posInvoice.name}`);
  }

  const checkoutConfirm = () => {
    if (!posInvoice) {
      Alert.alert('Oops!', 'Keranjang masih kosong. Silakan tambahkan item sebelum checkout.');
      return;
    }

    Alert.alert(
      'Pembayaran',
      `Total yang harus dibayar: Rp ${posInvoice?.grand_total.toLocaleString()}`,
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Bayar',
          style: 'destructive',
          onPress: handleCheckout,
        },
      ]
    );
  };

  useEffect(() => {
    getPOSInvoice();
  }, []);

return (
  <ThemedView style={styles.container}>
    {cartItems.length === 0 ? (
      <Text style={styles.emptyCartText}>Tidak ada item di keranjang.</Text>
    ) : (
      <>
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.item_code}
          renderItem={({ item }: { item: iCartItem }) => (
            <CartItem
              item={item}
              onRemove={(itemCode) => handleRemoveItem(itemCode)}
            />
          )}
        />
      </>
    )}

    {/* Total Before Tax */}
    <View style={styles.totalContainer}>
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total Before Tax</Text>
        <Text style={styles.totalValue}>Rp {posInvoice?.net_total.toLocaleString() || 0}</Text>
      </View>

      {/* Discount */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Discount</Text>
        <Text style={styles.totalValue}>Rp {posInvoice?.discount_amount.toLocaleString() || 0}</Text>
      </View>

      {/* PPN 11% */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>PPN 11%</Text>
        <Text style={styles.totalValue}>Rp {posInvoice?.total_taxes_and_charges.toLocaleString() || 0}</Text>
      </View>

      {/* Grand Total */}
      <View style={styles.totalRow}>
        <Text style={styles.grandTotalLabel}>Grand Total</Text>
        <Text style={styles.grandTotalValue}>Rp {posInvoice?.grand_total.toLocaleString() || 0}</Text>
      </View>
    </View>

    {/* Checkout Button */}
    <CustomButton title="BAYAR" onPress={checkoutConfirm} style={styles.checkoutButton}/>
  </ThemedView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  emptyCartText: {
    flex:1,
    textAlign: 'center',
    fontSize: 16,
    color: '#555',
    marginTop: 20,
  },
  totalContainer: {
    paddingTop: 10,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  totalLabel: {
    fontSize: 16,
    color: '#333',
  },
  totalValue: {
    fontSize: 16,
    color: '#333',
    textAlign: 'right',
  },
  grandTotalLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },
  grandTotalValue: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  checkoutButton: {
    flex:0,
    marginTop: 20,
  },
});
