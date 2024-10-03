import React, { useState } from 'react';
import { Modal, View, Text, TextInput, Pressable, FlatList, StyleSheet } from 'react-native';

export interface SerialNumber {
  id: string;
  value: string;
}

interface InsertSerialNumberProps {
  visible: boolean;
  quantity: number;
  itemCode: string;
  onSave: (serialNumbers: SerialNumber[]) => void;
  onCancel: () => void;
}

export const InsertSerialNumber: React.FC<InsertSerialNumberProps> = ({
  visible,
  quantity,
  itemCode,
  onSave,
  onCancel,
}) => {
  const [serialNumbers, setSerialNumbers] = useState<SerialNumber[]>(
    Array.from({ length: quantity }, (_, i) => ({ id: `${i + 1}`, value: '' }))
  );

  const handleSerialNumberChange = (id: string, value: string) => {
    setSerialNumbers(prevSerials =>
      prevSerials.map(serial => (serial.id === id ? { ...serial, value } : serial))
    );
  };

  const handleSave = () => {
    const filledSerialNumbers = serialNumbers.filter(sn => sn.value !== '');
    if (filledSerialNumbers.length === quantity) {
      onSave(filledSerialNumbers);
    } else {
      alert(`Please fill in all ${quantity} serial numbers.`);
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Enter Serial Numbers for {itemCode}</Text>

          <FlatList
            data={serialNumbers}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.serialRow}>
                <Text>Serial {item.id}:</Text>
                <TextInput
                  style={styles.serialInput}
                  value={item.value}
                  onChangeText={text => handleSerialNumberChange(item.id, text)}
                  placeholder="Enter serial number"
                />
              </View>
            )}
          />

          <Pressable style={styles.modalButton} onPress={handleSave}>
            <Text style={styles.modalButtonText}>Save Serial Numbers</Text>
          </Pressable>

          <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={onCancel}>
            <Text style={styles.modalButtonText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    elevation: 5,
    shadowColor: '#000',
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
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});
