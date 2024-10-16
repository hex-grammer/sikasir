import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export interface iCartItem {
  item_code: string;
  item_name: string;
  price_list_rate: number;
  discount_amount: number;
  qty: number;
}

interface CartItemProps {
  item: iCartItem;
  onRemove: (itemCode: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onRemove }) => {

  const discountedPrice = item.price_list_rate - item.discount_amount;
  const subtotal = discountedPrice * item.qty;

  return (
    <View style={styles.cartItem}>
      {/* Item Title */}
      <View style={styles.titleContainer}>
        <Text style={styles.itemTitle}>{item.item_code} - {item.item_name}</Text>
        
        <Pressable style={styles.removeButton} onPress={() => onRemove(item.item_code)}>
            <Text style={styles.removeButtonText}>
                <MaterialCommunityIcons name="delete-outline" size={20} color="#ff746c" />
            </Text>
        </Pressable>
      </View>

      <View style={styles.bottomRow}>
        {/* Price x Quantity and Remove Button (Left-Bottom) */}
        <View style={styles.leftContainer}>
          <Text style={styles.priceQuantityText}>
            Rp {discountedPrice.toLocaleString()} x {item.qty}
          </Text>
        </View>

        {/* Total Price (Right-Bottom) */}
        <View style={styles.rightContainer}>
          <Text style={styles.totalPriceText}>Rp {subtotal.toLocaleString()}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titleContainer: {
    marginBottom: 5,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    flex:1,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceQuantityText: {
    fontSize: 14,
  },
  removeButton: {
    marginLeft: 10,
    // borderColor: '#ff746c',
    // borderWidth: 1,
    // paddingHorizontal: 2,
    // paddingVertical: 2,
    // borderRadius: 4,
  },
  removeButtonText: {
    color: 'red',
    // fontWeight: 'bold',
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  totalPriceText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CartItem;
