import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, TextInput, Alert, Modal, FlatList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { InsertSerialNumber, SerialNumber } from './InsertSerialNumber';

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
  const [isSerialModalVisible, setSerialModalVisible] = useState(false);
  const discountedPrice = item.price - item.discount;
  const [isModalVisible, setModalVisible] = useState(false);
  const [serialNumbers, setSerialNumbers] = useState<SerialNumber[]>([]);

  const handleSaveSerialNumbers = (serials: SerialNumber[]) => {
    setSerialNumbers(serials);
    setModalVisible(false);
  };

  const handleIncrease = () => setQuantity(prev => (prev < item.stock ? prev + 1 : prev));
  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleQuantityChange = (value: string) => {
    const parsedValue = parseInt(value, 10);
    if (!isNaN(parsedValue) && parsedValue >= 1 && parsedValue <= item.stock) {
      setQuantity(parsedValue);
      adjustSerialNumbers(parsedValue); // Adjust the serial number count
    }
  };

  const adjustSerialNumbers = (newQuantity: number) => {
    if (newQuantity < serialNumbers.length) {
      setSerialNumbers(serialNumbers.slice(0, newQuantity));
    } else if (newQuantity > serialNumbers.length) {
      setSerialNumbers([...serialNumbers, ...new Array(newQuantity - serialNumbers.length).fill('')]);
    }
  };

  const handleSerialNumberChange = (value: string, index: number) => {
    const updatedSerials = [...serialNumbers];
    updatedSerials[index].value = value;
    setSerialNumbers(updatedSerials);
  };

  const handleSelectSerialNumbers = () => {
    if (serialNumbers.map(sn=>sn.value).includes('')) {
      Alert.alert('Error', 'Please fill in all serial numbers');
    } else {
      // Save the serial numbers and item code
      console.log('Item code:', item.item_code);
      console.log('Serial numbers:', serialNumbers);
      setSerialModalVisible(false);
    }
  };

  return (
    <View style={styles.card}>
      {/* Item Details */}
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
        {/* Price Section */}
        <View style={styles.priceInfo}>
          {item.discount > 0 && (
            <Text style={styles.originalPrice}>Rp {item.price.toLocaleString()}</Text>
          )}
          <Text style={styles.discountedPrice}>Rp {discountedPrice.toLocaleString()}</Text>
        </View>

        {/* Quantity and Cart Actions */}
        <View style={styles.cartActions}>
          <Pressable style={styles.quantityButton} onPress={handleDecrease}>
            <Text style={styles.quantityButtonText}>-</Text>
          </Pressable>

          <TextInput
            style={styles.quantityInput}
            value={String(quantity)}
            keyboardType="numeric"
            onChangeText={handleQuantityChange}
          />

          <Pressable style={styles.quantityButton} onPress={handleIncrease}>
            <Text style={styles.quantityButtonText}>+</Text>
          </Pressable>

          {/* Button to open serial number modal */}
          <Pressable
            style={styles.addToCartButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.addToCartButtonText}>
              <FontAwesome6 name="cart-plus" size={18} color="#24a0ed" />
            </Text>
          </Pressable>
        </View>
      </View>

      <InsertSerialNumber
        visible={isModalVisible}
        quantity={3} // or any quantity
        itemCode="PKT408"
        onSave={handleSaveSerialNumbers}
        onCancel={() => setModalVisible(false)}
      />
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5, // For shadow on Android
    shadowColor: '#000', // Shadow on iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  serialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  serialInput: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginLeft: 10,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: '#f44336', // Red for cancel
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
