import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert, Modal, StyleSheet } from 'react-native';

export interface SerialNumber {
  id: string;
  value: string;
}

interface InsertSerialNumberProps {
  quantity: number;
  itemCode: string;
  initialSerialNumbers: SerialNumber[];
  isModalVisible: boolean;
  onSave: (serials: SerialNumber[]) => void;
  onClose: () => void;
  setQuantity: (newQuantity: number) => void; // Add this prop to sync quantity
}

const InsertSerialNumber: React.FC<InsertSerialNumberProps> = ({
  quantity,
  itemCode,
  initialSerialNumbers,
  isModalVisible,
  onSave,
  onClose,
  setQuantity, // Use setQuantity here
}) => {
  const [serialNumbers, setSerialNumbers] = useState<SerialNumber[]>(
    initialSerialNumbers.length
      ? initialSerialNumbers
      : Array.from({ length: quantity }, (_, i) => ({ id: String(i), value: '' }))
  );
  const [batchInput, setBatchInput] = useState<string>('');

  useEffect(() => {
    // Sync serial number inputs with the quantity when quantity changes
    if (quantity !== serialNumbers.length) {
      setSerialNumbers(
        Array.from({ length: quantity }, (_, i) => serialNumbers[i] || { id: String(i), value: '' })
      );
    }
  }, [quantity]);

  const handleSerialChange = (index: number, value: string) => {
    setSerialNumbers(prev => {
      const updated = [...prev];
      updated[index].value = value;
      return updated;
    });
  };

  const handleRemoveSerial = (index: number) => {
    setSerialNumbers(prev => prev.filter((_, i) => i !== index));
    setQuantity(quantity - 1);
  };

  const handleAddSerial = () => {
    setSerialNumbers(prev => [...prev, { id: `${prev.length}`, value: '' }]);
    setQuantity(quantity + 1);
  };

  const handleBatchInput = () => {
    const batchArray = batchInput.split(/\s+/).filter(Boolean);
    let serialsToInsert: string[] = [];

    for (let entry of batchArray) {
      if (entry.includes('::')) {
        const [start, end] = entry.split('::').map(Number);

        if (isNaN(start) || isNaN(end) || start > end) {
          Alert.alert('Error', `Invalid range: ${entry}`);
          return;
        }

        for (let i = start; i <= end; i++) {
          serialsToInsert.push(i.toString());
        }
      } else {
        serialsToInsert.push(entry);
      }
    }

    setSerialNumbers(prev => {
      const updated = [...prev];
      let insertIndex = 0;

      for (let i = 0; i < updated.length && insertIndex < serialsToInsert.length; i++) {
        if (!updated[i].value) {
          updated[i].value = serialsToInsert[insertIndex];
          insertIndex++;
        }
      }

      if (insertIndex < serialsToInsert.length) {
        Alert.alert('Error', 'Too many serial numbers in batch input.');
      }

      return updated;
    });

    setBatchInput('');
  };

  const handleSave = () => {
    if (serialNumbers.some(sn => sn.value.trim() === '')) {
      Alert.alert('Error', 'Please fill in all serial numbers.');
      return;
    }
    setSerialNumbers([{
      id: '0',
      value: ''
    }]);
    onSave(serialNumbers);
  };

  useEffect(() => {
    if (quantity !== serialNumbers.length) {
      setQuantity(quantity);
    }
  }, [quantity]);

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Text style={styles.title}>Serial Number {itemCode}</Text>

          {/* total quantity */}
          <Text style={styles.totalQty}>Total Quantity: {quantity}</Text>

          <TextInput
            style={styles.batchInput}
            value={batchInput}
            onChangeText={setBatchInput}
            placeholder='Contoh: "120 121 122" atau "120::122"'
            inputMode='text'
            multiline={true}
            numberOfLines={3}
          />
          <Pressable onPress={handleBatchInput} style={styles.batchButton}>
            <Text style={styles.batchButtonText}>Insert Serial Numbers</Text>
          </Pressable>

          <FlatList
            data={serialNumbers}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.serialRow}>
                <TextInput
                  style={styles.serialInput}
                  value={item.value}
                  onChangeText={(value) => handleSerialChange(index, value)}
                  placeholder={`Serial ${index + 1}`}
                />
                <Pressable onPress={() => handleRemoveSerial(index)} style={styles.removeButton}>
                  <Text style={styles.removeButtonText}>✕</Text>
                </Pressable>
              </View>
            )}
            ListFooterComponent={() => (
              <Pressable onPress={handleAddSerial} style={styles.addSerialButton}>
                <Text style={styles.addSerialButtonText}>Add Serial Number</Text>
              </Pressable>
            )}
          />

          {/* Save and Close Buttons */}
          <View style={styles.buttonsContainer}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
            <Pressable onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Add to cart</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InsertSerialNumber;

const styles = StyleSheet.create({
  modalContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    // paddingVertical: 20,
    height: '100%',
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    minWidth: '90%',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  totalQty: {
    // fontSize: 16,
    marginBottom: 8,
  },
  batchInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
    textAlignVertical: 'top',
  },
  batchButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 4,
    marginBottom: 16,
  },
  batchButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  serialInput: {
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 4,
    padding: 2,
    paddingHorizontal: 8,
    flex:1,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    gap: 12,
  },
  saveButton: {
    backgroundColor: '#000',
    padding: 12,
    borderRadius: 4,
    flex:1,
  },
  saveButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  closeButton: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    padding: 12,
    borderRadius: 4,
    flex:1,
  },
  closeButtonText: {
    color: 'black',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  serialRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  removeButton: {
    marginLeft: 10,
    borderColor: '#aaa',
    borderWidth: 1,
    padding: 6,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  removeButtonText: {
    // color: '#f44336',
    color: '#aaa',
  },
  addSerialButton: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    padding: 8,
    alignItems: 'center',
  },
  addSerialButtonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});
