import React, { useCallback, useEffect, useState } from "react";
import {StyleSheet,FlatList,TextInput,KeyboardAvoidingView,Platform,Alert,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { HomeScreenNavigationProp } from "./_layout";
import ItemCard, { iItemCart } from "@/components/point-of-sale/ItemCard";
import { SelectCustomer, iSelectCustomer } from "@/components/point-of-sale/SelectCustomer";
import { ThemedView } from "@/components/ThemedView";
import { CartButton } from "@/components/point-of-sale/CartButton";
import { getPOSItems } from "@/services/pos/getPOSItems";
import { getUserData, iUserData } from "@/services/user/getUserData";
import { checkOpeningEntry } from "@/services/pos/checkOpeningEntry";
import { searchCustomer } from "@/services/pos/searchCustomer";
import { Entypo } from "@expo/vector-icons";
import { debounce } from "@/utils/debounce";
import { ThemedText } from "@/components/ThemedText";
import { createCustomer, iCreateCustomerModal } from "@/services/customer/createCustomer";
import { uploadFile } from "@/services/uploadFile";

export default function PointOfSaleScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userData, setUserData] = useState<iUserData | null>(null);
  const [posProfile, setPosProfile] = useState<string>("");
  
  // Separate states for customers and items
  const [searchCustomerQuery, setSearchCustomerQuery] = useState<string>("");
  const [searchItemQuery, setSearchItemQuery] = useState<string>("");
  const [customerList, setCustomerList] = useState<iSelectCustomer[]>([]);
  const [itemList, setItemList] = useState<iItemCart[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);
  const [isClearIconVisible, setClearIconVisible] = useState(false);

  // Fetch user data
  const fetchUserData = useCallback(async () => {
    try {
      const result = await getUserData();
      setUserData(result);

      const openingEntryResult = await checkOpeningEntry(result.email);
      const posPro = openingEntryResult.message[0].pos_profile;
      setPosProfile(posPro);
    } catch (error: any) {
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

  // Fetch POS items based on user data and item query
  const fetchPOSItems = useCallback(async () => {
    if (!posProfile) return;
    try {
      const items = await getPOSItems(posProfile, searchItemQuery);
      const processedItems = items.map((item: iItemCart) => ({
        ...item,
        discount: item.discount || 0,
      }));
      setItemList(processedItems);
    } catch (error) {
      console.error("Error fetching POS items:", error);
    }
  }, [posProfile, searchItemQuery]);

  // Fetch customers based on search query
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

  const handleSearchItemChange = (text: string) => {
    setSearchItemQuery(text);
  };

  // Fetch user data on mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Fetch POS items when userData or search item query changes
  useEffect(() => {
    if (!userData || !posProfile) return;
    debounce(fetchPOSItems, 1000);
  }, [userData, posProfile, searchItemQuery, fetchPOSItems]);

  // Fetch customers when search customer query changes
  useEffect(() => {
    debounce(() => fetchCustomers(searchCustomerQuery), 1000);
  }, [searchCustomerQuery, fetchCustomers]);

  useEffect(() => {
    if (searchItemQuery) {
      setClearIconVisible(true);
    } else {
      setClearIconVisible(false);
    }
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
        onCustomerSelect={setSelectedCustomer}
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
          {isClearIconVisible && 
            <Entypo name="circle-with-cross" size={24} color="black" style={styles.searchClearIcon}
              onPress={() => {setSearchItemQuery(""); setClearIconVisible(false);}}
            />
          }
        </ThemedView>
        <CartButton qty={68} onPress={() => navigation.navigate("cart")} />
      </ThemedView>

      {
        (itemList.length === 0 && searchItemQuery !== "") ? (
          <ThemedView style={styles.emptyListContainer}>
            <ThemedText>Item tidak ditemukan</ThemedText>
          </ThemedView>
        ) : (
          <FlatList
            data={itemList}
            keyExtractor={(item) => item.item_code}
            renderItem={({ item }: { item: iItemCart }) => <ItemCard item={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )
      }
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
