import React, { useState } from "react";
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
import { SelectCustomer } from "@/components/point-of-sale/SelectCustomer";
import { ThemedView } from "@/components/ThemedView";
import { CartButton } from "@/components/point-of-sale/CartButton";

interface Customer {
  name: string;
}

const ITEM_LIST: iItemCart[] = [
  {
    item_group: "Voucher",
    item_code: "PKT408",
    item_name: "Voucher 1.5GB 3 Hari Zona 3",
    price: 47000,
    discount: 8000,
    stock: 258,
  },
  {
    item_group: "Voucher",
    item_code: "PKT409",
    item_name: "Voucher 3GB 5 Hari Zona 3",
    price: 85000,
    discount: 0,
    stock: 150,
  },
  {
    item_group: "Voucher",
    item_code: "PKT410",
    item_name: "Voucher 1.5GB 3 Hari Zona 3",
    price: 47000,
    discount: 8000,
    stock: 258,
  },
  {
    item_group: "Voucher",
    item_code: "PKT411",
    item_name: "Voucher 3GB 5 Hari Zona 3",
    price: 85000,
    discount: 0,
    stock: 150,
  },
  {
    item_group: "Voucher",
    item_code: "PKT412",
    item_name: "Voucher 1.5GB 3 Hari Zona 3",
    price: 47000,
    discount: 8000,
    stock: 258,
  },
  {
    item_group: "Voucher",
    item_code: "PKT413",
    item_name: "Voucher 3GB 5 Hari Zona 3",
    price: 85000,
    discount: 0,
    stock: 150,
  },
  {
    item_group: "Voucher",
    item_code: "PKT414",
    item_name: "Voucher 1.5GB 3 Hari Zona 3",
    price: 47000,
    discount: 8000,
    stock: 258,
  },
  {
    item_group: "Voucher",
    item_code: "PKT415",
    item_name: "Voucher 3GB 5 Hari Zona 3",
    price: 85000,
    discount: 0,
    stock: 150,
  },
];

const CUSTOMER_LIST: Customer[] = [
  {
    name: "40123456 - Masniah",
  },
  {
    name: "40123457 - HARMOKO",
  },
];

export default function PointOfSaleScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateCustomer = () => {
    console.log("Create New Customer button pressed");
    Alert.alert("Create Customer", `Nama: ${CUSTOMER_LIST[0].name}\n`);
  };

  const handleSearchInputChange = (text: string) => {
    setSearchQuery(text);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SelectCustomer
        customers={CUSTOMER_LIST}
        onCreateCustomer={handleCreateCustomer}
      />

      <ThemedView style={styles.searchAndCartContainer}>
        <TextInput value={searchQuery} onChangeText={handleSearchInputChange} style={styles.searchInput} placeholder="Search by item name or code" />
        <CartButton qty={68} onPress={() => navigation.navigate("cart")} />
      </ThemedView>

      <FlatList
        data={ITEM_LIST}
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
