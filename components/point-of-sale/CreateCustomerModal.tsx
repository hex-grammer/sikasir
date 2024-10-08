import React, { useState } from 'react';
import {StyleSheet,View,Text,Pressable,Modal,TextInput,TouchableWithoutFeedback,Keyboard,Image,Alert,Platform,ScrollView, KeyboardAvoidingView,} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import CustomButton from '../CustomButton';
import { ThemedText } from '../ThemedText';

export interface iCreateCustomerModal {
  id_outlet: string;
  nama_customer: string;
  ktp: string;
  alamat: string;
  fotoKtpUri?: string;
  email?: string;
  telpon?: string;
}

interface CreateCustomerModalProps {
  isVisible: boolean;
  onClose: () => void;
  onCreateCustomer: (customerData: iCreateCustomerModal) => void;
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
              <ThemedText>ID Outlet</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="ID Outlet"
                value={idOutlet}
                onChangeText={setIdOutlet}
              />
            </View>
  
            {/* Nama Customer */}
            <View style={styles.inputContainer}>
              <ThemedText>Nama (sesuai KTP)</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Nama Customer"
                value={namaCustomer}
                onChangeText={setNamaCustomer}
              />
            </View>
  
            {/* No. KTP */}
            <View style={styles.inputContainer}>
              <ThemedText>KTP</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="No. KTP"
                value={ktp}
                onChangeText={setKtp}
              />
            </View>
  
            {/* Alamat */}
            <View style={styles.inputContainer}>
              <ThemedText>Alamat (sesuai KTP)</ThemedText>
              <TextInput
                style={styles.multilineInput}
                placeholder="Alamat..."
                value={alamat}
                onChangeText={setAlamat}
                multiline={true}
                numberOfLines={3}
                textAlignVertical='top'
              />
            </View>
  
            {/* Foto KTP */}
            <View style={styles.inputContainer}>
              <ThemedText>Foto KTP</ThemedText>
              <CustomButton title="Upload Foto KTP" onPress={pickImage}/>
              {fotoKtpUri && (
                <Image source={{ uri: fotoKtpUri }} style={styles.imagePreview} />
              )}
            </View>
  
            {/* Optional fields */}
            <View style={styles.inputContainer}>
              <ThemedText>Email (optional)</ThemedText>
              <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />
            </View>
  
            <View style={styles.inputContainer}>
              <ThemedText>Telpon (optional)</ThemedText>
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
              <CustomButton title="Cancel" type="outline" onPress={onClose}/>
              <CustomButton title="Create" onPress={handleCreateCustomer}/>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalContent: {
    padding: 20,
    paddingTop: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  inputContainer: {
    display: 'flex',
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  multilineInput: {
    borderColor: '#ccc',
    borderWidth: 1,
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
    marginTop: 4,
    marginBottom: 4,
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
