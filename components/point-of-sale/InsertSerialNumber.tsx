import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert, Modal, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { iItemCart } from './ItemCard';
import CustomButton from '../CustomButton';
import { iPOSInvoice } from '@/interfaces/posInvoice/iPOSInvoice';

export interface iSerialNumber {id: string;value: string;}

interface InsertSerialNumberProps {
  selectedItem: iItemCart;
  isModalVisible: boolean;
  setSelectedItem: React.Dispatch<React.SetStateAction<iItemCart>>;
  onSave: (serials: iSerialNumber[]) => Promise<Boolean>;
  onClose: () => void;
  posInvoice?: iPOSInvoice;
}

const InsertSerialNumber: React.FC<InsertSerialNumberProps> = ({selectedItem,setSelectedItem,isModalVisible,onClose,onSave, posInvoice}) => {
  const [serialNumbers, setSerialNumbers] = useState<iSerialNumber[]>(Array.from({ length: selectedItem.quantity }, (_, i) => ({ id: String(i), value: '' })));
  const [batchInput, setBatchInput] = useState<string>('');

  // Sync serial number inputs with the quantity when quantity changes
  useEffect(() => {
    if (selectedItem.quantity === serialNumbers.length) return;

    setSerialNumbers(
      Array.from({ length: selectedItem.quantity }, (_, i) => serialNumbers[i] || { id: String(i), value: '' })
    );
  }, [selectedItem.quantity]);

  const handleSerialChange = (index: number, value: string) => {
    setSerialNumbers(prev => {
      const updated = [...prev];
      updated[index].value = value;
      return updated;
    });
  };

  const handleRemoveSerial = (index: number) => {
    if (serialNumbers.length === 1) return;

    setSerialNumbers(prev => prev.filter((_, i) => i !== index));
    setSelectedItem(prev => ({ ...prev, quantity: prev.quantity - 1 }));
  };

  const handleAddSerial = () => {
    if (serialNumbers.length >= selectedItem.actual_qty) return;

    const uniqueId = Date.now().toString();
    setSerialNumbers(prev => [...prev, { id: `${prev.length} ${uniqueId}`, value: '' }]);
    setSelectedItem(prev => ({ ...prev, quantity: prev.quantity + 1 }));
  };

  const handleBatchInput = () => {
    const batchArray = batchInput.trim().split(/\s+/).filter(Boolean);
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

  const handleClose = () => {
    setSerialNumbers([{id: '0',value: ''}]);
    setSelectedItem(prev => ({ ...prev, quantity: 1 }));
    onClose();
  };

  const handleSave = async () => {
    if (serialNumbers.some(sn => sn.value.trim() === '')) {
      Alert.alert('Error', 'Please fill in all serial numbers.');
      return;
    }
    
    const isSaved = await onSave(serialNumbers);
    if (!isSaved) return;
    
    setSerialNumbers([{id: '0',value: ''}]);
    setSelectedItem(prev => ({ ...prev, quantity: 1 }));
  };

  return (
    <Modal visible={isModalVisible} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <ThemedText type='subtitle' style={styles.title}>Serial Number {selectedItem.item_code}</ThemedText>
          <View style={styles.stockQuantityContainer}>
            <ThemedText>Total Quantity: {selectedItem.quantity}</ThemedText>
            <ThemedText>Stock: {selectedItem.actual_qty} </ThemedText>
          </View>
          <TextInput
            style={styles.batchInput}
            value={batchInput}
            onChangeText={setBatchInput}
            placeholder='Contoh: "120 121 122" atau "120::122"'
            inputMode='text'
            multiline={true}
            numberOfLines={3}
          />
          <CustomButton title="Insert Serial Numbers" onPress={handleBatchInput} style={styles.batchButton}/>

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
            ListFooterComponent={
              <CustomButton title="Add Serial Number" onPress={handleAddSerial} type='outline'/>
            }
          />

          {/* Save and Close Buttons */}
          <View style={styles.buttonsContainer}>
            <CustomButton title="Close" onPress={handleClose} type='outline'/>
            <CustomButton title="Add to cart" onPress={handleSave}/>
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
    height: '100%',
  },
  container: {
    backgroundColor: 'white',
    padding: 16,
    minWidth: '90%',
  },
  title: {
    marginBottom: 16,
  },
  stockQuantityContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    flex:0,
    marginBottom: 16,
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
    color: '#aaa',
  },
});
