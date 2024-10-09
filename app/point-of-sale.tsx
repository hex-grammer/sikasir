import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  FlatList,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
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

export default function PointOfSaleScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userData, setUserData] = useState<iUserData | null>(null);
  const [searchCustomerQuery, setSearchCustomerQuery] = useState("");
  const [searchItemQuery, setSearchItemQuery] = useState("");
  const [customerList, setCustomerList] = useState<iSelectCustomer[]>([]);
  const [itemList, setItemList] = useState<iItemCart[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const user = await getUserData();
      setUserData(user);
    } catch (error: any) {
      if (error.message === "No session ID found") {
        Alert.alert("Session expired", "Redirecting to login...");
        navigation.navigate("login");
      } else {
        Alert.alert("Error", "Failed to fetch user data");
      }
    }
  };

  // Fetch POS items based on user data
  const fetchPOSItems = async () => {
    try {
      const profileDetail = await checkOpeningEntry(userData?.email);
      const posProfile = profileDetail.message[0].pos_profile;
      const items = await getPOSItems(posProfile);
      items.forEach((item: iItemCart) => {
        if (!item.discount) item.discount = 0;
      });
      setItemList(items);
    } catch (error) {
      console.error("Error fetching POS items:", error);
    }
  };

  // Fetch customers
  const fetchCustomers = async (query: string) => {
    try {
      const customers = await searchCustomer(query);
      setCustomerList(customers);
    } catch (error) {
      console.error("Error fetching customers:", error);
      Alert.alert("Error", "Failed to fetch customers.");
    }
  };

  const handleCreateCustomer = (newCustomer: string) => {
    console.log("Create New Customer:", newCustomer);
    Alert.alert("Create Customer", `Nama: ${newCustomer}`);
  };

  const handleSearchCustomerChange = (text: string) => {
    setSearchCustomerQuery(text);
  };

  const handleSearchItemChange = (text: string) => {
    setSearchItemQuery(text);
  };

  useEffect(() => {
    fetchUserData();
  }, [navigation]);

  useEffect(() => {
    if (userData) fetchPOSItems();
  }, [userData]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers(searchCustomerQuery);
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchCustomerQuery]);

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
        <TextInput
          value={searchItemQuery}
          onChangeText={handleSearchItemChange}
          style={styles.searchInput}
          placeholder="Search by item name or code"
        />
        <CartButton qty={68} onPress={() => navigation.navigate("cart")} />
      </ThemedView>

      <FlatList
        data={itemList}
        keyExtractor={(item) => item.item_code}
        renderItem={({ item }: { item: iItemCart }) => <ItemCard item={item} />}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
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
  searchAndCartContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    backgroundColor: "transparent",
    gap: 12,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: "#fafafa",
  },
});
