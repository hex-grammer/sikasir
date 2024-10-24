import React, { useCallback, useEffect, useState } from "react";
import {StyleSheet,FlatList,TextInput,KeyboardAvoidingView,Platform,Alert,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp } from "../_layout";
import ItemCard, { iItemCart } from "@/components/point-of-sale/ItemCard";
import { SelectCustomer, iSelectCustomer } from "@/components/point-of-sale/SelectCustomer";
import { ThemedView } from "@/components/ThemedView";
import { CartButton } from "@/components/point-of-sale/CartButton";
import { getPOSItems } from "@/services/pos/getPOSItems";
import { getUserData, iUserData } from "@/services/user/getUserData";
import { getOpeningEntry } from "@/services/pos/getOpeningEntry";
import { searchCustomer } from "@/services/pos/searchCustomer";
import { Entypo } from "@expo/vector-icons";
import { debounce } from "@/utils/debounce";
import { ThemedText } from "@/components/ThemedText";
import { createCustomer, iCreateCustomerModal } from "@/services/customer/createCustomer";
import { uploadFile } from "@/services/uploadFile";
import InsertSerialNumber, { iSerialNumber } from "@/components/point-of-sale/InsertSerialNumber";
import { iPOSInvoice } from "@/interfaces/posInvoice/iPOSInvoice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import createPOSInvoice from "@/services/pos/createPOSInvoice";
import { getPOSProfileDetails } from "@/services/pos/getPOSProfileDetails";
import { iPOSProfile } from "@/interfaces/posProfile/iPOSProfile";
import { createSNBatch } from "@/services/pos/createSNBatch";
import updatePOSInvoice from "@/services/pos/updatePOSInvoice";
import { useFocusEffect } from "expo-router";
import { validateLink } from "@/services/validateLink";

const initSelectedItem: iItemCart = {
  item_code: "",
  item_name: "",
  price_list_rate: 0,
  actual_qty: 0,
  description: "",
  currency: "",
  is_stock_item: false,
  uom: "",
  discount_amount: 0,
  batch_no: "",
  item_image: "",
  item_group: "",
  quantity: 1,
  serial_numbers: [],
}

export default function PointOfSaleScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userData, setUserData] = useState<iUserData | null>(null);
  const [posProfile, setPosProfile] = useState<string>("");
  const [posProfileDetail, setPosProfileDetail] = useState<iPOSProfile | null>(null);
  
  // Separate states for customers and items
  const [searchCustomerQuery, setSearchCustomerQuery] = useState<string>("");
  const [searchItemQuery, setSearchItemQuery] = useState<string>("");
  const [customerList, setCustomerList] = useState<iSelectCustomer[]>([]);
  const [itemList, setItemList] = useState<iItemCart[]>([]);
  const [posInvoice, setPosInvoice] = useState<iPOSInvoice | undefined>(undefined);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isClearIconVisible, setClearIconVisible] = useState(false);
  const [cartQuantity, setCartQuantity] = useState<number>(0);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<iItemCart>(initSelectedItem);

  const fetchUserData = useCallback(async () => {
    try {
      const result = await getUserData();
      setUserData(result);

      const res = await getOpeningEntry(result.email);
      const data =  await getPOSProfileDetails(res[0].pos_profile);

      setPosProfileDetail(data);
      setPosProfile(res[0].pos_profile);
    } catch (error: any) {
      console.log(error);
      switch (error.message) {
        case "No session ID found":
          Alert.alert("Session expired", "Redirecting to login...");
          navigation.navigate("login");
          break;
        
        case "Forbidden access":
          Alert.alert("Access Denied", "You do not have permission to access this resource.");
          break;
        
        default:
          Alert.alert("Error", "Failed to fetch user data");
          break;
      }      
    }
  }, [navigation]);

  const fetchPOSItems = useCallback(async () => {
    if (!posProfile) return;
    try {
      const items = await getPOSItems(posProfile, searchItemQuery);
      setItemList(items.map((item:iItemCart) => ({ ...item, discount_amount: item.discount_amount || 0 })));
    } catch (error) {
      console.error("Error fetching POS items:", error);
    }
  }, [posProfile, searchItemQuery]);

  const fetchCustomers = useCallback(async (query: string) => {
    try {
      const customers = await searchCustomer(query);
      setCustomerList(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Alert.alert("Error", "Failed to fetch customers.");
    }
  }, []);

  const handleCreateCustomer = async (newCustomer: iCreateCustomerModal) => {
    try {
      // console.log('Uploading foto KTP...');
      const fileUploadResponse = await uploadFile(newCustomer.fotoKtpUri);
      const fileUrl = fileUploadResponse.file_url;
      const customerPayload: iCreateCustomerModal = {...newCustomer,fotoKtpUri: fileUrl};
      
      await createCustomer(userData?.email || 'Administrator',customerPayload);
      setSelectedCustomer(newCustomer.nama_customer);
      setSearchCustomerQuery(newCustomer.nama_customer);

      Alert.alert("Success", `Data customer ${newCustomer.nama_customer} berhasil dibuat.`);
    } catch (error) {
      console.error("Error while creating customer:", error);
      Alert.alert("Error", "Data customer gagal dibuat.");
    }
  };

  const handleSearchCustomerChange = (text: string) => {
    setSearchCustomerQuery(text);
  };

  const handleSelectCustomer = async (customer: string) => {
    await AsyncStorage.removeItem('posInvoice');

    setSelectedCustomer(customer);
    setPosInvoice(undefined);
    setCartQuantity(0);
  };

  const handleSearchItemChange = (text: string) => {
    setSearchItemQuery(text);
  };

  const handleSelectItem = (item:iItemCart) => {
    if (!selectedCustomer) {
      Alert.alert("Oops!", "Silahkan pilih customer terlebih dahulu.");
      return;
    }

    setModalVisible(true);
    setSelectedItem(item)
  };

  const handleAddToCart = async (serials: iSerialNumber[]): Promise<Boolean> => {
    try {
      if (!selectedCustomer || !posProfileDetail) {
        Alert.alert("Error", selectedCustomer ? "Failed to retrieve POS Profile details." : "Please select a customer first.");
        return false;
      }
  
      const storageInvoice = await AsyncStorage.getItem('posInvoice');
      let posInvoice = storageInvoice ? JSON.parse(storageInvoice) : null;
  
      const isValidPosInvoice = posInvoice && await validateLink('POS Invoice', posInvoice.name);
      if (!isValidPosInvoice) {
        await AsyncStorage.removeItem('posInvoice');
        posInvoice = null;
      }
  
      let items = posInvoice?.items ? [...posInvoice.items] : [];
      const existingItemIndex = items.findIndex(item => item.item_code === selectedItem.item_code);
  
      const serialAndBatchBundle = await createSNBatch(serials, selectedItem, {name:'',items:[{warehouse:posProfileDetail.warehouse,qty:1,item_code:selectedItem.item_code}]});
      if (!serialAndBatchBundle) return false;
  
      const updatedItem = {
        item_code: selectedItem.item_code,
        item_group: selectedItem.item_group,
        qty: selectedItem.quantity,
        warehouse: posProfileDetail.warehouse,
        serial_and_batch_bundle: serialAndBatchBundle,
      };
  
      if (existingItemIndex !== -1) {
        items[existingItemIndex] = { ...items[existingItemIndex], ...updatedItem };
      } else {
        items.push(updatedItem);
      }
  
      const payload = { name: posInvoice?.name, items };
  
      const updatedInvoice = isValidPosInvoice && posInvoice
        ? await updatePOSInvoice(posInvoice.name, payload)
        : await createPOSInvoice({
            taxes_and_charges: "Indonesia Tax - MMPP",
            customer: selectedCustomer,
            pos_profile: posProfile,
            selling_price_list: posProfileDetail.selling_price_list,
            set_warehouse: posProfileDetail.warehouse,
            items,
            payments: [{ mode_of_payment: posProfileDetail.payments[0].mode_of_payment }],
          });
  
      alert(`${selectedItem.quantity} item ${selectedItem.item_code} berhasil ditambahkan ke keranjang`);
      setPosInvoice(updatedInvoice);
      setCartQuantity(updatedInvoice.total_qty);
      handleCloseModal();
      await AsyncStorage.setItem('posInvoice', JSON.stringify(updatedInvoice));
      return true;
    } catch (error) {
      console.error('Error processing POS Invoice:', error);
      Alert.alert("Error", "Failed to process POS Invoice.");
      return false;
    }
  };
  

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedItem(initSelectedItem);
  };

  const resetPOSInvoice = async () => {
    const data = await AsyncStorage.getItem('posInvoice');
    if (!data) return setCartQuantity(0)

    const parsedData = await JSON.parse(data);
    // console.log('Parsed Data:', parsedData);
    
    setSelectedCustomer(parsedData.customer);
    setPosInvoice(parsedData);
    setCartQuantity(parsedData.total_qty || 0);
  };

  useFocusEffect(
    useCallback(() => {
      resetPOSInvoice();
    }, [])
  );
  
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    if (!userData || !posProfile) return;
    debounce(fetchPOSItems, 1000);
  }, [userData, posProfile, searchItemQuery, fetchPOSItems]);

  useEffect(() => {
    debounce(() => fetchCustomers(searchCustomerQuery), 1000);
  }, [searchCustomerQuery, fetchCustomers]);

  useEffect(() => {
    setClearIconVisible(!!searchItemQuery);
  }, [searchItemQuery]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SelectCustomer
        customers={customerList}
        onCreateCustomer={handleCreateCustomer}
        selectedCustomer={selectedCustomer}
        onCustomerSelect={handleSelectCustomer}
        searchQuery={searchCustomerQuery}
        onSearchInputChange={handleSearchCustomerChange}
      />

      <ThemedView style={styles.searchAndCartContainer}>
        <ThemedView style={styles.searchInputContainer}>
          <TextInput
            value={searchItemQuery}
            onChangeText={handleSearchItemChange}
            style={styles.searchInput}
            placeholder="Search by item name or code"
          />
          {isClearIconVisible && (
            <Entypo
              name="circle-with-cross"
              size={24}
              color="black"
              style={styles.searchClearIcon}
              onPress={() => {
                setSearchItemQuery("");
                setClearIconVisible(false);
              }}
            />
          )}
        </ThemedView>
        <CartButton
          qty={cartQuantity}
          onPress={() => navigation.navigate("cart")}
        />
      </ThemedView>

      {itemList.length === 0 && searchItemQuery !== "" ? (
        <ThemedView style={styles.emptyListContainer}>
          <ThemedText>Item tidak ditemukan</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={itemList}
          keyExtractor={(item) => item.item_code}
          renderItem={({ item }: { item: iItemCart }) => (
            <ItemCard
              item={item}
              isModalVisible={isModalVisible}
              setItemList={setItemList}
              setSelectedItem={handleSelectItem}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        />
      )}

      <InsertSerialNumber
        posInvoice={posInvoice}
        selectedItem={selectedItem}
        setSelectedItem={setSelectedItem}
        isModalVisible={isModalVisible}
        onSave={handleAddToCart}
        onClose={handleCloseModal}
      />
    </KeyboardAvoidingView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingBottom: 0,
    backgroundColor: "#f5f5f5",
  },
  emptyListContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "transparent"
  },
  searchAndCartContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "transparent",
    gap: 12,
  },
  searchInputContainer: {
    flex:1,
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
});
