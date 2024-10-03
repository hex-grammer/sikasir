import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Pressable, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';

export interface Customer {
  name: string;
}

interface SelectCustomerProps {
  customers: Customer[];
  onCreateCustomer: (newCustomer: string) => void;
}

export const SelectCustomer: React.FC<SelectCustomerProps> = ({
  customers,
  onCreateCustomer,
}) => {
  const [selectedCustomer, setSelectedCustomer] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');

  const pickerRef = useRef<any>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter customers based on search query
  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCustomer = (value: string) => {
    if (value === 'create_new_customer') {
      setCreateModalVisible(true); // Show create customer modal
    } else {
      setSelectedCustomer(value);
      setSearchQuery(value); // Set selected customer name in search input
      setPickerVisible(false); // Hide picker after selection
    }
  };

  const handleCreateCustomer = () => {
    const trimmedCustomerName = newCustomerName.trim();
    if (trimmedCustomerName) {
      onCreateCustomer(trimmedCustomerName); // Trigger the creation of the new customer
      setNewCustomerName('');
      setCreateModalVisible(false); // Close modal after creation
    }
  };

  const handleFocus = () => {
    setPickerVisible(true);
  };

  const handleBlur = () => {
    setPickerVisible(false);
    if (searchQuery.trim() === '') {
      setSearchQuery(selectedCustomer); // Reset to the selected customer if search is empty
    }
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      pickerRef.current?.focus(); // Focus picker after 800ms delay
    }, 1000);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TextInput
          style={styles.searchInput}
          placeholder="Select customers..."
          value={searchQuery}
          onChangeText={handleSearchInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />

        {/* Picker for customer selection (visible on focus) */}
        {isPickerVisible && (
          <View style={styles.pickerContainer}>
            <Picker
              ref={pickerRef}
              selectedValue={selectedCustomer}
              onValueChange={handleSelectCustomer}
              style={styles.picker}
              mode="dropdown"
            >
              {filteredCustomers.map((customer, index) => (
                <Picker.Item key={index} label={customer.name} value={customer.name} />
              ))}
              <Picker.Item label="+ Create New Customer" value="create_new_customer" />
            </Picker>
          </View>
        )}
        
        {/* Modal for creating a new customer */}
        <Modal
          visible={isCreateModalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setCreateModalVisible(false)}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Customer</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter customer name"
              value={newCustomerName}
              onChangeText={setNewCustomerName}
            />
            <Pressable style={styles.modalButton} onPress={handleCreateCustomer}>
              <Text style={styles.modalButtonText}>Create</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.cancelButton]}
              onPress={() => setCreateModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderTopWidth: 0,
    borderWidth: 1,
    borderRadius: 5,
  },
  picker: {
    height: 50,
    width: '100%',
  },
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  modalButton: {
    padding: 10,
    backgroundColor: '#2196F3',
    borderRadius: 5,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#f44336',
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
});
