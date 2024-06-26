import React from 'react';
import {Text, View, TouchableOpacity, 
  Image, StyleSheet, StatusBar} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const CustomeHeader = (props) => {
  return (
    <View style={{flexDirection: 'row',height: 50}}>
      { props.isHome ?   
        null  
        : 
        <TouchableOpacity style={{flexDirection : 'row', alignItems : 'center'}}
        onPress = {() => {props.navigation.goBack()}}
        >
            <Icon name="chevron-left" color="#000" size={26} />            
        </TouchableOpacity>
      }  
      <StatusBar barStyle = 'dark-content'></StatusBar>   
      <View style={{flex: 5,justifyContent: 'center'}}>
        <Text style={{marginLeft: 10, fontWeight : 'bold', fontSize : 20, color: '#4169e1'}}>{props.title}</Text>
      </View>      
    </View>
  );
}

const styles = StyleSheet.create({
});