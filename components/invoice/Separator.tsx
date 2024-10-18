import React from 'react';
import { View, StyleSheet } from 'react-native';

interface SeparatorProps {
  marginVertical?: number;
}

const Separator: React.FC<SeparatorProps> = ({ marginVertical = 3 }) => {
  return (
    <View style={[styles.separator, { marginVertical }]} />
  );
};

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
    borderStyle: 'dashed',
    width: '100%',
  },
});

export default Separator;

