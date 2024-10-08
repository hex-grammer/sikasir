import React, { useState, useRef } from 'react';
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import CreateCustomerModal from './CreateCustomerModal';

interface iSelectCustomer {
  name: string;
}

interface SelectCustomerProps {
  customers: iSelectCustomer[];
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

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectCustomer = (value: string) => {
    if (value === 'create_new_customer') {
      setCreateModalVisible(true);
    } else {
      setSelectedCustomer(value);
      setSearchQuery(value); 
      setPickerVisible(false);
    }
  };

  const handleCreateCustomer = () => {
    const trimmedCustomerName = newCustomerName.trim();
    if (!trimmedCustomerName) {
      return;
    }

    console.log('Creating customer:', trimmedCustomerName);
    
    onCreateCustomer(trimmedCustomerName);
    setNewCustomerName('');
    setCreateModalVisible(false);
  };

  const handleFocus = () => {
    setPickerVisible(true);
  };

  const handleBlur = () => {
    setPickerVisible(false);
    if (searchQuery.trim() === '') {
      setSearchQuery(selectedCustomer);
    }
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      pickerRef.current?.focus();
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
              <Picker.Item label="+ Buat Customer Baru" value="create_new_customer" />
            </Picker>
          </View>
        )}
        
        <CreateCustomerModal
          isVisible={isCreateModalVisible}
          onCreateCustomer={handleCreateCustomer}
          onClose={() => setCreateModalVisible(false)}
        />
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
