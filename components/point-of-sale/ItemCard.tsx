import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

export interface ItemCardProps {
  item: {
    item_group: string;
    item_code: string;
    item_name: string;
    price: number;
    discount: number;
    stock: number;
  };
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const [quantity, setQuantity] = useState(1);
  const discountedPrice = item.price - item.discount;

  const handleIncrease = () => setQuantity(prev => (prev < item.stock ? prev + 1 : prev));
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleQuantityChange = (value: string) => {
    if (value === '') {
      setQuantity(0); // Temporarily set quantity to 0 for empty input
    } else {
      const parsedValue = parseInt(value, 10);
      if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= item.stock) {
        setQuantity(parsedValue); // Set valid value within the stock limit
      }
    }
  };
  
  // Add a blur event handler to reset to 1 if input is left empty
  const handleQuantityBlur = () => {
    if (quantity === 0) {
      setQuantity(1); // Reset to 1 if left empty after focus lost
    }
  };  

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <Text style={styles.itemGroup}>{item.item_group}</Text>
        <View style={styles.stockChip}>
          <Text style={styles.stockText}>Stock: {item.stock}</Text>
        </View>
      </View>

      <View style={styles.middleRow}>
        <Text style={styles.itemCode}>{item.item_code}</Text>
        <Text style={styles.itemName}>{item.item_name}</Text>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.priceInfo}>
          {item.discount > 0 && (
            <Text style={styles.originalPrice}>Rp {item.price.toLocaleString()}</Text>
          )}
          <Text style={styles.discountedPrice}>Rp {discountedPrice.toLocaleString()}</Text>
        </View>

        <View style={styles.cartActions}>
          <Pressable style={styles.quantityButton} onPress={handleDecrease}>
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>
          
            <TextInput
                style={styles.quantityInput}
                value={quantity === 0 ? '' : String(quantity)} // Show empty string if quantity is 0
                keyboardType="numeric"
                onChangeText={handleQuantityChange}
                onBlur={handleQuantityBlur} // Handle resetting to 1 if empty
            />

          <Pressable style={styles.quantityButton} onPress={handleIncrease}>
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>

          <Pressable style={styles.addToCartButton}>
            <Text style={styles.addToCartButtonText}>
              {/* <MaterialIcons name="add-shopping-cart" size={24} color="white" /> */}
              <FontAwesome6 name="cart-plus" size={18} color="#24a0ed" />
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default ItemCard;

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemGroup: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#888',
  },
  stockChip: {
    backgroundColor: '#eee',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
  },
  middleRow: {
    marginBottom: 8,
  },
  itemCode: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  itemName: {
    fontSize: 16,
    marginTop: 4,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceInfo: {
    flexDirection: 'column',
  },
  discountedPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    // color: '#4CAF50',
  },
  originalPrice: {
    fontSize: 14,
    color: '#888',
    textDecorationLine: 'line-through',
  },
  cartActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#ddd',
    padding: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  quantityButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityInput: {
    width: 40,
    textAlign: 'center',
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    marginHorizontal: 4,
  },
  addToCartButton: {
    padding: 10,
    paddingVertical: 8,
    borderRadius: 4,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#24a0ed',
  },
  addToCartButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
