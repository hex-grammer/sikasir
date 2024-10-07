import React from 'react';
import { Text, StyleSheet, Pressable, GestureResponderEvent, ViewStyle, TextStyle } from 'react-native';

// Define the props interface for the Button component
interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  type?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text'; // Define possible types
  children?: React.ReactNode; // Add children prop to allow custom content
  style?: ViewStyle; // Allow custom button styles to be passed
  textStyle?: TextStyle; // Allow custom text styles to be passed
}

export default function Button({
  onPress,
  title = 'Save',
  type = 'primary',
  children,
  style, // Accept custom button style
  textStyle, // Accept custom text style
}: ButtonProps) {
  const buttonStyle = getButtonStyle(type);
  const buttonTextStyle = getTextStyle(type);

  return (
    <Pressable style={[styles.button, buttonStyle, style]} onPress={onPress}>
      {children ? (
        children // Render custom children if passed
      ) : (
        <Text style={[styles.text, buttonTextStyle, textStyle]}>{title}</Text> // Fallback to title if no children
      )}
    </Pressable>
  );
}

// Helper function to get button style based on the type
const getButtonStyle = (type: ButtonProps['type']): ViewStyle => {
  switch (type) {
    case 'primary':
      // return { backgroundColor: '#24a0ed' }; // blue
      return { backgroundColor: 'black' }; // blue
    case 'secondary':
      return { backgroundColor: '#6C757D' }; // gray
    case 'outline':
      // return { backgroundColor: 'transparent', borderWidth: 2, borderColor: '#24a0ed' };
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'black' };
    case 'danger':
      return { backgroundColor: '#DC3545' }; // red
    case 'text':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: '#24a0ed' }; // default to primary
  }
};

// Helper function to get text style based on the type
const getTextStyle = (type: ButtonProps['type']): TextStyle => {
  switch (type) {
    case 'outline':
      // return { color: '#24a0ed', elevation: 0 }; // Blue text for outline
      return { color: 'black', elevation: 0 }; // Blue text for outline
    case 'text':
      return { color: 'gray', elevation: 0 }; // Gray text for text type
    default:
      return { color: 'white', elevation: 3, fontWeight: 'bold' }; // White text for other types
  }
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: 4,
    // flex: 1,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
});
