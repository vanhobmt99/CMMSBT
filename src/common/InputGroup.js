import React from 'react';
import { View, Text, TextInput } from 'react-native';
//import styles from './styles';

const InputGroup = ({ label, required, value, onChangeText, placeholder, keyboardType, multiline, numberOfLines }) => (
  <View style={styles.inputGroup}>
    <View style={styles.labelContainer}>
      <Text style={styles.label}>{label}</Text>
      {required && <Text style={styles.required}>(*)</Text>}
    </View>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      style={styles.textInput}
      keyboardType={keyboardType}
      multiline={multiline}
      numberOfLines={numberOfLines}
    />
  </View>
);

export default InputGroup;