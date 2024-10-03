import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from './_layout';
import { ThemedView } from '@/components/ThemedView';

interface CartItem {
  item_code: string;
  item_name: string;
  price: number;
  discount: number;
  quantity: number;
}

export default function CartScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  // Sample cart data (you can replace with actual dynamic data)
  const CART_ITEMS: CartItem[] = [
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
  ];

  const [cartItems, setCartItems] = useState<CartItem[]>(CART_ITEMS);
  const [totalAmount, setTotalAmount] = useState(calculateTotal(CART_ITEMS));

  // Calculate total price with discounts
  function calculateTotal(items: CartItem[]) {
    return items.reduce(
      (total, item) => total + (item.price - item.discount) * item.quantity,
      0
    );
  }

  // Function to update item quantity
  const handleUpdateQuantity = (itemCode: string, newQuantity: number) => {
    const updatedItems = cartItems.map((item) =>
      item.item_code === itemCode ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    setTotalAmount(calculateTotal(updatedItems));
  };

  // Function to remove item from cart
  const handleRemoveItem = (itemCode: string) => {
    const updatedItems = cartItems.filter((item) => item.item_code !== itemCode);
    setCartItems(updatedItems);
    setTotalAmount(calculateTotal(updatedItems));
  };

  // Render each item in the cart
  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemText}>
        <Text style={styles.itemName}>{item.item_name}</Text>
        <Text style={styles.itemDetails}>Price: Rp {item.price}</Text>
        <Text style={styles.itemDetails}>Discount: Rp {item.discount}</Text>
        <Text style={styles.itemDetails}>Subtotal: Rp {(item.price - item.discount) * item.quantity}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <Pressable
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.item_code, Math.max(item.quantity - 1, 1))}
        >
          <Text style={styles.quantityButtonText}>-</Text>
        </Pressable>
        <TextInput
          style={styles.quantityInput}
          keyboardType="numeric"
          value={String(item.quantity)}
          onChangeText={(text) => {
            const parsedQuantity = parseInt(text, 10);
            if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
              handleUpdateQuantity(item.item_code, parsedQuantity);
            }
          }}
        />
        <Pressable
          style={styles.quantityButton}
          onPress={() => handleUpdateQuantity(item.item_code, item.quantity + 1)}
        >
          <Text style={styles.quantityButtonText}>+</Text>
        </Pressable>
        <Pressable style={styles.removeButton} onPress={() => handleRemoveItem(item.item_code)}>
          <Text style={styles.removeButtonText}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ThemedView>
        <Text style={styles.header}>Your Cart</Text>
        {cartItems.length === 0 ? (
          <Text style={styles.emptyCartText}>Your cart is empty</Text>
        ) : (
          <>
            <FlatList
              data={cartItems}
              keyExtractor={(item) => item.item_code}
              renderItem={renderCartItem}
            />
            <View style={styles.totalContainer}>
              <Text style={styles.totalText}>Total: Rp {totalAmount}</Text>
            </View>
            <Pressable style={styles.checkoutButton} onPress={() => Alert.alert('Checkout')}>
              <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            </Pressable>
          </>
        )}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
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
  totalContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  totalText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  checkoutButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: 'white',
    fontSize: 18,
  },
  emptyCartText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#555',
  },
});
