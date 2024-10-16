import React, { useState, useRef, useEffect } from "react";
import { StyleSheet, View, TextInput, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import CreateCustomerModal from "./CreateCustomerModal";
import { Entypo } from "@expo/vector-icons";
import { iCreateCustomerModal } from "@/services/customer/createCustomer";

export interface iSelectCustomer {
  value: string;
  description: string;
}

interface SelectCustomerProps {
  customers: iSelectCustomer[];
  onCreateCustomer: (newCustomer: iCreateCustomerModal) => void;
  selectedCustomer: string | null;
  onCustomerSelect: (customer: string) => void;
  searchQuery: string;
  onSearchInputChange: (text: string) => void;
}

export const SelectCustomer: React.FC<SelectCustomerProps> = ({
  customers,
  onCreateCustomer,
  selectedCustomer,
  onCustomerSelect,
  searchQuery,
  onSearchInputChange,
}) => {
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [isCreateModalVisible, setCreateModalVisible] = useState(false);
  const [isClearIconVisible, setClearIconVisible] = useState(false);
  const pickerRef = useRef<any>(null);

  const handleSelectCustomer = (value: string) => {
    if (value === "create_new_customer") {
      setCreateModalVisible(true);
    } else {
      onCustomerSelect(value);
      setPickerVisible(false);
    }
  };

  const handleFocus = () => {
    setPickerVisible(true);
    searchQuery !== "" && setClearIconVisible(true);
  };

  const handleRemoveCustomer = () => {
    Alert.alert(
      'Anda yakin?',
      'Mengubah customer akan menghapus data di keranjang anda.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Ya',
          style: 'destructive',
          onPress: () => {
            onSearchInputChange("");
            onCustomerSelect('');
            setClearIconVisible(false);
          },
        },
      ]
    );
  };
  
  const handleBlur = () => {
    setPickerVisible(false);
    setClearIconVisible(false);
  };

  useEffect(() => {
    if (isPickerVisible && searchQuery !== "") {
      pickerRef.current?.focus();
    }
  }, [customers]);

  useEffect(() => {
    if (searchQuery || selectedCustomer) {
      setClearIconVisible(true);
    } else {
      setClearIconVisible(false);
    }
  }, [searchQuery, selectedCustomer]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search customers..."
            value={selectedCustomer || searchQuery}
            onChangeText={onSearchInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {isClearIconVisible && 
            <Entypo name="circle-with-cross" size={24} color="black" style={styles.searchClearIcon}
              onPress={handleRemoveCustomer}
            />
          }
        </View>

        {isPickerVisible && (
          <View style={styles.pickerContainer}>
            <Picker
              ref={pickerRef}
              selectedValue={selectedCustomer || "create_new_customer"}
              onValueChange={handleSelectCustomer}
              style={styles.picker}
              mode="dropdown"
            >
              {customers.map((customer) => (
                <Picker.Item key={customer.value} label={customer.value} value={customer.value} />
              ))}
              <Picker.Item label="+ Create New Customer" value="create_new_customer" />
            </Picker>
          </View>
        )}

        <CreateCustomerModal
          isVisible={isCreateModalVisible}
          onCreateCustomer={onCreateCustomer}
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
  searchContainer: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    flex: 1,
    borderColor: '#ccc',
    backgroundColor: '#fafafa',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  searchClearIcon: {
    position: 'absolute',
    color: '#9a9a9a',
    right: 8,
    top: 8,
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
