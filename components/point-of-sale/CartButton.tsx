import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

interface CartButtonProps {
  qty: number;
  onPress: () => void;
}

export const CartButton: React.FC<CartButtonProps> = ({ qty, onPress }) => {
  return (
    <Pressable style={styles.button} onPress={onPress}>
      <Ionicons name="cart-outline" size={28} color="#696969" />
      {qty > 0 && (
        <View style={styles.qtyChip}>
            <Text style={styles.qtyText}>{qty > 99 ? '99+' : qty}</Text>
        </View>
    )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'relative',
    padding: 4,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  qtyChip: {
    position: 'absolute',
    top: -3,
    right: -4,
    minWidth: 20,
    backgroundColor: 'red',
    borderRadius: 10,
    padding: 2,
    paddingHorizontal: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
