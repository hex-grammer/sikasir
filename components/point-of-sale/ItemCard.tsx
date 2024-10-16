import React, { useEffect, useState } from 'react';
import { Pressable, TextInput, StyleSheet } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { iSerialNumber } from './InsertSerialNumber';

export interface iItemCart {
  item_code: string;    
  item_name: string;           
  price_list_rate: number;   
  actual_qty: number;         
  description: string;        
  currency: string;            
  is_stock_item: boolean;     
  uom: string;                
  discount_amount: number;
  batch_no?: string | null;   
  item_image?: string | null; 
  item_group?: string;
  quantity: number;
  serial_numbers?: iSerialNumber[];
}

interface ItemCardProps {
  item: iItemCart, 
  isModalVisible: boolean, 
  setItemList: React.Dispatch<React.SetStateAction<iItemCart[]>>,
  setSelectedItem: (item:iItemCart)=>void
}

const ItemCard: React.FC<ItemCardProps> = ({ item, isModalVisible, setSelectedItem }) => {
  const [quantity, setQuantity] = useState(item.quantity || 1);
  const [qtyInput, setQtyInput] = useState<string>(`${quantity}`);
  const discountedPrice = item.price_list_rate - item.discount_amount;

  const handleIncrease = () => {
    setQuantity(prev => (prev < item.actual_qty ? prev + 1 : prev));
    setQtyInput(String(quantity < item.actual_qty ? quantity + 1 : quantity));
  };
  
  const handleDecrease = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
    setQtyInput(String(quantity > 1 ? quantity - 1 : 1));
  };

  const handleQuantityChange = (value: string) => {
    if (value === '' || (/^\d+$/.test(value) && parseInt(value, 10) <= item.actual_qty)) {
      setQtyInput(value);
    } else {
      setQtyInput(qtyInput);
    }
  };

  const handleQuantityBlur = () => {
    if (qtyInput === '' || isNaN(parseInt(qtyInput, 10))) {
      setQuantity(1);
      setQtyInput('1');
    } else {
      const parsedValue = parseInt(qtyInput, 10);
      setQuantity(parsedValue);
      setQtyInput(String(parsedValue)); 
    }
  };

  const handleCartButtonPress = () => {
    setSelectedItem({ ...item, quantity: quantity });
  };

  // reset quantity if showSNModal is false
  useEffect(() => {
    if (!isModalVisible) {
      setQuantity(1);
      setQtyInput('1');
    }
  }, [isModalVisible]);

  return (
    <ThemedView style={styles.card}>
      <ThemedView style={styles.topRow}>
        {/* <ThemedText style={styles.itemGroup}>{item.item_group}</ThemedText> */}
        <ThemedText style={styles.itemGroup}>{item.item_code}</ThemedText>
        <ThemedView style={styles.stockChip}>
          <ThemedText style={styles.stockText}>Stock: {item.actual_qty}</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.middleRow}>
        {/* <ThemedText style={styles.itemCode}>{item.item_code}</ThemedText> */}
        <ThemedText style={styles.itemName}>{item.item_name}</ThemedText>
      </ThemedView>

      <ThemedView style={styles.bottomRow}>
        {/* Price Section */}
        <ThemedView style={styles.priceInfo}>
          {item.discount_amount > 0 && (
            <ThemedText style={styles.originalPrice}>Rp {item.price_list_rate.toLocaleString()}</ThemedText>
          )}
          <ThemedText style={styles.discountedPrice}>Rp {discountedPrice.toLocaleString()}</ThemedText>
        </ThemedView>

        {/* Quantity and Cart Actions */}
        <ThemedView style={styles.cartActions}>
          <Pressable style={styles.quantityButton} onPress={handleDecrease}>
            <ThemedText style={styles.quantityButtonText}>-</ThemedText>
          </Pressable>

          <TextInput
            style={styles.quantityInput}
            value={qtyInput}
            keyboardType="numeric"
            onChangeText={handleQuantityChange}
            onBlur={handleQuantityBlur}
          />

          <Pressable style={styles.quantityButton} onPress={handleIncrease}>
            <ThemedText style={styles.quantityButtonText}>+</ThemedText>
          </Pressable>

          <Pressable
            style={styles.addToCartButton}
            onPress={handleCartButtonPress}
          >
            <ThemedText style={styles.addToCartButtonText}>
              <FontAwesome6 name="cart-plus" size={18} color="black" />
            </ThemedText>
          </Pressable>
        </ThemedView>
      </ThemedView>
    </ThemedView>
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
    color: '#000',
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
  },
  addToCartButtonText: {
    color:'black',
    fontWeight: 'bold',
  },
});
