import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
//import styles from './styles';

const DatePickerGroup = ({ label, date, showDatePicker, hideDatePicker, handleConfirmDate, isVisible }) => (
  <View style={styles.datePickerContainer}>
    <Text style={styles.label}>{label}</Text>
    <TouchableOpacity onPress={showDatePicker} style={styles.datePicker}>
      <Text style={styles.dateText}>{formatDate(date)}</Text>
      <Icon name="calendar" size={26} color="#000" style={styles.dateIcon} />
    </TouchableOpacity>
    <DateTimePickerModal
      isVisible={isVisible}
      mode="date"
      onConfirm={handleConfirmDate}
      onCancel={hideDatePicker}
    />
  </View>
);

export default DatePickerGroup;