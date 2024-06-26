import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DropDownGroup = ({ data, selectValue, oneSelect }) => {
  const [option, setOption] = React.useState(false);

  const selectOption = () => {
    setOption(!option);
  };

  const oneSelectItem = (val) => {
    setOption(false);
    oneSelect(val);
  };

  return (
    <View>
      <TouchableOpacity
        style={styles.dropDownStyle}
        onPress={selectOption}
      >
        <Text>{selectValue ? selectValue.name : 'Choose Option'}</Text>
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <MaterialCommunityIcons name="chevron-down" size={20} />
        </View>
      </TouchableOpacity>
      {option && (
        <View style={styles.openDropDown}>
          {data.map((val) => (
            <TouchableOpacity
              key={val.id}
              onPress={() => oneSelectItem(val)}
              style={{
                ...styles.optionName,
                backgroundColor: val.id === selectValue?.id ? 'pink' : 'yellow',
              }}
            >
              <Text>{val.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropDownStyle: {
    backgroundColor: '#eab676',
    minHeight: 40,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    width: '100%',
  },
  openDropDown: {
    backgroundColor: 'red',
    padding: 10,
    marginVertical: 5,
  },
  optionName: {
    margin: 5,
    padding: 10,
    borderRadius: 4,
  },
});

export default DropDownGroup;