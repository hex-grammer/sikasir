import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { Text, StyleSheet, Pressable, GestureResponderEvent, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';

interface ButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  title?: string;
  type?: 'primary' | 'secondary' | 'outline' | 'danger' | 'text';
  children?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  isLoading?: boolean;
}

export default function CustomButton({
  onPress,
  title = 'Save',
  type = 'primary',
  children,
  style,
  textStyle,
  isLoading = false, // Default is false
}: ButtonProps) {
  const buttonStyle = getButtonStyle(type);
  const buttonTextStyle = getTextStyle(type);

  return (
    <Pressable style={[styles.button, buttonStyle, style]} onPress={onPress} disabled={isLoading}>
      {isLoading ? (
        <ActivityIndicator color={buttonTextStyle.color || 'white'} /> // Show loading spinner when isLoading is true
      ) : (
        children ? (
          children
        ) : (
          <Text style={[styles.text, buttonTextStyle, textStyle]}>{title}</Text>
        )
      )}
    </Pressable>
  );
}

const getButtonStyle = (type: ButtonProps['type']): ViewStyle => {
  const colorScheme = useColorScheme();
  switch (type) {
    case 'primary':
      return { backgroundColor: Colors[colorScheme ?? 'light'].tint };
    case 'secondary':
      return { backgroundColor: '#6C757D' };
    case 'outline':
      return { backgroundColor: 'transparent', borderWidth: 1, borderColor: 'black' };
    case 'danger':
      return { backgroundColor: '#DC3545' };
    case 'text':
      return { backgroundColor: 'transparent' };
    default:
      return { backgroundColor: '#24a0ed' };
  }
};

const getTextStyle = (type: ButtonProps['type']): TextStyle => {
  switch (type) {
    case 'outline':
      return { color: 'black', elevation: 0 };
    case 'text':
      return { color: 'gray', elevation: 0 };
    default:
      return { color: 'white', elevation: 3, fontWeight: 'bold' };
  }
};

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 4,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    letterSpacing: 0.25,
  },
});
