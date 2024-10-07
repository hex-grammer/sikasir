import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { HomeScreenNavigationProp } from './_layout';
import ItemCard from '@/components/point-of-sale/ItemCard';
import { SelectCustomer } from '@/components/point-of-sale/SelectCustomer';
import { ThemedView } from '@/components/ThemedView';
import Button from '@/components/Button';
import Ionicons from '@expo/vector-icons/Ionicons';
import { CartButton } from '@/components/point-of-sale/CartButton';

interface Item {
  item_group: string;
  item_code: string;
  item_name: string;
  price: number;
  discount: number;
  stock: number;
}

interface Customer {
  name: string;
}

export default function PointOfSaleScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const ITEM_LIST: Item[] = [
    {
      item_group: 'Voucher',
      item_code: 'PKT408',
      item_name: 'Voucher 1.5GB 3 Hari Zona 3',
      price: 47000,
      discount: 8000,
      stock: 258,
    },
    {
      item_group: 'Voucher',
      item_code: 'PKT409',
      item_name: 'Voucher 3GB 5 Hari Zona 3',
      price: 85000,
      discount: 0,
      stock: 150,
    },
    {
      item_group: 'Voucher',
      item_code: 'PKT410',
      item_name: 'Voucher 1.5GB 3 Hari Zona 3',
      price: 47000,
      discount: 8000,
      stock: 258,
    },
    {
      item_group: 'Voucher',
      item_code: 'PKT411',
      item_name: 'Voucher 3GB 5 Hari Zona 3',
      price: 85000,
      discount: 0,
      stock: 150,
    },
    {
      item_group: 'Voucher',
      item_code: 'PKT412',
      item_name: 'Voucher 1.5GB 3 Hari Zona 3',
      price: 47000,
      discount: 8000,
      stock: 258,
    },
    {
      item_group: 'Voucher',
      item_code: 'PKT413',
      item_name: 'Voucher 3GB 5 Hari Zona 3',
      price: 85000,
      discount: 0,
      stock: 150,
    },
    {
      item_group: 'Voucher',
      item_code: 'PKT414',
      item_name: 'Voucher 1.5GB 3 Hari Zona 3',
      price: 47000,
      discount: 8000,
      stock: 258,
    },
    {
      item_group: 'Voucher',
      item_code: 'PKT415',
      item_name: 'Voucher 3GB 5 Hari Zona 3',
      price: 85000,
      discount: 0,
      stock: 150,
    },
  ];

  const CUSTOMER_LIST: Customer[] = [
    {
        name:"40123456 - Masniah",
    },
    {
        name:"40123457 - HARMOKO",
    }
  ]

  const renderItem = ({ item }: { item: Item }) => (
    <ItemCard item={item} />
  );

  // Function to handle "Create New Customer" press
  const handleCreateCustomer = () => {
    console.log('Create New Customer button pressed');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      {/* select customer */}
      <SelectCustomer customers={CUSTOMER_LIST} onCreateCustomer={handleCreateCustomer} />
        
      <ThemedView style={styles.searchAndCartContainer}>
        <TextInput style={styles.searchInput} placeholder="Search by item name or code" />
        <CartButton qty={68} onPress={() => navigation.navigate('cart')} />
      </ThemedView>

      {/* List of items */}
      <FlatList
        data={ITEM_LIST}
        keyExtractor={(item) => item.item_code}
        renderItem={renderItem}
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
    backgroundColor: '#f5f5f5',
  },
  searchAndCartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8,
    backgroundColor: 'transparent',
    gap: 12,
  },
  searchInput: {
    flex:1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    backgroundColor: '#fafafa',
  },
});
