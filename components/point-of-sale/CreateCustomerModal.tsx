import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';

interface CreateCustomerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateCustomer: (customerData: {
    id_outlet: string;
    nama_customer: string;
    ktp: string;
    alamat: string;
    fotoKtpUri?: string;
    email?: string;
    telpon?: string;
  }) => void;
}

const CreateCustomerModal: React.FC<CreateCustomerModalProps> = ({
  isVisible,
  onClose,
  onCreateCustomer,
}) => {
  const [idOutlet, setIdOutlet] = useState<string>('');
  const [namaCustomer, setNamaCustomer] = useState<string>('');
  const [ktp, setKtp] = useState<string>('');
  const [alamat, setAlamat] = useState<string>('');
  const [fotoKtpUri, setFotoKtpUri] = useState<string | undefined>();
  const [email, setEmail] = useState<string>('');
  const [telpon, setTelpon] = useState<string>('');

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('Permission Denied', 'You need to grant permission to upload an image.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setFotoKtpUri(result.assets[0].uri);
    }
  };

  const handleCreateCustomer = () => {
    if (!idOutlet || !namaCustomer || !ktp || !alamat) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    onCreateCustomer({
      id_outlet: idOutlet,
      nama_customer: namaCustomer,
      ktp: ktp,
      alamat: alamat,
      fotoKtpUri,
      email: email ? email : undefined,
      telpon: telpon ? telpon : undefined,
    });

    // Clear form fields after customer is created
    setIdOutlet('');
    setNamaCustomer('');
    setKtp('');
    setAlamat('');
    setFotoKtpUri(undefined);
    setEmail('');
    setTelpon('');
    onClose();
  };
  
  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalContainer}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView contentContainerStyle={styles.modalContent} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Create New Customer</Text>
  
            {/* ID Outlet */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ID Outlet</Text>
              <TextInput
                style={styles.input}
                placeholder="ID Outlet"
                value={idOutlet}
                onChangeText={setIdOutlet}
              />
            </View>
  
            {/* Nama Customer */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nama (sesuai KTP)</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama Customer"
                value={namaCustomer}
                onChangeText={setNamaCustomer}
              />
            </View>
  
            {/* No. KTP */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>KTP</Text>
              <TextInput
                style={styles.input}
                placeholder="No. KTP"
                value={ktp}
                onChangeText={setKtp}
              />
            </View>
  
            {/* Alamat */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Alamat (sesuai KTP)</Text>
              <TextInput
                style={styles.multilineInput}
                placeholder="Alamat..."
                value={alamat}
                onChangeText={setAlamat}
                multiline={true}
                numberOfLines={3}
                verticalAlign="top"
              />
            </View>
  
            {/* Foto KTP */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Foto KTP</Text>
              <Pressable style={styles.uploadButton} onPress={pickImage}>
                <Text style={styles.uploadButtonText}>Upload Foto KTP</Text>
              </Pressable>
              {fotoKtpUri && (
                <Image source={{ uri: fotoKtpUri }} style={styles.imagePreview} />
              )}
            </View>
  
            {/* Optional fields */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
  
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Telpon (optional)</Text>
              <TextInput
                style={styles.input}
                placeholder="No. Telpon"
                value={telpon}
                onChangeText={setTelpon}
                keyboardType="phone-pad"
              />
            </View>
  
            {/* Buttons */}
            <View style={styles.buttonsContainer}>
              <Pressable style={styles.cancelButton} onPress={onClose}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
  
              <Pressable style={styles.createButton} onPress={handleCreateCustomer}>
                <Text style={styles.createButtonText}>Create</Text>
              </Pressable>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    // width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    gap: 2,
  },
  label: {
    // fontSize: 14,
    // fontWeight: 'bold',
    // marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  multilineInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 5,
  },
  uploadButton: {
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
    marginBottom: 16,
  },
  uploadButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  imagePreview: {
    width: 100,
    height: 100,
    marginBottom: 16,
    alignSelf: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 16,
  },
  createButton: {
    flex:1,
    backgroundColor: 'black',
    padding: 10,
    borderRadius: 5,
  },
  createButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  cancelButton: {
    flex:1,
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    paddingHorizontal: 8,
  },
  cancelButtonText: {
    textAlign: 'center',
    fontWeight: 'bold',
  }
});

export default CreateCustomerModal;
