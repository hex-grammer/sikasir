import React from 'react';
import { Text, StyleSheet, Pressable, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';

// Define the props interface for the Button component
interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  type?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';  // Define possible types
}

export default function Button({ onPress, title = 'Save', type = 'primary' }: ButtonProps) {
  const buttonStyle = getButtonStyle(type);
  const textStyle = getTextStyle(type);

  return (
    <Pressable style={[styles.button, buttonStyle]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{title}</Text>
    </Pressable>
  );
}

// Helper function to get button style based on the type
const getButtonStyle = (type: ButtonProps['type']): ViewStyle => {
  switch (type) {
    case 'primary':
      return { backgroundColor: '#007BFF' }; // blue
    case 'secondary':
      return { backgroundColor: '#6C757D' }; // gray
    case 'outline':
      return { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#007BFF' };
    case 'danger':
      return { backgroundColor: '#DC3545' }; // red
    case 'text':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: '#007BFF' }; // default to primary
  }
};

// Helper function to get text style based on the type
const getTextStyle = (type: ButtonProps['type']): TextStyle => {
  switch (type) {
    case 'outline':
      return { color: '#007BFF', elevation:0 }; // Blue text for outline
    case 'text':
      return { color: 'gray', elevation:0 }; // Black text for text type
    default:
      return { color: 'white', elevation:3, fontWeight: 'bold' }; // White text for other types
  }
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 32,
    borderRadius: 4,
    flex:1,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
});
