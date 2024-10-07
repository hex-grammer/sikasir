import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from './_layout';
import { ThemedView } from '@/components/ThemedView';
import CartItem, { iCartItem } from '@/components/cart/CartItem';

export default function CartScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Sample cart data (you can replace with actual dynamic data)
  const CART_ITEMS: iCartItem[] = [
    {
      item_code: 'PKT408',
      item_name: 'Voucher 1.5GB 3 Hari Zona 3',
      price: 47000,
      discount: 8000,
      quantity: 2,
    },
    {
      item_code: 'PKT409',
      item_name: 'Voucher 3GB 5 Hari Zona 3',
      price: 85000,
      discount: 0,
      quantity: 1,
    },
    {
      item_code: 'PKT4010',
      item_name: 'Voucher 3GB 5 Hari Zona 3',
      price: 85000,
      discount: 0,
      quantity: 3,
    },
  ];

  const [cartItems, setCartItems] = useState<iCartItem[]>(CART_ITEMS);
  const [totalAmount, setTotalAmount] = useState(calculateTotal(CART_ITEMS));

  // Calculate total price with discounts
  function calculateTotal(items: iCartItem[]) {
    return items.reduce(
      (total, item) => total + (item.price - item.discount) * item.quantity,
      0
    );
  }

  // Calculate total before tax
  const totalBeforeTax = calculateTotal(cartItems);
  
  // Calculate discount
  const discount = totalBeforeTax - totalAmount;
  
  // Calculate PPN 11%
  const taxAmount = totalAmount * 0.11;

// Function to remove item from cart with confirmation
const handleRemoveItem = (itemCode: string) => {
  Alert.alert(
    'Hapus Item?',
    `Anda yakin ingin menghapus item ${itemCode} dari keranjang?`,
    [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: () => {
          const updatedItems = cartItems.filter((item) => item.item_code !== itemCode);
          setCartItems(updatedItems);
          setTotalAmount(calculateTotal(updatedItems));
        },
      },
    ]
  );
};

// Function to handle checkout
const handleCheckout = () => {
  Alert.alert(
    'Pembayaran',
    `Total yang harus dibayar: Rp ${totalAmount.toLocaleString()}`,
    [
      {
        text: 'Batal',
        style: 'cancel',
      },
      {
        text: 'Bayar',
        style: 'destructive',
        onPress: () => {
          setCartItems([]);
          setTotalAmount(0);
        },
      },
    ]
  )
};

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
        <Text style={styles.totalValue}>Rp {totalBeforeTax.toLocaleString()}</Text>
      </View>

      {/* Discount */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Discount</Text>
        <Text style={styles.totalValue}>Rp {discount.toLocaleString()}</Text>
      </View>

      {/* PPN 11% */}
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>PPN 11%</Text>
        <Text style={styles.totalValue}>Rp {taxAmount.toLocaleString()}</Text>
      </View>

      {/* Grand Total */}
      <View style={styles.totalRow}>
        <Text style={styles.grandTotalLabel}>Grand Total</Text>
        <Text style={styles.grandTotalValue}>Rp {totalAmount.toLocaleString()}</Text>
      </View>
    </View>

    <Pressable
      style={styles.checkoutButton}
      onPress={handleCheckout}
    >
      <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
    </Pressable>
  </ThemedView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 10,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
  },
  cartItemText: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  itemDetails: {
    fontSize: 14,
    color: '#555',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  quantityButtonText: {
    fontSize: 18,
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  removeButton: {
    backgroundColor: '#ff6347',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  removeButtonText: {
    color: 'white',
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
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
    // fontWeight: 'bold',
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
    marginTop: 20,
    // backgroundColor: '#007bff',
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
